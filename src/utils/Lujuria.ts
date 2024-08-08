import Video from "./Video";
import * as fs from "fs/promises";
import Tag from "./Tag";
import { uploadToCdn, deleteFromCdn } from "/services/cdnService.js";
import {
  saveVideoInDatabase,
  saveTagsInDatabase,
  deleteVideoFromDatabase,
  addUrls,
} from "/services/databaseService.js";
import Preview from "./Preview";
import path from "path";

const PREVIEW_PATH = path.join(__dirname, "../preview");

class Lujuria {
  private video: VideoType;
  private tag: TagType;

  async exec(): Promise<void> {
    let videoId: string;
    let previewUrl: string;
    let imageUrl: string;

    try {
      const tag = new Tag();
      this.tag = await tag.get();
      const video = new Video(this.tag.name);
      this.video = await video.get();
      const previewer = new Preview(video.url, this.video.duration);
      const preview = await previewer.get({
        clipCount: 5,
        totalClipDuration: 12,
        excludeSeconds: 5,
      });
      const image: string = await video.getImage(this.video.url, "image");
      const tags: string[] = video.getTags();
      videoId = await saveVideoInDatabase(this.video);
      await saveTagsInDatabase(tags, videoId);
      previewUrl = await uploadToCdn(preview, videoId, "preview");
      imageUrl = await uploadToCdn(image, videoId, "image");
      await addUrls(previewUrl, imageUrl, videoId);
    } catch (error) {
      console.error("An error occurred during execution", error);
      if (videoId) await deleteVideoFromDatabase(videoId);
      if (previewUrl) await deleteFromCdn(previewUrl);
      if (imageUrl) await deleteFromCdn(imageUrl);
      throw new Error(`Execution failed: ${error.message}`);
    } finally {
      try {
        await fs.rm(PREVIEW_PATH, { recursive: true, force: true });
        console.log("Preview folder deleted");
      } catch (error) {
        console.error("Error deleting preview folder", error);
      }
    }
  }
}

export default Lujuria;
