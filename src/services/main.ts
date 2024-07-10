import { processVideo } from "./videoService";
import * as fs from "fs/promises";
import { getTag } from "../utils/getTag";
import { getRandomVideo, checkFileSize, validateVideo } from "./xvideosService";
import { sendingWebhook } from "./discordService";
import { uploadToCdn } from "./cdnService";
import { saveVideoInDatabase } from "./databaseService";

export const main = async () => {
  try {
    const res = await getTag();
    if (!res) throw new Error("No tags found");
    const { webhook_url, channel_tag } = res;
    const { url, duration, k } = await getRandomVideo(channel_tag);
    const { url: validatedUrl, title } = await validateVideo(url, duration, k);
    const file = await processVideo(url, title); // get video filepath
    const fileSize = await checkFileSize(file);
    if (fileSize < 25) {
      await sendingWebhook(file, webhook_url);
      console.log(`Message sent to ${channel_tag}`);
    } // send to discord
    const [cdnUrl, preview] = await Promise.all([
      uploadToCdn(file, channel_tag, title),
      uploadToCdn(file, "preview", title),
    ]); // uploading videos to cdn
    await saveVideoInDatabase(
      validatedUrl,
      title,
      cdnUrl,
      preview,
      channel_tag
    ); // saving video in database
    await fs.unlink(file);
  } catch (error) {
    console.error(`Error processing video:`, error);
  }
};
