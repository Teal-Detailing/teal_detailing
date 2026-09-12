import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@netlify/blobs";

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
    // Preserved so a later package-name correction (see recomputeJobPricing)
    // can respect an explicit "(\$123)" override instead of discarding it.
    overridePrice,
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

function recomputeJobPricing(job: PendingJob): PendingJob {
  const basePrice = job.overridePrice ?? PACKAGE_PRICES[job.packageName.toLowerCase()] ?? 0;
  const discountPct = parseNumber(job.discount);
  const totalPackagePrice = discountPct ? basePrice * (1 - discountPct / 100) : basePrice;
  const subtotal = totalPackagePrice + job.addOnPrice;
  const total = subtotal + job.tip;
  return { ...job, basePrice, totalPackagePrice, subtotal, total };
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

// Apps Script web apps can hang well past Netlify's function timeout (cold
// starts, LockService contention). Without this, a slow call gets silently
// killed along with the whole request - no error, no message, just nothing.
// Aborting early lets us tell the user to retry instead of going dark.
const APPS_SCRIPT_TIMEOUT_MS = 8000;
// Photo uploads carry a base64 payload plus an actual Drive write, both
// slower than the plain sheet-row calls the default timeout is tuned for.
const APPS_SCRIPT_UPLOAD_TIMEOUT_MS = 20000;

async function fetchAppsScript(url: string, init?: RequestInit, timeoutMs: number = APPS_SCRIPT_TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
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

type LogJobResult = { jobId: string; row: number };

async function logCompletedJob(job: ReturnType<typeof parseCompletedJobText>): Promise<LogJobResult | null> {
  // Separate script/deployment from GOOGLE_SHEETS_WEBAPP_URL - the completed-jobs
  // spreadsheet lives in a different Google account, so it needs its own
  // container-bound script running under that account's own authorization.
  const webAppUrl = process.env.COMPLETED_JOBS_WEBAPP_URL;
  if (!webAppUrl) return null;
  try {
    const res = await fetchAppsScript(webAppUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "log_completed_job", ...job }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.jobId || !data.row) return null;
    return { jobId: data.jobId, row: data.row };
  } catch (err) {
    console.error("Failed to log completed job:", err);
    return null;
  }
}

type PendingJob = ReturnType<typeof parseCompletedJobText>;

type JobFieldKey = "vehicleType" | "packageName" | "addOns" | "paymentType" | "source";

type JobOptions = Record<JobFieldKey, string[]>;

const JOB_FIELD_LABELS: Record<JobFieldKey, string> = {
  vehicleType: "Vehicle Type",
  packageName: "Package",
  addOns: "Add-Ons",
  paymentType: "Payment Type",
  source: "Source",
};

// null means the call itself failed - kept distinct from "no options defined"
// for the same reason as fetchExpenseOptions.
async function fetchJobOptions(): Promise<JobOptions | null> {
  const webAppUrl = process.env.COMPLETED_JOBS_WEBAPP_URL;
  if (!webAppUrl) return null;
  try {
    const res = await fetchAppsScript(`${webAppUrl}?listJobOptions=1`);
    if (!res.ok) {
      console.error("listJobOptions returned non-ok status:", res.status);
      return null;
    }
    const data = await res.json();
    if (!data || !Array.isArray(data.vehicleType)) {
      console.error("listJobOptions returned unexpected shape:", data);
      return null;
    }
    return data;
  } catch (err) {
    console.error("Failed to fetch job options:", err);
    return null;
  }
}

// Case/whitespace-insensitive match against the sheet's actual dropdown list,
// returning the list's own canonical spelling (not whatever casing the user
// typed) so what lands in the sheet exactly matches the validation rule.
function findValidValue(value: string, options: string[]): string | null {
  const trimmed = value.trim().toLowerCase();
  return options.find((o) => o.trim().toLowerCase() === trimmed) ?? null;
}

type JobSession = {
  job: PendingJob;
  // Fields still needing a valid pick, in the order they'll be asked about.
  // Empty means the job is fully valid and ready for the photo step.
  invalidFields: JobFieldKey[];
  options: JobOptions;
};

// Session state for /job, mirroring the expense session below but keyed by
// its own store since /job's shape (parsed all at once from a fixed text
// template, then possibly corrected field-by-field) doesn't fit
// ExpenseSession's step-by-step shape.
function jobSessionStore() {
  return getStore({ name: "job-photo-sessions", consistency: "strong" });
}

async function getJobSession(chatId: number): Promise<JobSession | null> {
  try {
    const raw = await jobSessionStore().get(String(chatId), { type: "json" });
    if (!raw) return null;
    const { session, savedAt } = raw as { session: JobSession; savedAt: number };
    if (Date.now() - savedAt > EXPENSE_SESSION_TTL_MS) {
      await jobSessionStore().delete(String(chatId));
      return null;
    }
    return session;
  } catch (err) {
    console.error("Failed to get job session:", err);
    return null;
  }
}

async function setJobSession(chatId: number, session: JobSession) {
  try {
    await jobSessionStore().setJSON(String(chatId), { session, savedAt: Date.now() });
  } catch (err) {
    console.error("Failed to set job session:", err);
  }
}

async function clearJobSession(chatId: number) {
  try {
    await jobSessionStore().delete(String(chatId));
  } catch (err) {
    console.error("Failed to clear job session:", err);
  }
}

// Writes the job row FIRST and confirms it immediately - the core record
// must never be held hostage by a slow photo upload. The photo (if any) is
// attached as a fast follow-up afterward, via attachJobPhoto.
async function finishJob(chatId: number, job: PendingJob): Promise<LogJobResult | null> {
  const [result] = await Promise.all([logCompletedJob(job), clearJobSession(chatId)]);
  if (result) {
    await replyToTelegram(chatId, `✅ Logged ${result.jobId}: ${job.customer} - ${job.packageName} - $${job.total.toFixed(0)} total`);
  } else {
    await replyToTelegram(chatId, "⚠️ Something went wrong logging that job - check the sheet.");
  }
  return result;
}

async function promptJobFieldFix(chatId: number, session: JobSession) {
  const field = session.invalidFields[0];
  const current = String(session.job[field]);
  await sendMessage(
    chatId,
    `"${current}" isn't a valid ${JOB_FIELD_LABELS[field]} - pick one:`,
    inlineKeyboard(session.options[field], `jobfix:${field}`)
  );
}

async function promptJobPhotoStep(chatId: number, job: PendingJob) {
  await sendMessage(
    chatId,
    `Got it - ${job.customer}, ${job.packageName}, $${job.total.toFixed(0)} total.\n\n📸 Send a photo of the car, or type /skip`
  );
}

// Starts the /job flow: parse the pasted template, then validate the fields
// backed by a sheet dropdown against the sheet's own actual list. A field
// that already matches (typos and case aside) never interrupts the flow -
// only a genuine mismatch triggers a one-tap correction, so the common case
// (paste once, done) stays exactly as fast as before.
async function startJobFlow(chatId: number, job: PendingJob) {
  const options = await fetchJobOptions();
  if (!options) {
    await replyToTelegram(chatId, "⚠️ Couldn't validate that against the sheet just now - resend the /job template to try again.");
    return;
  }

  const invalidFields: JobFieldKey[] = [];
  let correctedJob = job;
  (Object.keys(JOB_FIELD_LABELS) as JobFieldKey[]).forEach((field) => {
    const valid = findValidValue(String(correctedJob[field]), options[field]);
    if (valid !== null) {
      correctedJob = { ...correctedJob, [field]: valid };
    } else {
      invalidFields.push(field);
    }
  });
  // If the package name itself was invalid, pricing derived from it is
  // unreliable - it gets recomputed once the user picks a valid package below.
  if (!invalidFields.includes("packageName")) {
    correctedJob = recomputeJobPricing(correctedJob);
  }

  const session: JobSession = { job: correctedJob, invalidFields, options };
  await setJobSession(chatId, session);
  if (invalidFields.length > 0) {
    await promptJobFieldFix(chatId, session);
  } else {
    await promptJobPhotoStep(chatId, correctedJob);
  }
}

async function handleJobFixCallback(chatId: number, callbackData: string, messageId: number) {
  // callbackData: "jobfix:<field>:<value>" - split on the first two colons
  // only, since the picked value itself may legitimately contain one.
  const [, field, ...rest] = callbackData.split(":");
  const value = rest.join(":");

  const [session] = await Promise.all([getJobSession(chatId), stripInlineKeyboard(chatId, messageId)]);
  if (session === null) {
    await replyToTelegram(chatId, "⚠️ Lost track of that job entry (connection hiccup) - resend the /job template.");
    return;
  }
  if (session.invalidFields[0] !== field) return; // stale duplicate tap, same guard as expense callbacks

  let job = { ...session.job, [field as JobFieldKey]: value };
  if (field === "packageName") job = recomputeJobPricing(job);
  const invalidFields = session.invalidFields.slice(1);

  const updated: JobSession = { ...session, job, invalidFields };
  await setJobSession(chatId, updated);
  if (invalidFields.length > 0) {
    await promptJobFieldFix(chatId, updated);
  } else {
    await promptJobPhotoStep(chatId, job);
  }
}

async function attachJobPhoto(chatId: number, row: number, photos: { file_id: string; width: number; height: number }[]) {
  const folderId = process.env.DRIVE_CUSTOMER_PHOTOS_FOLDER_ID;
  const file = await downloadTelegramFile(largestPhotoFileId(photos));
  const url = file && folderId ? await uploadPhotoToDrive(folderId, file) : null;
  if (url && (await updatePhotoLink("jobs", row, url))) {
    await sendMessage(chatId, "📸 Photo attached.");
  } else {
    await sendMessage(chatId, "⚠️ Photo upload failed - the job is logged, just without a photo.");
  }
}

function largestPhotoFileId(photos: { file_id: string; width: number; height: number }[]): string {
  return photos.reduce((best, p) => (p.width > best.width ? p : best), photos[0]).file_id;
}

async function downloadTelegramFile(fileId: string): Promise<{ base64: string; mimeType: string; fileName: string } | null> {
  const botToken = process.env.COMPLETED_JOB_BOT_TOKEN;
  if (!botToken) return null;
  try {
    const infoRes = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`);
    if (!infoRes.ok) return null;
    const info = await infoRes.json();
    const filePath: string | undefined = info?.result?.file_path;
    if (!filePath) return null;
    const fileRes = await fetch(`https://api.telegram.org/file/bot${botToken}/${filePath}`);
    if (!fileRes.ok) return null;
    const buffer = Buffer.from(await fileRes.arrayBuffer());
    const ext = (filePath.split(".").pop() || "jpg").toLowerCase();
    const mimeType = ext === "png" ? "image/png" : "image/jpeg";
    return { base64: buffer.toString("base64"), mimeType, fileName: `photo_${Date.now()}.${ext}` };
  } catch (err) {
    console.error("Failed to download Telegram file:", err);
    return null;
  }
}

async function uploadPhotoToDrive(
  folderId: string,
  file: { base64: string; mimeType: string; fileName: string }
): Promise<string | null> {
  const webAppUrl = process.env.COMPLETED_JOBS_WEBAPP_URL;
  if (!webAppUrl) return null;
  try {
    const res = await fetchAppsScript(
      webAppUrl,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "upload_photo", folderId, fileName: file.fileName, mimeType: file.mimeType, base64: file.base64 }),
      },
      APPS_SCRIPT_UPLOAD_TIMEOUT_MS
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.url ?? null;
  } catch (err) {
    console.error("Failed to upload photo to Drive:", err);
    return null;
  }
}

async function updatePhotoLink(sheet: "jobs" | "expenses", row: number, link: string): Promise<boolean> {
  const webAppUrl = process.env.COMPLETED_JOBS_WEBAPP_URL;
  if (!webAppUrl) return false;
  try {
    const res = await fetchAppsScript(
      webAppUrl,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_photo_link", sheet, row, link }),
      },
      APPS_SCRIPT_UPLOAD_TIMEOUT_MS
    );
    if (!res.ok) return false;
    const data = await res.json();
    return !!data.ok;
  } catch (err) {
    console.error("Failed to update photo link:", err);
    return false;
  }
}

type ExpenseOptions = { categories: string[]; paymentMethods: string[]; whoPaid: string[] };

type ExpenseSession = {
  step: "category" | "price" | "date" | "custom_date" | "payment" | "who_paid" | "notes" | "photo";
  category?: string;
  price?: number;
  expenseDate?: string;
  paymentMethod?: string;
  whoPaid?: string;
  notes?: string;
  // Cached once at flow start so later steps never re-fetch them - each
  // Apps Script round trip is the main source of latency in this flow.
  options?: ExpenseOptions;
};

// null means the call itself failed (network/timeout/bad response) - kept
// distinct from "genuinely no categories yet" so a transient Apps Script
// hiccup doesn't get shown to the user as "go add a category manually".
async function fetchExpenseOptions(): Promise<ExpenseOptions | null> {
  const webAppUrl = process.env.COMPLETED_JOBS_WEBAPP_URL;
  if (!webAppUrl) return null;
  try {
    const res = await fetchAppsScript(`${webAppUrl}?listExpenseOptions=1`);
    if (!res.ok) {
      console.error("listExpenseOptions returned non-ok status:", res.status);
      return null;
    }
    const data = await res.json();
    if (!data || !Array.isArray(data.categories)) {
      console.error("listExpenseOptions returned unexpected shape:", data);
      return null;
    }
    return data;
  } catch (err) {
    console.error("Failed to fetch expense options:", err);
    return null;
  }
}

// Session bookkeeping for the /expense flow is pure ephemeral state we
// invented ourselves - it doesn't need to touch Google Sheets at all, so it
// lives in Netlify's own key-value store instead of round-tripping through
// Apps Script on every button tap (Apps Script is orders of magnitude slower
// and was the actual cause of the flow hanging/timing out).
const EXPENSE_SESSION_TTL_MS = 30 * 60 * 1000;

function expenseSessionStore() {
  // "strong" consistency because every step immediately reads back the write
  // from the step before it - the default "eventual" consistency can return
  // stale data on that tight a read-after-write gap, which looks exactly like
  // the flow silently swallowing your answer.
  return getStore({ name: "expense-sessions", consistency: "strong" });
}

async function getExpenseSession(chatId: number): Promise<ExpenseSession | null> {
  try {
    const raw = await expenseSessionStore().get(String(chatId), { type: "json" });
    if (!raw) return null;
    const { session, savedAt } = raw as { session: ExpenseSession; savedAt: number };
    if (Date.now() - savedAt > EXPENSE_SESSION_TTL_MS) {
      await expenseSessionStore().delete(String(chatId));
      return null;
    }
    return session;
  } catch (err) {
    console.error("Failed to get expense session:", err);
    return null;
  }
}

async function setExpenseSession(chatId: number, session: ExpenseSession) {
  try {
    await expenseSessionStore().setJSON(String(chatId), { session, savedAt: Date.now() });
  } catch (err) {
    console.error("Failed to set expense session:", err);
  }
}

async function clearExpenseSession(chatId: number) {
  try {
    await expenseSessionStore().delete(String(chatId));
  } catch (err) {
    console.error("Failed to clear expense session:", err);
  }
}

type LogExpenseResult = { row: number };

async function logExpense(session: ExpenseSession, notes: string): Promise<LogExpenseResult | null> {
  const webAppUrl = process.env.COMPLETED_JOBS_WEBAPP_URL;
  if (!webAppUrl) return null;
  try {
    const res = await fetchAppsScript(webAppUrl, {
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
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.ok || !data.row) return null;
    return { row: data.row };
  } catch (err) {
    console.error("Failed to log expense:", err);
    return null;
  }
}

// Writes the expense row FIRST and confirms it immediately, same reasoning
// as finishJob - the receipt photo is a best-effort follow-up, never a
// precondition for the actual expense being recorded.
async function finishExpense(chatId: number, session: ExpenseSession): Promise<LogExpenseResult | null> {
  const notes = session.notes ?? "";
  const [result] = await Promise.all([logExpense(session, notes), clearExpenseSession(chatId)]);
  if (result) {
    await replyToTelegram(
      chatId,
      `✅ Logged expense: ${session.category} - $${(session.price ?? 0).toFixed(2)} (${session.paymentMethod}, ${session.whoPaid})`
    );
  } else {
    await replyToTelegram(chatId, "⚠️ Something went wrong logging that expense - check the sheet.");
  }
  return result;
}

async function attachExpenseReceipt(chatId: number, row: number, photos: { file_id: string; width: number; height: number }[]) {
  const folderId = process.env.DRIVE_RECEIPTS_FOLDER_ID;
  const file = await downloadTelegramFile(largestPhotoFileId(photos));
  const url = file && folderId ? await uploadPhotoToDrive(folderId, file) : null;
  if (url && (await updatePhotoLink("expenses", row, url))) {
    await sendMessage(chatId, "📸 Receipt attached.");
  } else {
    await sendMessage(chatId, "⚠️ Receipt upload failed - the expense is logged, just without a receipt.");
  }
}

async function startExpenseFlow(chatId: number) {
  const options = await fetchExpenseOptions();
  if (!options) {
    await replyToTelegram(chatId, "⚠️ Couldn't reach the Expenses sheet just now - tap 📝 Expense to try again.");
    return;
  }
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

  const [fetchedSession] = await Promise.all([
    getExpenseSession(chatId),
    stripInlineKeyboard(chatId, messageId),
  ]);

  // null means the lookup itself failed (timeout/error), not "no session yet" -
  // surface that instead of silently defaulting, so a real failure doesn't
  // look identical to a dropped stale-duplicate tap.
  if (fetchedSession === null) {
    await replyToTelegram(chatId, "⚠️ Lost track of your /expense progress (connection hiccup) - tap 📝 Expense to restart.");
    return;
  }

  const session = fetchedSession;
  if (session.step !== EXPECTED_STEP[kind]) return;

  if (kind === "cat") {
    session.category = value;
    session.step = "price";
    await Promise.all([
      setExpenseSession(chatId, session),
      sendMessage(chatId, `Category: ${value}\n\nEnter the price ($):`),
    ]);
    return;
  }

  if (kind === "date") {
    if (value === "today") {
      session.expenseDate = todayInEastern().display;
    } else if (value === "yesterday") {
      session.expenseDate = dateInEastern(new Date(Date.now() - 24 * 60 * 60 * 1000)).display;
    } else {
      session.step = "custom_date";
      await Promise.all([setExpenseSession(chatId, session), sendMessage(chatId, "Type the date (MM/DD/YYYY):")]);
      return;
    }
    const options = session.options ?? (await fetchExpenseOptions());
    if (!options) {
      await replyToTelegram(chatId, "⚠️ Couldn't reach the Expenses sheet just now - please try again.");
      return;
    }
    session.step = "payment";
    await Promise.all([
      setExpenseSession(chatId, session),
      sendMessage(chatId, `Date: ${session.expenseDate}\n\nPayment method?`, inlineKeyboard(options.paymentMethods, "pay")),
    ]);
    return;
  }

  if (kind === "pay") {
    const options = session.options ?? (await fetchExpenseOptions());
    if (!options) {
      await replyToTelegram(chatId, "⚠️ Couldn't reach the Expenses sheet just now - please try again.");
      return;
    }
    session.paymentMethod = value;
    session.step = "who_paid";
    await Promise.all([
      setExpenseSession(chatId, session),
      sendMessage(chatId, `Payment: ${value}\n\nWho paid?`, inlineKeyboard(options.whoPaid, "who")),
    ]);
    return;
  }

  if (kind === "who") {
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
    if (!options) {
      await replyToTelegram(chatId, "⚠️ Couldn't reach the Expenses sheet just now - please try again.");
      return;
    }
    session.step = "payment";
    await Promise.all([
      setExpenseSession(chatId, session),
      sendMessage(chatId, `Date: ${session.expenseDate}\n\nPayment method?`, inlineKeyboard(options.paymentMethods, "pay")),
    ]);
  } else if (session.step === "notes") {
    session.notes = text.trim() === "-" ? "" : text.trim();
    session.step = "photo";
    await Promise.all([
      setExpenseSession(chatId, session),
      sendMessage(chatId, `Notes: ${session.notes || "(none)"}\n\n📸 Send a receipt photo, or type /skip`),
    ]);
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
      tasks.push(data.startsWith("jobfix:") ? handleJobFixCallback(chatId, data, messageId) : handleExpenseCallback(chatId, data, messageId));
    }
    await Promise.all(tasks);
    return new NextResponse("OK", { status: 200 });
  }

  const message = update.message;
  const text: string | undefined = message?.text;
  const chatId: number | undefined = message?.chat?.id;
  const photos: { file_id: string; width: number; height: number }[] | undefined = message?.photo;
  const trimmed = text?.trim() ?? "";
  const isJobCommand = /^\/job(@\w+)?\b/i.test(trimmed);
  const isExpenseStart = /^\/expense(@\w+)?\b/i.test(trimmed) || trimmed === EXPENSE_BUTTON_LABEL;
  const isSkipCommand = /^\/skip(@\w+)?\b/i.test(trimmed);

  if (isJobCommand && text && chatId) {
    const job = parseCompletedJobText(text);
    if (!job.customer) {
      await replyToTelegram(chatId, "⚠️ Couldn't read that - make sure customer name is the first line after /job.");
    } else {
      await startJobFlow(chatId, job);
    }
  } else if (isExpenseStart && chatId) {
    await startExpenseFlow(chatId);
  } else if (chatId && photos && photos.length > 0) {
    const jobSession = await getJobSession(chatId);
    if (jobSession && jobSession.invalidFields.length === 0) {
      const result = await finishJob(chatId, jobSession.job);
      if (result) await attachJobPhoto(chatId, result.row, photos);
    } else {
      const expenseSession = await getExpenseSession(chatId);
      if (expenseSession && expenseSession.step === "photo") {
        const result = await finishExpense(chatId, expenseSession);
        if (result) await attachExpenseReceipt(chatId, result.row, photos);
      }
    }
  } else if (isSkipCommand && chatId) {
    const jobSession = await getJobSession(chatId);
    if (jobSession && jobSession.invalidFields.length === 0) {
      await finishJob(chatId, jobSession.job);
    } else {
      const expenseSession = await getExpenseSession(chatId);
      if (expenseSession && expenseSession.step === "photo") {
        await finishExpense(chatId, expenseSession);
      }
    }
  } else if (text && chatId) {
    // Not a command - only act on it if there's an active /expense session
    // awaiting free-text input (price, custom date, notes, or the /skip
    // handled inside the "photo" step). Otherwise ignore silently, so normal
    // group chat never gets misread as data entry.
    const session = await getExpenseSession(chatId);
    if (session && ["price", "custom_date", "notes"].includes(session.step)) {
      await handleExpenseTextStep(chatId, session, text);
    }
  }

  return new NextResponse("OK", { status: 200 });
}
