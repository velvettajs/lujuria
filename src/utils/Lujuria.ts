import Video from "./Video";
import * as fs from "fs/promises";
import Webhook from "./Webhook";
import { uploadToCdn } from "/services/cdnService.js";
import { saveVideoInDatabase } from "/services/databaseService.js";

class Lujuria {
  private webhook: Webhook;
  private video: VideoType;
  private tag: TagType;
  async exec(): Promise<void> {
    this.webhook = new Webhook();
    await this.webhook.setup();
    this.tag = await this.webhook.getTag();
    const video = new Video(this.tag.name);
    this.video = await video.get();
    const id = await saveVideoInDatabase(this.video);

    /* FALTA PROCESAMIENTO DE LA CDN
    await uploadToCdn(file, this.tag.name, cdnUrl),
    await this.webhook.send(this.video.url, this.video.preview);
    await fs.unlink(file);
    */
    return;
  }
}

export default Lujuria;
