const xvideos = require("@rodrigogs/xvideos");
import { eq } from "drizzle-orm";
import db from "../database/dbClient";
import { promises as fs } from "fs";
import { videos } from "../models/video";
import { v4 as uuidv4 } from "uuid";

export const getRandomVideo = async (
  k: string
): Promise<{ url: string; duration: string; k: string }> => {
  try {
    const { pagination } = await xvideos.videos.search({ k });
    const lastPage = pagination.pages[pagination.pages.length - 1];
    const page = Math.floor(Math.random() * lastPage) + 1;
    const { videos } = await xvideos.videos.search({ k, page });
    const { url, duration } = videos[Math.floor(Math.random() * videos.length)];
    return { url, duration, k };
  } catch (error) {
    console.error("Error getting random video", error);
    throw new Error("Error getting random video");
  }
};

export const validateVideo = async (
  url: string,
  duration: string,
  k: string
): Promise<{ url: string; title: string }> => {
  const videoExists = await db
    .select()
    .from(videos)
    .where(eq(videos.x_url, url));
  if (
    duration.includes("h") ||
    parseInt(duration.split(" ")[0], 10) > 6 ||
    videoExists.length > 0
  ) {
    const newVideo = await getRandomVideo(k);
    return validateVideo(newVideo.url, newVideo.duration, k);
  }
  const title: string = uuidv4();
  return { url, title };
};

export const checkFileSize = async (file: string): Promise<number> => {
  try {
    const stats = await fs.stat(file);
    return stats.size / (1024 * 1024);
  } catch (error) {
    console.error("Error checking file size", error);
    throw new Error("Error checking file size");
  }
};
