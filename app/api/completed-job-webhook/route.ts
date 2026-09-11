import { NextRequest, NextResponse } from "next/server";

const PACKAGE_PRICES: Record<string, number> = {
  economy: 99,
  silver: 179,
  gold: 259,
};

const EXPENSE_BUTTON_LABEL = "📝 Expense";
const MAIN_KEYBOARD = {
  keyboard: [[EXPENSE_BUTTON_LABEL]],
  resize_keyboard: true,
};

function todayInEastern(): { display: string; iso: string } {
  return dateInEastern(new Date());
}

function dateInEastern(date: Date): { display: string; iso: string } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(date);
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
  return dateInEastern(future).iso;
}

function parseNumber(v: string): number {
  const n = parseFloat((v || "").replace(/[^0-9.]/g, ""));
  return isNaN(n) ? 0 : n;
}

function parseCompletedJobText(text: string) {
  // Strip a leading "/job" (optionally "/job@botname") command line - this is
  // what makes the bot receive the message at all in a group (Telegram always
  // delivers commands to bots regardless of privacy mode), and it doubles as
  // a clear signal this message is actually a job report, not group chatter.
  const withoutCommand = text.replace(/^\/job(@\w+)?\s*\n?/i, "");
  const lines = withoutCommand.split("\n").map((l) => l.trim());
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

async function sendMessage(chatId: number, text: string, replyMarkup?: Record<string, unknown>) {
  const botToken = process.env.COMPLETED_JOB_BOT_TOKEN;
  if (!botToken) return;
  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, reply_markup: replyMarkup }),
  }).catch((err) => console.error("Failed to send Telegram message:", err));
}

async function replyToTelegram(chatId: number, text: string) {
  await sendMessage(chatId, text, MAIN_KEYBOARD);
}

async function answerCallbackQuery(callbackQueryId: string) {
  const botToken = process.env.COMPLETED_JOB_BOT_TOKEN;
  if (!botToken) return;
  await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ callback_query_id: callbackQueryId }),
  }).catch((err) => console.error("Failed to answer callback query:", err));
}

// Strips the inline keyboard off a message the moment its button is tapped -
// gives instant feedback (no more "is this frozen?") and makes a repeat tap
// on the same message impossible once the client re-renders.
async function stripInlineKeyboard(chatId: number, messageId: number) {
  const botToken = process.env.COMPLETED_JOB_BOT_TOKEN;
  if (!botToken) return;
  await fetch(`https://api.telegram.org/bot${botToken}/editMessageReplyMarkup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, message_id: messageId, reply_markup: { inline_keyboard: [] } }),
  }).catch((err) => console.error("Failed to strip inline keyboard:", err));
}

function inlineKeyboard(options: string[], prefix: string, perRow = 2) {
  const buttons = options.map((opt) => ({ text: opt, callback_data: `${prefix}:${opt}` }));
  const rows: { text: string; callback_data: string }[][] = [];
  for (let i = 0; i < buttons.length; i += perRow) {
    rows.push(buttons.slice(i, i + perRow));
  }
  return { inline_keyboard: rows };
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

type ExpenseOptions = { categories: string[]; paymentMethods: string[]; whoPaid: string[] };

type ExpenseSession = {
  step: "category" | "price" | "date" | "custom_date" | "payment" | "who_paid" | "notes";
  category?: string;
  price?: number;
  expenseDate?: string;
  paymentMethod?: string;
  whoPaid?: string;
  // Cached once at flow start so later steps never re-fetch them - each
  // Apps Script round trip is the main source of latency in this flow.
  options?: ExpenseOptions;
};

async function fetchExpenseOptions(): Promise<ExpenseOptions> {
  const webAppUrl = process.env.COMPLETED_JOBS_WEBAPP_URL;
  const empty = { categories: [], paymentMethods: [], whoPaid: [] };
  if (!webAppUrl) return empty;
  try {
    const res = await fetch(`${webAppUrl}?listExpenseOptions=1`);
    if (!res.ok) return empty;
    return await res.json();
  } catch (err) {
    console.error("Failed to fetch expense options:", err);
    return empty;
  }
}

async function getExpenseSession(chatId: number): Promise<ExpenseSession | null> {
  const webAppUrl = process.env.COMPLETED_JOBS_WEBAPP_URL;
  if (!webAppUrl) return null;
  try {
    const res = await fetch(webAppUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get_expense_session", chatId }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("Failed to get expense session:", err);
    return null;
  }
}

async function setExpenseSession(chatId: number, session: ExpenseSession) {
  const webAppUrl = process.env.COMPLETED_JOBS_WEBAPP_URL;
  if (!webAppUrl) return;
  await fetch(webAppUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "set_expense_session", chatId, session }),
  }).catch((err) => console.error("Failed to set expense session:", err));
}

async function clearExpenseSession(chatId: number) {
  const webAppUrl = process.env.COMPLETED_JOBS_WEBAPP_URL;
  if (!webAppUrl) return;
  await fetch(webAppUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "clear_expense_session", chatId }),
  }).catch((err) => console.error("Failed to clear expense session:", err));
}

async function logExpense(session: ExpenseSession, notes: string): Promise<boolean> {
  const webAppUrl = process.env.COMPLETED_JOBS_WEBAPP_URL;
  if (!webAppUrl) return false;
  try {
    const res = await fetch(webAppUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "log_expense",
        category: session.category,
        price: session.price,
        expenseDate: session.expenseDate,
        paymentMethod: session.paymentMethod,
        whoPaid: session.whoPaid,
        notes,
      }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    return !!data.ok;
  } catch (err) {
    console.error("Failed to log expense:", err);
    return false;
  }
}

async function startExpenseFlow(chatId: number) {
  const options = await fetchExpenseOptions();
  if (options.categories.length === 0) {
    await replyToTelegram(chatId, "⚠️ No categories found yet in the Expenses sheet - add one manually first.");
    return;
  }
  await Promise.all([
    setExpenseSession(chatId, { step: "category", options }),
    sendMessage(chatId, "Which category?", inlineKeyboard(options.categories, "cat")),
  ]);
}

// Each callback carries the step it expects to act on (via `kind`). If the
// session has already moved past that step, this is a stale duplicate from
// mashing a button before the keyboard visually disappeared - drop it rather
// than re-running the transition and sending a repeat prompt.
const EXPECTED_STEP: Record<string, ExpenseSession["step"]> = {
  cat: "category",
  date: "date",
  pay: "payment",
  who: "who_paid",
};

async function handleExpenseCallback(chatId: number, callbackData: string, messageId: number) {
  const sepIndex = callbackData.indexOf(":");
  const kind = callbackData.slice(0, sepIndex);
  const value = callbackData.slice(sepIndex + 1);

  const [session] = await Promise.all([
    getExpenseSession(chatId).then((s): ExpenseSession => s ?? { step: "category" }),
    stripInlineKeyboard(chatId, messageId),
  ]);

  if (session.step !== EXPECTED_STEP[kind]) return;

  const options = session.options ?? (await fetchExpenseOptions());

  if (kind === "cat") {
    session.category = value;
    session.step = "price";
    await Promise.all([
      setExpenseSession(chatId, session),
      sendMessage(chatId, `Category: ${value}\n\nEnter the price ($):`),
    ]);
  } else if (kind === "date") {
    if (value === "today") {
      session.expenseDate = todayInEastern().display;
    } else if (value === "yesterday") {
      session.expenseDate = dateInEastern(new Date(Date.now() - 24 * 60 * 60 * 1000)).display;
    } else {
      session.step = "custom_date";
      await Promise.all([setExpenseSession(chatId, session), sendMessage(chatId, "Type the date (MM/DD/YYYY):")]);
      return;
    }
    session.step = "payment";
    await Promise.all([
      setExpenseSession(chatId, session),
      sendMessage(chatId, `Date: ${session.expenseDate}\n\nPayment method?`, inlineKeyboard(options.paymentMethods, "pay")),
    ]);
  } else if (kind === "pay") {
    session.paymentMethod = value;
    session.step = "who_paid";
    await Promise.all([
      setExpenseSession(chatId, session),
      sendMessage(chatId, `Payment: ${value}\n\nWho paid?`, inlineKeyboard(options.whoPaid, "who")),
    ]);
  } else if (kind === "who") {
    session.whoPaid = value;
    session.step = "notes";
    await Promise.all([
      setExpenseSession(chatId, session),
      sendMessage(chatId, `Who paid: ${value}\n\nAny notes? (or send "-" to skip)`),
    ]);
  }
}

async function handleExpenseTextStep(chatId: number, session: ExpenseSession, text: string) {
  if (session.step === "price") {
    session.price = parseNumber(text);
    session.step = "date";
    await Promise.all([
      setExpenseSession(chatId, session),
      sendMessage(chatId, `Price: $${session.price.toFixed(2)}\n\nWhich date?`, {
        inline_keyboard: [
          [
            { text: "Today", callback_data: "date:today" },
            { text: "Yesterday", callback_data: "date:yesterday" },
          ],
          [{ text: "Pick a date", callback_data: "date:custom" }],
        ],
      }),
    ]);
  } else if (session.step === "custom_date") {
    session.expenseDate = text.trim();
    const options = session.options ?? (await fetchExpenseOptions());
    session.step = "payment";
    await Promise.all([
      setExpenseSession(chatId, session),
      sendMessage(chatId, `Date: ${session.expenseDate}\n\nPayment method?`, inlineKeyboard(options.paymentMethods, "pay")),
    ]);
  } else if (session.step === "notes") {
    const notes = text.trim() === "-" ? "" : text.trim();
    const [ok] = await Promise.all([logExpense(session, notes), clearExpenseSession(chatId)]);
    if (ok) {
      await replyToTelegram(
        chatId,
        `✅ Logged expense: ${session.category} - $${(session.price ?? 0).toFixed(2)} (${session.paymentMethod}, ${session.whoPaid})`
      );
    } else {
      await replyToTelegram(chatId, "⚠️ Something went wrong logging that expense - check the sheet.");
    }
  }
}

export async function POST(request: NextRequest) {
  const update = await verifyAndParse(request);
  if (!update) return new NextResponse("Forbidden", { status: 403 });

  const callbackQuery = update.callback_query;
  if (callbackQuery) {
    const chatId: number | undefined = callbackQuery.message?.chat?.id;
    const messageId: number | undefined = callbackQuery.message?.message_id;
    const data: string | undefined = callbackQuery.data;
    const tasks: Promise<unknown>[] = [answerCallbackQuery(callbackQuery.id)];
    if (chatId && data && messageId) {
      tasks.push(handleExpenseCallback(chatId, data, messageId));
    }
    await Promise.all(tasks);
    return new NextResponse("OK", { status: 200 });
  }

  const message = update.message;
  const text: string | undefined = message?.text;
  const chatId: number | undefined = message?.chat?.id;
  const trimmed = text?.trim() ?? "";
  const isJobCommand = /^\/job(@\w+)?\b/i.test(trimmed);
  const isExpenseStart = /^\/expense(@\w+)?\b/i.test(trimmed) || trimmed === EXPENSE_BUTTON_LABEL;

  if (isJobCommand && text && chatId) {
    const job = parseCompletedJobText(text);
    if (!job.customer) {
      await replyToTelegram(chatId, "⚠️ Couldn't read that - make sure customer name is the first line after /job.");
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
  } else if (isExpenseStart && chatId) {
    await startExpenseFlow(chatId);
  } else if (text && chatId) {
    // Not a command - only act on it if there's an active /expense session
    // awaiting free-text input (price, custom date, or notes). Otherwise
    // ignore silently, so normal group chat never gets misread as data entry.
    const session = await getExpenseSession(chatId);
    if (session && ["price", "custom_date", "notes"].includes(session.step)) {
      await handleExpenseTextStep(chatId, session, text);
    }
  }

  return new NextResponse("OK", { status: 200 });
}
