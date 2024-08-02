import { pgTable, text, integer, uuid } from "drizzle-orm/pg-core";
import { tags } from "./tags";

export const videos = pgTable("videos", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  url: text("url").notNull().unique(),
  preview: text("preview").notNull(),
  image: text("image").notNull(),
  duration: text("duration").notNull(),
  views: integer("views").notNull(),
});

export const videoTags = pgTable("video_tags", {
  videoId: uuid("video_id")
    .notNull()
    .references(() => videos.id),
  tagId: uuid("tag_id")
    .notNull()
    .references(() => tags.id),
});