import { pgTable, uuid, text } from "drizzle-orm/pg-core";
import { servers } from "./servers";
import { tags } from "./tags";

export const webhooks = pgTable("webhooks", {
  server_id: text("server_id")
    .notNull()
    .references(() => servers.server_id),
  webhook_url: text("webhook_url").primaryKey(),
  tag: uuid("tag")
    .notNull()
    .references(() => tags.id),
});
