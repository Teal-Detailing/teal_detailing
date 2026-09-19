import { NextRequest, NextResponse } from "next/server";

// Telegram webhook for the content bot's approval buttons.
//
// Deliberately thin: it hands every action to the GitHub Actions content
// agent via repository_dispatch and returns immediately. Publishing means
// fetching photos through Apps Script and building the site, which takes
// minutes - far past a Netlify function's timeout, and a timed-out webhook
// gets retried by Telegram, which is how a post would end up published twice.

const REPO = process.env.CONTENT_AGENT_REPO ?? "Teal-Detailing/teal_detailing";

type Keyboard = { inline_keyboard: { text: string; callback_data: string }[][] };

async function telegram(method: string, body: Record<string, unknown>) {
  const token = process.env.CONTENT_BOT_TOKEN;
  if (!token) return;
  await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(5000),
  }).catch((err) => console.error(`Telegram ${method} failed:`, err));
}

async function dispatch(payload: Record<string, string>): Promise<boolean> {
  const token = process.env.GITHUB_DISPATCH_TOKEN;
  if (!token) return false;
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/dispatches`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
        "User-Agent": "teal-content-bot",
      },
      body: JSON.stringify({ event_type: "content-agent", client_payload: payload }),
      signal: AbortSignal.timeout(8000),
    });
    if (res.status !== 204) console.error("GitHub dispatch returned", res.status);
    return res.status === 204;
  } catch (err) {
    console.error("GitHub dispatch failed:", err);
    return false;
  }
}

const ACK: Record<string, string> = {
  publish: "⏳ Publishing — I'll confirm here in about 3 minutes.",
  skip: "⏳ Skipping that job…",
  next: "⏳ Skipping that job and drafting from the next one — give it a few minutes.",
  draft: "⏳ Drafting a post — give it a few minutes.",
};

function actionFor(data: string, documentFileId?: string): Record<string, string> | null {
  if (data === "cpub") return documentFileId ? { action: "publish", docFileId: documentFileId } : null;
  if (data.startsWith("cskip:")) return { action: "skip", job: data.slice(6) };
  if (data.startsWith("cnext:")) return { action: "next", job: data.slice(6) };
  if (data === "cretry") return { action: "draft" };
  return null;
}

export async function POST(request: NextRequest) {
  // Fail closed. Unlike a bot that only logs data, this one publishes to the
  // public site, so a missing secret or chat ID means "reject everything".
  const secret = process.env.CONTENT_BOT_WEBHOOK_SECRET;
  const allowedChat = process.env.CONTENT_BOT_CHAT_ID;
  if (!secret || !allowedChat || request.headers.get("x-telegram-bot-api-secret-token") !== secret) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const update = await request.json().catch(() => null);
  const callback = update?.callback_query;

  if (callback) {
    const chatId = callback.message?.chat?.id;
    const messageId = callback.message?.message_id;
    await telegram("answerCallbackQuery", { callback_query_id: callback.id });
    if (String(chatId) !== allowedChat || !messageId) return new NextResponse("OK");

    const payload = actionFor(String(callback.data ?? ""), callback.message?.document?.file_id);
    if (!payload) return new NextResponse("OK");

    // Strip the buttons first so a second tap can't queue a second publish.
    await telegram("editMessageReplyMarkup", {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: { inline_keyboard: [] },
    });

    if (await dispatch(payload)) {
      await telegram("sendMessage", { chat_id: chatId, text: ACK[payload.action] });
    } else {
      // Put the original buttons back so the tap can simply be retried.
      const original: Keyboard | undefined = callback.message?.reply_markup;
      await telegram("editMessageReplyMarkup", { chat_id: chatId, message_id: messageId, reply_markup: original });
      await telegram("sendMessage", {
        chat_id: chatId,
        text: "⚠️ Couldn't reach GitHub to start that. The buttons are back — try again in a minute.",
      });
    }
    return new NextResponse("OK");
  }

  // "/draft" in the chat runs the agent on demand instead of waiting for Monday.
  const message = update?.message;
  if (message && String(message.chat?.id) === allowedChat && /^\/draft(@\w+)?\b/i.test(message.text ?? "")) {
    const ok = await dispatch({ action: "draft" });
    await telegram("sendMessage", {
      chat_id: message.chat.id,
      text: ok ? ACK.draft : "⚠️ Couldn't reach GitHub to start a draft. Try again in a minute.",
    });
  }

  return new NextResponse("OK");
}
