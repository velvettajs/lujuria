import db from "../config/db.js";
import { videos } from "/models/video.js";
import { eq } from "drizzle-orm";

export async function addPreviewUrl(preview: string, id: string) {
  await db.update(videos).set({ preview }).where(eq(videos.id, id));
}

export const saveVideoInDatabase = async (video): Promise<string> => {
  const [videoId] = await db
    .insert(videos)
    .values(video)
    .returning({ id: videos.id });
  return videoId.id;
};
