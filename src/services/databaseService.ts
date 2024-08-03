import db from "../config/db.js";
import { videos, videoTags } from "/models/video.js";
import { eq } from "drizzle-orm";
import { tags } from "/models/tags.js";

export async function addPreviewUrl(
  preview: string,
  image: string,
  id: string,
) {
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
  const tagIds = await Promise.all(
    tagsList.map(async (t) => {
      const [tagRecord] = await db
        .insert(tags)
        .values({ name: t })
        .returning({ id: tags.id });
      return tagRecord.id;
    }),
  );

  await db.insert(videoTags).values(
    tagIds.map((tagId) => ({
      videoId,
      tagId,
    })),
  );
};
