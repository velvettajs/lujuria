import { pgTable, varchar, uuid } from "drizzle-orm/pg-core";
import { tags } from "./tags";

export const videos = pgTable("videos", {
  id: uuid("id").primaryKey().defaultRandom(),
  x_url: varchar("x_url", { length: 255 }),
  url: varchar("url", { length: 255 }).notNull(),
  preview: varchar("preview", { length: 255 }).notNull(),
  tag: uuid("tag")
    .notNull()
    .references(() => tags.id),
});
