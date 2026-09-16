import type { Config } from "@netlify/functions";

// Flat weekly targets from Plan vs Fact - kept here rather than parsed out of
// that sheet, since these are fixed figures, not something that varies week
// to week.
const WEEKLY_REVENUE_TARGET = 2000;
const WEEKLY_EXPENSE_TARGET = 700;
const BOOKING_RATE_TARGET_PCT = 20;
const COMPLETION_RATE_TARGET_PCT = 13;

// Netlify's scheduled functions get no user watching them fail - an
// unbounded fetch() that hangs until Apps Script (or the platform itself)
// gives up can silently eat the whole run with zero output. Bounding each
// call means a slow response fails fast enough to still send SOMETHING
// (a partial digest, or the failure alert below) instead of nothing at all.
const FETCH_TIMEOUT_MS = 15000;

async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function fetchDailySummary(): Promise<Record<string, unknown> | null> {
  const webAppUrl = process.env.GOOGLE_SHEETS_WEBAPP_URL;
  if (!webAppUrl) return null;
  try {
    const res = await fetchWithTimeout(`${webAppUrl}?dailySummary=1`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("Failed to fetch daily summary:", err);
    return null;
  }
}

async function fetchBookingSummary(): Promise<Record<string, unknown> | null> {
  const webAppUrl = process.env.GOOGLE_SHEETS_WEBAPP_URL;
  if (!webAppUrl) return null;
  try {
    const res = await fetchWithTimeout(`${webAppUrl}?bookingSummary=1`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("Failed to fetch booking summary:", err);
    return null;
  }
}

// Reads directly from the Apps Script bound to the SAME spreadsheet the
// /job and /expense bot writes to (Copy of TRANSACTIONS) - not the old
// original business-account sheet the digest used to read via public CSV
// export, which was a different, disconnected copy.
async function fetchDailyOpsSummary(): Promise<Record<string, unknown> | null> {
  const webAppUrl = process.env.COMPLETED_JOBS_WEBAPP_URL;
  if (!webAppUrl) return null;
  try {
    const res = await fetchWithTimeout(`${webAppUrl}?dailyOpsSummary=1`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("Failed to fetch daily ops summary:", err);
    return null;
  }
}

async function notifyTelegram(text: string) {
  const botToken = process.env.TELEGRAM_SUMMARY_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_SUMMARY_CHAT_ID;
  if (!botToken || !chatId) return;
  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  }).catch((err) => console.error("Failed to send Telegram notification:", err));
}

// 1 (Sunday) through 7 (Saturday) - how far into the Sun-Sat week "today" is,
// used to prorate a weekly target into an "expected by now" figure.
function daysElapsedInWeekEastern(): number {
  const weekday = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", weekday: "short" }).format(new Date());
  const order = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const idx = order.indexOf(weekday);
  return idx === -1 ? 7 : idx + 1;
}

// "lowerIsBetter" flips the ✅/⚠️ framing for expenses, where spending LESS
// than the prorated target is the good outcome, not the bad one.
function paceLine(label: string, actual: number, weeklyTarget: number, daysElapsed: number, lowerIsBetter: boolean): string {
  const expected = weeklyTarget * (daysElapsed / 7);
  const diff = actual - expected;
  const onTrack = lowerIsBetter ? diff <= 0 : diff >= 0;
  const diffAbs = Math.abs(diff).toFixed(0);
  const direction = lowerIsBetter ? (onTrack ? "under" : "over") : (onTrack ? "ahead of" : "behind");
  const icon = onTrack ? "✅" : "⚠️";
  return `${label}: $${actual.toFixed(0)} of $${weeklyTarget} planned (${icon} $${diffAbs} ${direction} pace)`;
}

function rateLine(label: string, actualPct: number, targetPct: number): string {
  const diff = actualPct - targetPct;
  const sign = diff >= 0 ? "+" : "";
  return `${label}: ${actualPct.toFixed(1)}% (target ${targetPct}%, ${sign}${diff.toFixed(1)} pts)`;
}

export default async () => {
  const [s, b, c] = await Promise.all([fetchDailySummary(), fetchBookingSummary(), fetchDailyOpsSummary()]);
  if (!s) {
    // Previously this just returned quietly - meaning a transient Apps
    // Script hiccup at 11pm could skip the whole night's digest with no
    // trace anywhere. Now at least you get told something broke instead of
    // wondering why nothing arrived.
    await notifyTelegram("⚠️ Daily summary failed to generate tonight - couldn't reach the Leads sheet. Check manually if needed.");
    return new Response("No summary available", { status: 200 });
  }

  const stepBreakdown = s.todaysLeadsByStep as Record<string, number> | undefined;
  const stepLines = stepBreakdown && Object.keys(stepBreakdown).length > 0
    ? Object.entries(stepBreakdown).map(([step, count]) => `  • ${step}: ${count}`).join("\n")
    : "  (none)";

  let text =
    `📊 Daily Summary — Teal Detailing\n\n` +
    `Today's Leads: ${s.todaysLeads}\n${stepLines}\n\n`;

  if (b) {
    text += `Today's Bookings: ${b.bookingsToday} ($${Number(b.valueToday).toFixed(0)})\n`;
  }
  if (c) {
    text += `Today's Completed Jobs: ${c.jobsToday} ($${Number(c.revenueToday).toFixed(0)})\n`;
    text += `Today's Expenses: $${Number(c.expensesToday).toFixed(0)}\n`;
  }

  const daysElapsed = daysElapsedInWeekEastern();
  text += `\n📅 Week-to-Date (Sun–Sat)\n`;

  if (c) {
    text += paceLine("Revenue", Number(c.weekRevenue), WEEKLY_REVENUE_TARGET, daysElapsed, false) + "\n";
    text += paceLine("Expenses", Number(c.weekExpenses), WEEKLY_EXPENSE_TARGET, daysElapsed, true) + "\n";
  }

  const weekLeads = Number(s.weekLeads ?? 0);
  const weekBooked = Number(s.weekBooked ?? 0);
  const weekCompleted = Number(s.weekCompleted ?? 0);
  if (weekLeads > 0) {
    const bookingRatePct = (weekBooked / weekLeads) * 100;
    const completionRatePct = (weekCompleted / weekLeads) * 100;
    text +=
      `Leads: ${weekLeads}\n` +
      `  ${rateLine("Booking Rate", bookingRatePct, BOOKING_RATE_TARGET_PCT)}\n` +
      `  ${rateLine("Completion Rate", completionRatePct, COMPLETION_RATE_TARGET_PCT)}\n`;
  } else {
    text += `Leads: 0 so far this week\n`;
  }

  text +=
    `\n⏱ Response Times\n` +
    `Avg: ${s.avgResponseMinutes} min\n` +
    `Median: ${s.medianResponseMinutes} min`;

  await notifyTelegram(text);
  return new Response("Sent", { status: 200 });
};

// 11pm Eastern Daylight Time = 03:00 UTC. Netlify's scheduler runs in UTC and
// does not auto-adjust for DST, so this will drift to 10pm once EST kicks in
// (and back to 11pm when EDT resumes) - shift to "0 4 * * *" during EST if
// you want it pinned to 11pm year-round.
export const config: Config = {
  schedule: "0 3 * * *",
};
