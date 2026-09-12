import type { Config } from "@netlify/functions";
import {
  fetchUnprocessedSenders,
  fetchIgnoredSenders,
  fetchConversationHistory,
  fetchLeadState,
  setLeadState,
  extractLeadInfo,
  upsertLead,
  markSenderProcessed,
} from "../../lib/leadPipeline";

// Runs every 2 minutes, decoupled from Meta's webhook response deadline.
// Picks up incoming DMs the webhook logged but hasn't AI-extracted yet.
//
// Each sender's prior extraction result is cached (see setLeadState) so this
// only has to send the NEW messages since last time, not the whole
// conversation from scratch - re-sending full history on every pass was the
// main driver of AI cost, since a long back-and-forth got resent in full on
// every single new message. A sender with no cached state yet (brand new, or
// pre-dating this change) falls back to a one-time full-history extraction,
// which then seeds the cache for every future pass to be cheap.
export default async () => {
  const [senders, ignored] = await Promise.all([fetchUnprocessedSenders(), fetchIgnoredSenders()]);

  for (const { senderId, username } of senders) {
    if (ignored.has(String(senderId))) {
      await markSenderProcessed(senderId);
      continue;
    }

    const priorState = await fetchLeadState(senderId);
    const conversationText = await fetchConversationHistory(senderId, { onlyNew: !!priorState });
    const leadInfo = await extractLeadInfo(priorState, conversationText);
    if (leadInfo) {
      await setLeadState(senderId, leadInfo);
      if (String(leadInfo.isLead) !== "false") {
        await upsertLead(senderId, username, leadInfo);
      }
    }
    await markSenderProcessed(senderId);
  }

  return new Response(`Processed ${senders.length} sender(s)`);
};

export const config: Config = {
  schedule: "*/2 * * * *",
};
