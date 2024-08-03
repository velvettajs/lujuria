import Video from "./Video";
import * as fs from "fs/promises";
import Tag from "./Tag";
import { uploadToCdn } from "/services/cdnService.js";
import {
  saveVideoInDatabase,
  saveTagsInDatabase,
  addPreviewUrl,
} from "/services/databaseService.js";
import Preview from "./Preview";
class Lujuria {
  private video: VideoType;
  private tag: TagType;
  async exec(): Promise<void> {
    const tag = new Tag();
    this.tag = await tag.get();
    const video = new Video(this.tag.name);
    this.video = await video.get();
    console.log(this.video.duration);
    const previewer = new Preview(video.url, this.video.duration);
    const preview = await previewer.get();
    console.log(preview);
    /*
    const tags: string[] = await video.getTags();
    const id = await saveVideoInDatabase(this.video);
    await saveTagsInDatabase(tags, id);
    const previewUrl = await uploadToCdn(preview, id, "preview");
    const image = await video.getImage(video.url, id);
    const imageUrl = await uploadToCdn(image, id, "image");
    await addPreviewUrl(previewUrl, imageUrl, id);
    await fs.unlink(preview);*/
    return;
  }
}

export default Lujuria;
