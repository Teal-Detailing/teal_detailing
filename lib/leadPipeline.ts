import Anthropic from "@anthropic-ai/sdk";

export async function fetchConversationHistory(customerId: string, opts?: { onlyNew?: boolean }): Promise<string> {
  const webAppUrl = process.env.GOOGLE_SHEETS_WEBAPP_URL;
  if (!webAppUrl) return "";
  try {
    const onlyNewParam = opts?.onlyNew ? "&onlyNew=1" : "";
    const res = await fetch(`${webAppUrl}?senderId=${encodeURIComponent(customerId)}${onlyNewParam}`);
    if (!res.ok) return "";
    const messages: { direction: string; message: string }[] = await res.json();
    return messages
      .map((m) => `${m.direction === "incoming" ? "Customer" : "Teal Detailing"}: ${m.message}`)
      .join("\n");
  } catch (err) {
    console.error("Failed to fetch conversation history:", err);
    return "";
  }
}

// The full extracted state persists between runs (see setLeadState) so a
// later delta extraction can be told "here's what we already know" instead
// of re-deriving it from scratch - this is what lets fetchConversationHistory
// send only the NEW messages on every call after the first.
export async function fetchLeadState(customerId: string): Promise<Record<string, unknown> | null> {
  const webAppUrl = process.env.GOOGLE_SHEETS_WEBAPP_URL;
  if (!webAppUrl) return null;
  try {
    const res = await fetch(`${webAppUrl}?leadState=${encodeURIComponent(customerId)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data && typeof data === "object" ? data : null;
  } catch (err) {
    console.error("Failed to fetch lead state:", err);
    return null;
  }
}

export async function setLeadState(customerId: string, state: Record<string, unknown>) {
  const webAppUrl = process.env.GOOGLE_SHEETS_WEBAPP_URL;
  if (!webAppUrl) return;
  await fetch(webAppUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "set_lead_state", senderId: customerId, state }),
  }).catch((err) => console.error("Failed to set lead state:", err));
}

// System prompt is static and identical across every call, so it's marked
// cacheable - Anthropic charges roughly 10% of normal input price on a cache
// hit, which matters a lot given how often this runs (every 2 min per lead
// with new activity).
const LEAD_EXTRACTION_SYSTEM_PROMPT =
  "Extract lead information from this Instagram DM conversation with a mobile car " +
  "detailing business. Respond with ONLY a JSON object (no markdown, no commentary) with " +
  "these fields, using an empty string for anything not mentioned or not yet known:\n" +
  '- phone: customer\'s phone number if given\n' +
  "- carType: one of Sedan, SUV, Truck, Van, or empty if unknown\n" +
  "- stepStatus: current stage of the conversation - one of: Asking Car Type, " +
  "Describing Condition, Asking Info, Package Sent, Booked. Only use \"Booked\" once the " +
  "customer has explicitly confirmed the appointment (e.g. replied \"I confirm\" or clearly " +
  "agreed to the offered date/time) - an offer merely being sent is still \"Package Sent\".\n" +
  "- outcome: \"Not Interested\" ONLY if the customer has clearly declined or backed out, " +
  "otherwise empty\n" +
  "- condition: a number 1-10 ONLY if the customer explicitly rated their car's condition " +
  "on that scale, otherwise empty\n" +
  "- package: one of Economy, Silver, Gold, Custom if a specific package was discussed, " +
  "otherwise empty\n" +
  '- price: the dollar amount discussed/quoted, formatted like "$179", otherwise empty\n' +
  "- serviceDescription: a short human-readable summary of the specific services agreed on, " +
  'e.g. "Headlight restoration + interior + exterior", otherwise empty\n' +
  "- customerName: the customer's real name if they gave it, otherwise empty\n" +
  "- address: the service address (where the detailing will happen) if given, otherwise empty\n" +
  "- vehicle: a detailed vehicle description if given, e.g. \"2018 Honda Civic Sedan\" " +
  "(year/make/model, more specific than carType), otherwise empty\n" +
  "- appointmentDateTime: the confirmed appointment date and time if discussed, e.g. " +
  "\"Friday, September 11, 2026 at 9 AM\", otherwise empty\n" +
  "- notes: any other useful detail (language spoken, special requests, quirks), " +
  "otherwise empty\n" +
  "- isLead: false ONLY if this conversation is clearly spam/phishing (generic bot-like " +
  "promos, suspicious links, obviously automated outreach) OR is clearly not a business " +
  "inquiry at all (e.g. only sharing Instagram Reels/memes back and forth, personal chat " +
  "with no mention of car detailing services) - otherwise true\n\n" +
  "You may be given \"Known info so far\" (a JSON object of fields already established from " +
  "earlier in the conversation) followed by only the NEW messages since then. Treat the known " +
  "info as still true and carry it forward unchanged UNLESS a new message updates, corrects, or " +
  "adds to it - e.g. keep a previously-given address/vehicle/phone even if this batch of new " +
  "messages doesn't repeat it. Always respond with the full set of fields, not just what's new.";

export async function extractLeadInfo(
  priorState: Record<string, unknown> | null,
  newMessagesText: string
): Promise<Record<string, unknown> | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || !newMessagesText) return null;

  const userContent = priorState
    ? `Known info so far (JSON):\n${JSON.stringify(priorState)}\n\nNew messages since the last update:\n${newMessagesText}`
    : newMessagesText;

  try {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      system: [{ type: "text", text: LEAD_EXTRACTION_SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: userContent }],
    });
    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") return null;
    // Strip a ```json ... ``` fence in case the model wraps its output despite instructions.
    const cleaned = textBlock.text.trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "");
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Failed to extract lead info:", err);
    return null;
  }
}

export async function upsertLead(customerId: string, username: string, fields: Record<string, unknown>) {
  const webAppUrl = process.env.GOOGLE_SHEETS_WEBAPP_URL;
  if (!webAppUrl) return;
  await fetch(webAppUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "upsert_lead", senderId: customerId, username, ...fields }),
  }).catch((err) => console.error("Failed to upsert lead:", err));
}

export async function fetchUnprocessedSenders(): Promise<{ senderId: string; username: string }[]> {
  const webAppUrl = process.env.GOOGLE_SHEETS_WEBAPP_URL;
  if (!webAppUrl) return [];
  try {
    const res = await fetch(`${webAppUrl}?unprocessedSenders=1`);
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error("Failed to fetch unprocessed senders:", err);
    return [];
  }
}

export async function fetchIgnoredSenders(): Promise<Set<string>> {
  const webAppUrl = process.env.GOOGLE_SHEETS_WEBAPP_URL;
  if (!webAppUrl) return new Set();
  try {
    const res = await fetch(`${webAppUrl}?ignoredSenders=1`);
    if (!res.ok) return new Set();
    const ids: string[] = await res.json();
    return new Set(ids.map(String));
  } catch (err) {
    console.error("Failed to fetch ignored senders:", err);
    return new Set();
  }
}

export async function markSenderProcessed(customerId: string) {
  const webAppUrl = process.env.GOOGLE_SHEETS_WEBAPP_URL;
  if (!webAppUrl) return;
  await fetch(webAppUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "mark_processed", senderId: customerId }),
  }).catch((err) => console.error("Failed to mark sender processed:", err));
}
