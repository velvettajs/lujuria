import db from "../config/db.js";
import { videos, videoTags } from "/models/video.js";
import { eq } from "drizzle-orm";
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
