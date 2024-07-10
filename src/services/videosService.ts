import { processVideo } from "./videoDownloader";
import * as fs from "fs/promises";
import { getTag } from "../utils/getTag";
import { getRandomVideo, checkFileSize } from "./xvideosService";
import { sendingWebhook } from "./discordService";
import { uploadToCdn } from "./cdnService";

export const getVideos = async () => {
  const res = await getTag();
  if (!res) throw new Error("No tags found");
  const { webhook_url, channel_tag } = res;
  const { url, title } = await getRandomVideo(channel_tag);
  let file;
  try {
    file = await processVideo(url, title); // get video filepath
    if ((await checkFileSize(file)) < 25) {
      await sendingWebhook(file, webhook_url);
      console.log(`Message sent to ${channel_tag}`);
    } // send to discord
    await uploadToCdn(file); // upload to cdn
  } catch (error) {
    console.error(`Error sending message to ${channel_tag}:`, error);
  } finally {
    try {
      if (!file) return;
      await fs.unlink(file);
      console.log(`File ${file} deleted successfully`);
    } catch (unlinkError) {
      console.error(`Error deleting file ${file}:`, unlinkError);
    }
  }
};
