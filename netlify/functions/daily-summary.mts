import type { Config } from "@netlify/functions";

const COMPLETED_JOBS_SHEET_ID = "1g4MsYYgTgIo2NuFZcyYcqVhyh8tD0GZ13vW31nXq0JE";

async function fetchDailySummary(): Promise<Record<string, unknown> | null> {
  const webAppUrl = process.env.GOOGLE_SHEETS_WEBAPP_URL;
  if (!webAppUrl) return null;
  try {
    const res = await fetch(`${webAppUrl}?dailySummary=1`);
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
    const res = await fetch(`${webAppUrl}?bookingSummary=1`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("Failed to fetch booking summary:", err);
    return null;
  }
}

// Parses CSV text respecting quoted fields with embedded commas (e.g. addresses).
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      rows.push(row);
      row = [];
    } else {
      field += c;
    }
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function parseMoney(v: string | undefined): number {
  const n = parseFloat(String(v || "").replace(/[^0-9.]/g, ""));
  return isNaN(n) ? 0 : n;
}

function todayInEastern(): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("month")}/${get("day")}/${get("year")}`;
}

async function fetchCompletedJobsSummary(): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch(`https://docs.google.com/spreadsheets/d/${COMPLETED_JOBS_SHEET_ID}/export?format=csv`);
    if (!res.ok) return null;
    const text = await res.text();
    const rows = parseCsv(text).slice(1).filter((r) => (r[0] || "").trim() !== "");

    const today = todayInEastern();
    let jobsToday = 0;
    let revenueToday = 0;
    let revenueAllTime = 0;
    let reviewsSent = 0;

    for (const r of rows) {
      const jobDate = (r[0] || "").trim();
      const total = parseMoney(r[16]);
      const reviewSent = (r[19] || "").trim().toLowerCase() === "yes";

      revenueAllTime += total;
      if (reviewSent) reviewsSent++;
      if (jobDate === today) {
        jobsToday++;
        revenueToday += total;
      }
    }

    return {
      jobsToday,
      revenueToday,
      totalJobsAllTime: rows.length,
      revenueAllTime,
      reviewsSent,
    };
  } catch (err) {
    console.error("Failed to fetch completed jobs summary:", err);
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

export default async () => {
  const [s, b, c] = await Promise.all([
    fetchDailySummary(),
    fetchBookingSummary(),
    fetchCompletedJobsSummary(),
  ]);
  if (!s) return new Response("No summary available", { status: 200 });

  const stepBreakdown = s.todaysLeadsByStep as Record<string, number> | undefined;
  const stepLines = stepBreakdown
    ? Object.entries(stepBreakdown)
        .map(([step, count]) => `  • ${step}: ${count}`)
        .join("\n")
    : "  (none)";

  let text =
    `📊 Daily Summary — Teal Detailing\n\n` +
    `Today's Leads: ${s.todaysLeads}\n${stepLines}\n\n` +
    `Booked: ${s.totalBooked}\n` +
    `Completed: ${s.totalCompleted}\n` +
    `Lost (Not Interested + No Response): ${s.totalLost}\n` +
    `Need Follow-Up: ${s.totalNeedFollowUp}\n\n` +
    `Booking Rate: ${s.bookingRate}\n` +
    `Completion Rate: ${s.completionRate}\n` +
    `Revenue (Completed Jobs): ${s.totalRevenue}\n\n` +
    `Avg Response Time: ${s.avgResponseMinutes} min\n` +
    `Median Response Time: ${s.medianResponseMinutes} min`;

  if (b) {
    text +=
      `\n\n📅 Bookings\n` +
      `New Bookings Today: ${b.bookingsToday}\n` +
      `Today's Booking Value: $${Number(b.valueToday).toFixed(0)}\n` +
      `Total Bookings (all-time): ${b.totalBookings}`;
  }

  if (c) {
    text +=
      `\n\n✅ Completed Jobs\n` +
      `Jobs Completed Today: ${c.jobsToday}\n` +
      `Today's Revenue: $${Number(c.revenueToday).toFixed(0)}\n` +
      `All-Time Jobs: ${c.totalJobsAllTime}\n` +
      `All-Time Revenue: $${Number(c.revenueAllTime).toFixed(0)}\n` +
      `Reviews Requested & Sent: ${c.reviewsSent}`;
  }

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
