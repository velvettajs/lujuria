import db from "../config/db.js";
import { videos, videoTags } from "/models/video.js";
import { eq, sql } from "drizzle-orm";
import { tags } from "/models/tags.js";

export async function addUrls(preview: string, image: string, id: string) {
  await db.update(videos).set({ preview, image }).where(eq(videos.id, id));
}

export const saveVideoInDatabase = async (video): Promise<string> => {
  const [videoId] = await db
    .insert(videos)
    .values(video)
    .returning({ id: videos.id });
  return videoId.id;
};

export const saveTagsInDatabase = async (
  tagsList: string[],
  videoId: string,
) => {
  let tagIds = await Promise.all(
    tagsList.map(async (t) => {
      const existingTag = await db
        .select({ id: tags.id })
        .from(tags)
        .where(eq(tags.name, t));
      if (existingTag.length > 0) return existingTag[0].id;
      const [newTag] = await db
        .insert(tags)
        .values({ name: t })
        .returning({ id: tags.id });
      return newTag.id;
    }),
  );
  if (tagIds.length <= 0) {
    let defaultTag: { id: string }[] = await db
      .select({ id: tags.id })
      .from(tags)
      .where(eq(tags.name, "porn"));
    if (defaultTag.length <= 0) {
      defaultTag = await db
        .insert(tags)
        .values({ name: "porn" })
        .returning({ id: tags.id });
    }
    tagIds = [defaultTag[0].id];
  }
  await db.insert(videoTags).values(
    tagIds.map((tagId) => ({
      videoId,
      tagId,
    })),
  );
};

export const deleteVideoFromDatabase = async (
  videoId: string,
): Promise<void> => {
  try {
    await db.delete(videoTags).where(eq(videoTags.videoId, videoId));
    await db.delete(videos).where(eq(videos.id, videoId));
    const remainingTags = await db
      .select({id: tags.id})
      .from(tags)
      .leftJoin(videoTags, eq(tags.id, videoTags.tagId))
      .groupBy(tags.id)
      .having(sql`COUNT(${videoTags.videoId}) = 0`);
    const remainingTagIds = remainingTags.map((tag) => tag.id);
    if (remainingTagIds.length > 0) {
      await db.delete(tags).where(sql`${tags.id} IN (${remainingTagIds})`);
    }
    console.log(
      `Video with ID ${videoId} and associated tags deleted successfully`,
    );
  } catch (error) {
    console.error("Error deleting video from database:", error);
    throw new Error("Error deleting video from database");
  }
};
