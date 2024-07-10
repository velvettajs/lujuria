import db from "../database/dbClient";
import { webhooks } from "../models/webhooks";

export const getTag = async (): Promise<{
  channel_tag: string;
  webhook_url: string;
} | null> => {
  try {
    const result = await db
      .select({
        channel_tag: webhooks.channel_tag,
        webhook_url: webhooks.webhook_url,
      })
      .from(webhooks);
    if (result.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * result.length);
    const random = result[randomIndex];
    return {
      channel_tag: random.channel_tag,
      webhook_url: random.webhook_url,
    };
  } catch (error) {
    console.error("Error fetching random tag:", error);
    throw new Error("Failed to fetch random tag");
  }
};
