import path from "path";
import { XVideos } from "xvideos.js";
import db from "../config/db.js";
import { videos } from "../models/video.js";
import * as fs from "fs/promises";
import { Redis } from "ioredis";

const redis = new Redis();
const xvideos = new XVideos();
class Video {
  private video: VideoType;
  private k: string;
  private db: DbType;
  private lastPage: number;
  private videos;
  constructor(k: string) {
    this.k = k;
    this.db = db;
    this.video;
  }
  private async setup() {
    await this.getLastPage();
    await this.getRandomVideo();
  }
  public async get(): Promise<VideoType> {
    await this.setup();
    return this.videos;
  }
  private async getLastPage(): Promise<void> {
    const lastPage = await redis.get(this.k);
    if (lastPage) return (this.lastPage = JSON.parse(lastPage).lastPage);
    const { pagination } = await xvideos.search(this.k);
    this.lastPage = pagination.lastPage;
    await redis.set(
      this.k,
      JSON.stringify({ lastPage: this.lastPage }),
      "EX",
      604800,
    );
  }

  private async getRandomVideo(): Promise<void> {
    try {
      const page = Math.floor(Math.random() * this.lastPage) + 1;
      const { videos } = await xvideos.search(this.k, page);
      const validVideos = await Promise.all(
        videos.map(async ({ url }) => {
          const isValid = await this.validateVideo(url);
          return isValid ? null : video;
        }),
      );
      this.videos = validVideos.filter((video) => video !== null);
      if (this.videos.length <= 0) return this.setup();
      const video = this.videos[Math.floor(Math.random() * this.videos.length)];
      this.video.title = video.title;
      this.video.description = video.description;
      this.video.url = video.url;
      this.video.image = video.image;
      this.video.duration = video.duration;
      this.video.hls = video.files.hls;
      this.video.low = video.files.low;
      this.video.high = video.files.high;
    } catch (e) {
      throw new Error("Error getting random video: " + e);
    }
  }
  private async validateVideo(url: string): Promise<boolean> {
    const videosInDb = await this.db.select({ url: videos.url }).from(videos);
    return videosInDb.some((v) => url === v.url);
  }
}

export default Video;
