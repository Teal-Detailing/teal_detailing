import type { Config } from "@netlify/functions";
import {
  fetchUnprocessedSenders,
  fetchIgnoredSenders,
  fetchConversationHistory,
  extractLeadInfo,
  upsertLead,
  markSenderProcessed,
} from "../../lib/leadPipeline";

// Runs every 2 minutes, decoupled from Meta's webhook response deadline.
// Picks up incoming DMs the webhook logged but hasn't AI-extracted yet.
export default async () => {
  const [senders, ignored] = await Promise.all([fetchUnprocessedSenders(), fetchIgnoredSenders()]);

  for (const { senderId, username } of senders) {
    if (ignored.has(String(senderId))) {
      await markSenderProcessed(senderId);
      continue;
    }

    const conversationText = await fetchConversationHistory(senderId);
    const leadInfo = await extractLeadInfo(conversationText);
    if (leadInfo && String(leadInfo.isLead) !== "false") {
      await upsertLead(senderId, username, leadInfo);
    }
    await markSenderProcessed(senderId);
  }

  return new Response(`Processed ${senders.length} sender(s)`);
};

export const config: Config = {
  schedule: "*/2 * * * *",
};
