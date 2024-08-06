import Video from "./Video";
import * as fs from "fs/promises";
import Tag from "./Tag";
import { uploadToCdn } from "/services/cdnService.js";
import {
  saveVideoInDatabase,
  saveTagsInDatabase,
  addUrls,
} from "/services/databaseService.js";
import Preview from "./Preview";
import path from "path";

const PREVIEW_PATH = path.join(__dirname, "../preview");

class Lujuria {
  private video: VideoType;
  private tag: TagType;

  async exec(): Promise<void> {
    try {
      console.log("Starting exec...");

      const tag = new Tag();
      this.tag = await tag.get();
      console.log("Tag obtained:", this.tag);

      const video = new Video(this.tag.name);
      this.video = await video.get();
      console.log("Video obtained:", this.video);

      const previewer = new Preview(video.url, this.video.duration);
      const preview = await previewer.get({
        clipCount: 4,
        totalClipDuration: 12,
        excludeSeconds: 5,
      });
      console.log("Preview obtained:", preview);

      const image: string = await video.getImage(this.video.url, "image");
      console.log("Image obtained:", image);

      const tags: string[] = await video.getTags();
      console.log("Tags obtained:", tags);

      const id: string = await saveVideoInDatabase(this.video);
      console.log("Video saved in database with ID:", id);

      await saveTagsInDatabase(tags, id);
      console.log("Tags saved in database");

      const previewUrl: string = await uploadToCdn(preview, id, "preview");
      console.log("Preview uploaded to CDN with URL:", previewUrl);

      const imageUrl: string = await uploadToCdn(image, id, "image");
      console.log("Image uploaded to CDN with URL:", imageUrl);

      await addUrls(previewUrl, imageUrl, id);
      console.log("URLs added to database");
    } catch (e) {
      console.log("Error in main class", e);
      throw new Error(e);
    } finally {
      try {
        await fs.rmdir(PREVIEW_PATH);
        console.log("Preview file deleted");
      } catch (unlinkError) {
        console.error("Failed to delete preview file:", unlinkError);
      }
    }
  }
}

export default Lujuria;
