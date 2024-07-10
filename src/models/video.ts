import { pgTable, varchar } from "drizzle-orm/pg-core";
export const videos = pgTable("videos", {
  x_url: varchar("x_url", { length: 255 }).primaryKey(),
  title: varchar("name", { length: 36 }).notNull(),
  url: varchar("url", { length: 255 }).notNull(),
  preview: varchar("preview", { length: 255 }).notNull(),
  channel_tag: varchar("channel_tag", { length: 100 }).notNull(),
});
