import type { Config } from "@netlify/functions";

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
  const s = await fetchDailySummary();
  if (!s) return new Response("No summary available", { status: 200 });

  const text =
    `📊 Daily Summary — Teal Detailing\n\n` +
    `Total Leads: ${s.totalLeads}\n` +
    `Booked: ${s.totalBooked}\n` +
    `Completed: ${s.totalCompleted}\n` +
    `Lost (Not Interested + No Response): ${s.totalLost}\n` +
    `Need Follow-Up: ${s.totalNeedFollowUp}\n\n` +
    `Booking Rate: ${s.bookingRate}\n` +
    `Completion Rate: ${s.completionRate}\n` +
    `Revenue (Completed Jobs): ${s.totalRevenue}\n\n` +
    `Avg Response Time: ${s.avgResponseMinutes} min\n` +
    `Median Response Time: ${s.medianResponseMinutes} min`;

  await notifyTelegram(text);
  return new Response("Sent", { status: 200 });
};

// 9pm Eastern Daylight Time = 01:00 UTC. Netlify's scheduler runs in UTC and
// does not auto-adjust for DST, so this will drift to 8pm once EST kicks in
// (and back to 9pm when EDT resumes) - shift to "0 2 * * *" during EST if
// you want it pinned to 9pm year-round.
export const config: Config = {
  schedule: "0 1 * * *",
};
