import Video from "./Video";
import * as fs from "fs/promises";
import Webhook from "../utils/Webhook.js";
import { sendingWebhook } from "./discordService.js";
import { uploadToCdn } from "./cdnService.js";
import { saveVideoInDatabase } from "./databaseService.js";

export const main = async () => {
  try {
    const webhook = new Webhook();
    const { tag } = await webhook.get();
    const { url, file } = await new Video(tag.name).get();
    await webhook.send(file);
    const [cdnUrl, preview] = await Promise.all([
      uploadToCdn(file, tag.name, title),
      uploadToCdn(file, "preview", title),
    ]); // uploading videos to cdn
    await saveVideoInDatabase(validatedUrl, title, cdnUrl, preview, tag.name); // saving video in database
    await fs.unlink(file);
  } catch (error) {
    console.error(`Error processing video:`, error);
  }
};
