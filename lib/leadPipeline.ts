import Anthropic from "@anthropic-ai/sdk";

export async function fetchConversationHistory(customerId: string): Promise<string> {
  const webAppUrl = process.env.GOOGLE_SHEETS_WEBAPP_URL;
  if (!webAppUrl) return "";
  try {
    const res = await fetch(`${webAppUrl}?senderId=${encodeURIComponent(customerId)}`);
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

export async function extractLeadInfo(conversationText: string): Promise<Record<string, unknown> | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || !conversationText) return null;

  try {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      system:
        "Extract lead information from this Instagram DM conversation with a mobile car " +
        "detailing business. Respond with ONLY a JSON object (no markdown, no commentary) with " +
        "these fields, using an empty string for anything not mentioned or not yet known:\n" +
        '- phone: customer\'s phone number if given\n' +
        "- carType: one of Sedan, SUV, Truck, Van, or empty if unknown\n" +
        "- stepStatus: current stage of the conversation - one of: Asking Car Type, " +
        "Describing Condition, Asking Info, Package Sent, Booked\n" +
        "- outcome: \"Not Interested\" ONLY if the customer has clearly declined or backed out, " +
        "otherwise empty\n" +
        "- condition: a number 1-10 ONLY if the customer explicitly rated their car's condition " +
        "on that scale, otherwise empty\n" +
        "- package: one of Economy, Silver, Gold, Custom if a specific package was discussed, " +
        "otherwise empty\n" +
        '- price: the dollar amount discussed/quoted, formatted like "$179", otherwise empty\n' +
        "- notes: any other useful detail (language spoken, special requests, quirks), " +
        "otherwise empty",
      messages: [{ role: "user", content: conversationText }],
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

export async function markSenderProcessed(customerId: string) {
  const webAppUrl = process.env.GOOGLE_SHEETS_WEBAPP_URL;
  if (!webAppUrl) return;
  await fetch(webAppUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "mark_processed", senderId: customerId }),
  }).catch((err) => console.error("Failed to mark sender processed:", err));
}
