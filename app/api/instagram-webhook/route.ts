import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";

// Meta's webhook verification handshake (GET request when you register the webhook URL).
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.META_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }
  return new NextResponse("Forbidden", { status: 403 });
}

function verifySignature(rawBody: string, signatureHeader: string | null): boolean {
  const appSecret = process.env.META_APP_SECRET;
  if (!appSecret) return true; // signature check skipped until META_APP_SECRET is set
  if (!signatureHeader) return false;

  const expected =
    "sha256=" + crypto.createHmac("sha256", appSecret).update(rawBody).digest("hex");

  const a = Buffer.from(expected);
  const b = Buffer.from(signatureHeader);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

async function getInstagramUsername(senderId: string): Promise<string | null> {
  const accessToken = process.env.META_PAGE_ACCESS_TOKEN;
  if (!accessToken) return null;
  try {
    const res = await fetch(
      `https://graph.instagram.com/v21.0/${senderId}?fields=name,username&access_token=${accessToken}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.username ?? data.name ?? null;
  } catch (err) {
    console.error("Failed to resolve Instagram username:", err);
    return null;
  }
}

function describeMessage(message: any): string | null {
  if (message?.text) return message.text;
  const attachments = message?.attachments;
  if (Array.isArray(attachments) && attachments.length > 0) {
    return attachments
      .map((a: any) => {
        const type = a?.type ?? "attachment";
        const url = a?.payload?.url;
        return url ? `[${type}] ${url}` : `[${type}]`;
      })
      .join(", ");
  }
  return null;
}

async function isDuplicateMessage(mid: string | undefined): Promise<boolean> {
  if (!mid) return false;
  const webAppUrl = process.env.GOOGLE_SHEETS_WEBAPP_URL;
  if (!webAppUrl) return false;
  try {
    const res = await fetch(`${webAppUrl}?checkMid=${encodeURIComponent(mid)}`);
    if (!res.ok) return false;
    const data = await res.json();
    return !!data.duplicate;
  } catch (err) {
    console.error("Failed to check duplicate message:", err);
    return false;
  }
}

async function appendRowToSheet(row: Record<string, unknown>) {
  const webAppUrl = process.env.GOOGLE_SHEETS_WEBAPP_URL;
  if (!webAppUrl) return;
  await fetch(webAppUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(row),
  }).catch((err) => console.error("Failed to append row to Google Sheet:", err));
}

async function notifyTelegram(text: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) return;
  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  }).catch((err) => console.error("Failed to send Telegram notification:", err));
}

// Meta calls this every time a new Instagram DM event fires.
export async function POST(request: NextRequest) {
  const rawBody = await request.text();

  if (!verifySignature(rawBody, request.headers.get("x-hub-signature-256"))) {
    return new NextResponse("Invalid signature", { status: 403 });
  }

  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return new NextResponse("Bad Request", { status: 400 });
  }

  if (payload.object === "instagram") {
    for (const entry of payload.entry ?? []) {
      for (const event of entry.messaging ?? []) {
        const isEcho = !!event.message?.is_echo;
        // For our own replies (echoes), the customer is the recipient, not the sender.
        const customerId = isEcho ? event.recipient?.id : event.sender?.id;
        const message = describeMessage(event.message);
        if (!customerId || !message) continue; // skip read receipts, reactions, etc.

        const mid: string | undefined = event.message?.mid;
        if (await isDuplicateMessage(mid)) continue; // Meta redelivers events; mid stays stable across retries

        const timestamp = new Date(event.timestamp ?? Date.now()).toISOString();
        const username = await getInstagramUsername(customerId);
        const displayName = username ? `@${username}` : customerId;
        const direction = isEcho ? "outgoing" : "incoming";

        const tasks = [
          appendRowToSheet({ timestamp, direction, username: username ?? customerId, senderId: customerId, message, mid }),
        ];
        if (!isEcho) {
          tasks.push(notifyTelegram(`New Instagram DM from ${displayName}:\n${message}`));
        }
        await Promise.all(tasks);
        // Lead extraction (AI call + sheet upsert) runs separately via a scheduled
        // function - doing it here would risk this webhook timing out with Meta.
      }
    }
  }

  // Meta requires a fast 200 response regardless of downstream outcome.
  return new NextResponse("EVENT_RECEIVED", { status: 200 });
}
