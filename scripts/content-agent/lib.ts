import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import sharp from "sharp";

// Runs in GitHub Actions on a PUBLIC repo, so every log line is public.
// Nothing in this agent logs job details, model output, or URLs carrying
// keys - only stage names, counts, and hashed IDs.

export const SITE = "https://tealdetailing.com";
const STATE_FILE = path.join(process.cwd(), "scripts/content-agent/state.json");

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable ${name}`);
  return value;
}

// Raw job IDs are internal; only this hash is ever written to the repo.
export function hashJobId(jobId: string): string {
  return crypto.createHash("sha256").update(jobId).digest("hex").slice(0, 16);
}

export function todayEastern(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(new Date());
}

// ------------------------------------------------------------------ state

type AgentState = { skippedJobs: string[] };

export function readState(): AgentState {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
  } catch {
    return { skippedJobs: [] };
  }
}

export function addSkippedJob(jobHash: string): boolean {
  const state = readState();
  if (state.skippedJobs.includes(jobHash)) return false;
  state.skippedJobs.push(jobHash);
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2) + "\n");
  return true;
}

// ------------------------------------------------------------------ git

function git(...args: string[]) {
  execFileSync("git", args, { stdio: "inherit" });
}

export function commitAndPush(message: string, paths: string[]) {
  git("config", "user.name", "github-actions[bot]");
  git("config", "user.email", "41898282+github-actions[bot]@users.noreply.github.com");
  git("add", ...paths);
  git("commit", "-m", message);
  // Another run (or a human) may have pushed since checkout.
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      git("pull", "--rebase", "origin", "main");
      git("push", "origin", "HEAD:main");
      return;
    } catch (err) {
      if (attempt === 3) throw err;
    }
  }
}

// ------------------------------------------------------------------ Apps Script

export type Job = {
  jobId: string;
  date: string;
  vehicleType: string;
  packageName: string;
  addOns: string;
  notes: string;
  area: string;
  folderId: string;
};

export type JobPhoto = {
  id: string;
  name: string;
  folder: string;
  created: string;
  role: "before" | "after";
  thumb: string | null;
};

async function callScript<T>(params: Record<string, string>): Promise<T> {
  const url = new URL(requireEnv("CONTENT_SCRIPT_URL"));
  url.searchParams.set("key", requireEnv("CONTENT_SCRIPT_KEY"));
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  // Listing a folder renders a thumbnail per photo, which is slow on Apps
  // Script's side - generous timeout, but bounded so a hang still fails loud.
  const res = await fetch(url, { signal: AbortSignal.timeout(240_000) });
  if (!res.ok) throw new Error(`Apps Script "${params.action}" returned HTTP ${res.status}`);

  const text = await res.text();
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(
      `Apps Script "${params.action}" didn't return JSON - check the deployment's access is set to "Anyone"`
    );
  }
  const error = (data as { error?: string }).error;
  if (error) throw new Error(`Apps Script "${params.action}": ${error}`);
  return data as T;
}

export async function listJobs(days = 120): Promise<Job[]> {
  const { jobs } = await callScript<{ jobs: Job[] }>({ action: "jobs", days: String(days) });
  return jobs;
}

// The photos named "before" and "after" in a job's folder - at most one of
// each - plus how many photos the folder holds in total.
export async function listPhotos(folderId: string): Promise<{ photos: JobPhoto[]; total: number }> {
  return callScript<{ photos: JobPhoto[]; total: number }>({ action: "photos", folderId });
}

export async function getPhoto(folderId: string, fileId: string): Promise<Buffer> {
  const { base64 } = await callScript<{ base64: string }>({ action: "photo", folderId, fileId, size: "1800" });
  return Buffer.from(base64, "base64");
}

// ------------------------------------------------------------------ images

// rotate() applies the phone's EXIF orientation; everything else in the EXIF
// block - including GPS coordinates of the customer's driveway - is dropped,
// since sharp strips metadata unless told to keep it.
export async function toWebJpeg(input: Buffer, width: number): Promise<Buffer> {
  return sharp(input)
    .rotate()
    // Bounded on both sides: phone photos are usually portrait, and a
    // 1600px-wide portrait shot is a 2800px-tall, multi-megabyte image.
    .resize({ width, height: width, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
}

// ------------------------------------------------------------------ post body

// Where each photo sits is a layout detail, not worth failing a whole draft
// (and paying for another) over: the model occasionally drops a marker,
// repeats one, or spells it loosely. Normalise instead - one of each, with a
// missing BEFORE going after the opening paragraph and a missing AFTER going
// before the last section (usually the "keeping it that way" advice).
export function placeImages(body: string): { body: string; found: Record<string, number> } {
  const found: Record<string, number> = {};
  let out = body;
  for (const role of ["BEFORE", "AFTER"]) {
    const loose = new RegExp(`\\{\\{\\s*${role}[_ ]?IMAGE\\s*\\}\\}`, "gi");
    const marker = `{{${role}_IMAGE}}`;
    found[role] = (out.match(loose) ?? []).length;
    let seen = false;
    out = out.replace(loose, () => (seen ? "" : ((seen = true), marker)));
  }
  out = out.replace(/\n{3,}/g, "\n\n").trim();

  // A marker written mid-sentence would drop the photo inside a paragraph;
  // lift it out onto its own line right after that paragraph.
  const paragraphs = out.split(/\n{2,}/).flatMap((p) => {
    const markers = p.match(/\{\{(?:BEFORE|AFTER)_IMAGE\}\}/g);
    if (!markers || p.trim() === markers[0]) return [p];
    const text = p.replace(/\s*\{\{(?:BEFORE|AFTER)_IMAGE\}\}\s*/g, " ").trim();
    return [text, ...markers].filter(Boolean);
  });
  if (!found.BEFORE) {
    const firstProse = paragraphs.findIndex((p) => !p.startsWith("#"));
    paragraphs.splice(firstProse + 1, 0, "{{BEFORE_IMAGE}}");
  }
  if (!found.AFTER) {
    const headings = paragraphs.map((p, i) => (p.startsWith("## ") ? i : -1)).filter((i) => i >= 0);
    const at = headings.length >= 2 ? headings[headings.length - 1] : paragraphs.length;
    paragraphs.splice(at, 0, "{{AFTER_IMAGE}}");
  }
  return { body: paragraphs.join("\n\n"), found };
}

// ------------------------------------------------------------------ Telegram

type InlineKeyboard = { inline_keyboard: { text: string; callback_data: string }[][] };

async function telegram<T = unknown>(method: string, body: Record<string, unknown> | FormData): Promise<T> {
  const isForm = body instanceof FormData;
  const res = await fetch(`https://api.telegram.org/bot${requireEnv("CONTENT_BOT_TOKEN")}/${method}`, {
    method: "POST",
    headers: isForm ? undefined : { "Content-Type": "application/json" },
    body: isForm ? body : JSON.stringify(body),
    signal: AbortSignal.timeout(60_000),
  });
  const data = (await res.json().catch(() => ({}))) as { ok?: boolean; result?: T; description?: string };
  if (!data.ok) throw new Error(`Telegram ${method} failed: ${data.description ?? res.status}`);
  return data.result as T;
}

function chatId(): string {
  return requireEnv("CONTENT_BOT_CHAT_ID");
}

export async function sendText(text: string, replyMarkup?: InlineKeyboard) {
  await telegram("sendMessage", {
    chat_id: chatId(),
    text,
    reply_markup: replyMarkup,
    link_preview_options: { is_disabled: true },
  });
}

// Best-effort variant for error reporting, where a Telegram failure must not
// mask the original error.
export async function trySendText(text: string, replyMarkup?: InlineKeyboard) {
  try {
    await sendText(text, replyMarkup);
  } catch (err) {
    console.error("Could not send Telegram message:", (err as Error).message);
  }
}

export async function sendPhotos(photos: { buffer: Buffer; caption: string }[]) {
  const form = new FormData();
  form.append("chat_id", chatId());
  form.append(
    "media",
    JSON.stringify(photos.map((p, i) => ({ type: "photo", media: `attach://photo${i}`, caption: p.caption })))
  );
  photos.forEach((p, i) => {
    form.append(`photo${i}`, new Blob([new Uint8Array(p.buffer)], { type: "image/jpeg" }), `photo${i}.jpg`);
  });
  await telegram("sendMediaGroup", form);
}

export async function sendDocument(fileName: string, content: string, caption: string, replyMarkup: InlineKeyboard) {
  const form = new FormData();
  form.append("chat_id", chatId());
  form.append("caption", caption.slice(0, 1024));
  form.append("reply_markup", JSON.stringify(replyMarkup));
  form.append("document", new Blob([content], { type: "text/markdown" }), fileName);
  await telegram("sendDocument", form);
}

export async function downloadTelegramFile(fileId: string): Promise<Buffer> {
  const file = await telegram<{ file_path?: string }>("getFile", { file_id: fileId });
  if (!file.file_path) throw new Error("Telegram returned no file path for the draft");
  const res = await fetch(
    `https://api.telegram.org/file/bot${requireEnv("CONTENT_BOT_TOKEN")}/${file.file_path}`,
    { signal: AbortSignal.timeout(60_000) }
  );
  if (!res.ok) throw new Error(`Downloading the draft from Telegram failed: HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

export const retryKeyboard: InlineKeyboard = {
  inline_keyboard: [[{ text: "🔄 Try again", callback_data: "cretry" }]],
};

export function approvalKeyboard(jobHash: string): InlineKeyboard {
  return {
    inline_keyboard: [
      [{ text: "✅ Publish", callback_data: "cpub" }],
      [
        { text: "🔄 Different job", callback_data: `cnext:${jobHash}` },
        { text: "⏭ Skip job", callback_data: `cskip:${jobHash}` },
      ],
    ],
  };
}
