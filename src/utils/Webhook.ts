import database from "../config/db.js";
import { webhooks } from "/models/webhooks.js";
import { Webhook as Wb, MessageBuilder } from "discord-webhook-node";
import Girl from "./Girl";
import { tags } from "/models/tags";
import { eq } from "drizzle-orm";
import { WEBSITE_DATA as web } from "/config/config.js";
class Webhook {
  private db: DbType;
  private webhook_url: string;
  private tag: string;
  constructor() {
    this.db = database;
  }
  public async setup(): Promise<void> {
    try {
      const result: WebhookType[] = await this.db.select().from(webhooks);
      if (result.length <= 0) throw new Error("No webhooks found");
      const randomIndex = Math.floor(Math.random() * result.length);
      const random: WebhookType = result[randomIndex];
      this.webhook_url = random.webhook_url;
      this.tag = random.tag;
    } catch (error) {
      console.error("Error fetching random tag:", error);
      throw new Error("Failed to fetch random tag");
    }
  }
  public async getTag(): Promise<TagType> {
    const tag: TagType[] = await this.db
      .select()
      .from(tags)
      .where(eq(tags.id, this.tag));
    if (tag.length <= 0) throw new Error("Error finding webhook's tag");
    return tag[0];
  }
  public async send(url: string, preview: string): Promise<void> {
    if (!this.webhook_url) throw new Error("No webhook gotten");
    const newGirl = new Girl();
    const girl = await newGirl.get();
    const hook = new Wb(this.webhook_url);
    hook.setAvatar(girl.avatar);
    hook.setUsername(girl.name);
    const embed = new MessageBuilder()
      .setAuthor(web.name, web.icon, web.url)
      .setUrl(url)
      .setColor(0xe2ccff)
      .setImage(preview)
      .setTitle("New video uploaded! Watch the full video here");
    hook.send(embed);
  }
}

export default Webhook;
