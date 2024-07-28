import database from "src/database/dbClient.js";
import { webhooks } from "src/models/webhooks.js";
import { Webhook as Wb } from "discord-webhook-node";
import Girl from "./Girl";

class Webhook {
  private db;
  private webhook_url;
  private tag;
  constructor() {
    this.db = database;
    this.webhook_url = webhooks.webhook_url;
    this.tag = webhooks.tag;
  }
  public async get(): Promise<WebhookType> {
    try {
      const result: WebhookType[] = await this.db
        .select({
          tag: this.tag,
          webhook_url: this.webhook_url,
        })
        .from(webhooks);
      if (!result.length) throw new Error("No webhooks found");
      const randomIndex = Math.floor(Math.random() * result.length);
      const random: WebhookType = result[randomIndex];
      return random;
    } catch (error) {
      console.error("Error fetching random tag:", error);
      throw new Error("Failed to fetch random tag");
    }
  }
  async send(file: string) {
    const girl = await new Girl().get();
    const hook = new Wb(this.webhook_url);
    hook.setAvatar(girl.avatar);
    hook.setUsername(girl.name);
    hook.sendFile(file);
  };
};

export default Webhook;
