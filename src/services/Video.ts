import path from "path";
import { XVideos } from "xvideos.js";
import { eq } from "drizzle-orm";
import db from "../database/dbClient.js";
import { videos } from "../models/video.js";
import * as fs from "fs/promises";
class Video {
  private xvideos: XVideos;
  private url: string;
  private duration: string;
  private k: string;
  private file: string;
  private db;
  constructor(k: string) {
    this.k = k;
    this.xvideos = new XVideos();
    this.db = db;
  }
  private async setup() {
    await this.getRandomVideo();
    await this.validateVideo();
    await this.downloadFile();
  }
  public async get(): Promise<{ url: string; file: string }> {
    await this.setup();
    return {
      url: this.url,
      file: this.file,
    };
  }

  private async getRandomVideo(): Promise<void> {
    try {
      const { pagination } = await this.xvideos.search(this.k);
      const { lastPage } = pagination;
      const page = Math.floor(Math.random() * lastPage) + 1;
      const videos: Video[] = await this.xvideos.search(this.k, page).videos;
      const { url, duration } =
        videos[Math.floor(Math.random() * videos.length)];
      this.url = url;
      this.duration = duration;
    } catch (e) {
      throw new Error("Error getting random video: " + e);
    }
  }
  private async validateVideo() {
    const videoExists = await this.db
      .select()
      .from(videos)
      .where(eq(videos.x_url, this.url));
    if (
      this.duration.includes("h") ||
      parseInt(this.duration.split(" ")[0], 10) > 6 ||
      videoExists.length
    ) {
      return this.setup();
    }
  }
  private async downloadFile() {
    try {
      this.file = await this.xvideos.downloadHigh(this.url, `videos/${this.k}`);
      if (this.checkFileSize(this.file)) {
        await fs.unlink(this.file);
        this.setup();
      }
    } catch (e) {
      throw new Error("Error downloading file: " + e);
    }
  }
  private async checkFileSize(file: string) {
    try {
      const stats = await fs.stat(file);
      return stats.size / (1024 * 1024);
    } catch (e) {
      throw new Error("Error checking file size: " + e);
    }
  }
}

export default Video;
