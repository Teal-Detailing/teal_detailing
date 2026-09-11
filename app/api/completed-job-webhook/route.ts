import { NextRequest, NextResponse } from "next/server";

const PACKAGE_PRICES: Record<string, number> = {
  economy: 99,
  silver: 179,
  gold: 259,
};

function todayInEastern(): { display: string; iso: string } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const month = get("month");
  const day = get("day");
  const year = get("year");
  return {
    display: `${month}/${day}/${year}`,
    iso: `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`,
  };
}

function addDaysIsoEastern(days: number): string {
  const future = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(future);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("year")}-${get("month").padStart(2, "0")}-${get("day").padStart(2, "0")}`;
}

function parseNumber(v: string): number {
  const n = parseFloat((v || "").replace(/[^0-9.]/g, ""));
  return isNaN(n) ? 0 : n;
}

function parseCompletedJobText(text: string) {
  const lines = text.split("\n").map((l) => l.trim());
  const [
    customer = "",
    phone = "",
    address = "",
    vehicleType = "",
    packageLine = "",
    discount = "",
    addOns = "",
    addOnPriceRaw = "",
    paymentType = "",
    tipRaw = "",
    source = "",
    notes = "",
  ] = lines;

  const packageMatch = packageLine.match(/^([A-Za-z]+)\s*(?:\(\$?([\d.]+)\))?/);
  const packageName = packageMatch ? packageMatch[1] : packageLine;
  const overridePrice = packageMatch && packageMatch[2] ? parseFloat(packageMatch[2]) : null;

  const basePrice = overridePrice ?? PACKAGE_PRICES[packageName.toLowerCase()] ?? 0;
  const discountPct = parseNumber(discount);
  const totalPackagePrice = discountPct ? basePrice * (1 - discountPct / 100) : basePrice;
  const addOnPrice = parseNumber(addOnPriceRaw);
  const tip = parseNumber(tipRaw);
  const subtotal = totalPackagePrice + addOnPrice;
  const total = subtotal + tip;

  const { display: jobDate } = todayInEastern();
  const reminderDate = addDaysIsoEastern(30);

  return {
    jobDate,
    customer,
    phone,
    vehicleType,
    address,
    packageName,
    basePrice,
    discount,
    totalPackagePrice,
    addOns: addOns || "None",
    addOnPrice,
    paymentType,
    subtotal,
    tip,
    total,
    source,
    reminderDate,
    notes,
  };
}

async function verifyAndParse(request: NextRequest): Promise<any | null> {
  const secret = process.env.COMPLETED_JOB_WEBHOOK_SECRET;
  const headerSecret = request.headers.get("x-telegram-bot-api-secret-token");
  if (secret && headerSecret !== secret) return null;
  try {
    return await request.json();
  } catch {
    return null;
  }
}

async function replyToTelegram(chatId: number, text: string) {
  const botToken = process.env.COMPLETED_JOB_BOT_TOKEN;
  if (!botToken) return;
  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  }).catch((err) => console.error("Failed to reply to Telegram:", err));
}

async function logCompletedJob(job: ReturnType<typeof parseCompletedJobText>): Promise<string | null> {
  // Separate script/deployment from GOOGLE_SHEETS_WEBAPP_URL - the completed-jobs
  // spreadsheet lives in a different Google account, so it needs its own
  // container-bound script running under that account's own authorization.
  const webAppUrl = process.env.COMPLETED_JOBS_WEBAPP_URL;
  if (!webAppUrl) return null;
  try {
    const res = await fetch(webAppUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "log_completed_job", ...job }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.jobId ?? null;
  } catch (err) {
    console.error("Failed to log completed job:", err);
    return null;
  }
}

export async function POST(request: NextRequest) {
  const update = await verifyAndParse(request);
  if (!update) return new NextResponse("Forbidden", { status: 403 });

  const message = update.message;
  const text: string | undefined = message?.text;
  const chatId: number | undefined = message?.chat?.id;

  if (text && chatId) {
    const job = parseCompletedJobText(text);
    if (!job.customer) {
      await replyToTelegram(chatId, "⚠️ Couldn't read that - make sure customer name is the first line.");
    } else {
      const jobId = await logCompletedJob(job);
      if (jobId) {
        await replyToTelegram(
          chatId,
          `✅ Logged ${jobId}: ${job.customer} - ${job.packageName} - $${job.total.toFixed(0)} total`
        );
      } else {
        await replyToTelegram(chatId, "⚠️ Something went wrong logging that job - check the sheet.");
      }
    }
  }

  return new NextResponse("OK", { status: 200 });
}
