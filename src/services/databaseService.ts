import db from "../database/dbClient";
import { videos } from "../models/video";

export const saveVideoInDatabase = async (
  x_url: string,
  title: string,
  url: string,
  preview: string,
  channel_tag: string
) => {
  try {
    await db.insert(videos).values({
      x_url,
      title,
      url,
      preview,
      channel_tag,
    });
    console.log(`Video saved in database successfully: ${title}`);
  } catch (error) {
    console.error("Error saving video in database:", error);
    throw new Error("Error saving video in database");
  }
};
