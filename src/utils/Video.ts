import db from "../config/db.js";
import { videos } from "../models/video.js";
import { Redis } from "ioredis";
import { XVideos } from "xvideos.js";
const redis = new Redis();
const xvideos = new XVideos();
class Video {
  private video: VideoType = {};
  private k: string;
  private lastPage: number;
  private videos;
  private tags: string[];
  public url: string;
  public image: string;
  constructor(k: string) {
    this.k = k;
  }
  private async setup() {
    await this.getLastPage();
    await this.getRandomVideo();
  }
  public async get(): Promise<VideoType> {
    await this.setup();
    await this.closeRedis();
    return this.video;
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
        videos.map(async (v) => {
          const isValid = await this.validateVideo(v.url);
          return isValid ? null : v;
        }),
      );
      this.videos = validVideos.filter((video) => video !== null);
      if (this.videos.length <= 0) return this.setup();
      const videoId: string =
        this.videos[Math.floor(Math.random() * this.videos.length)].url;
      const video = await xvideos.details(videoId);
      this.video.title = video.title;
      this.video.description = video.description;
      this.video.url = video.url;
      this.video.image = video.image;
      this.video.duration = video.duration;
      this.tags = video.tags;
      this.url = video.files.high;
    } catch (e) {
      throw new Error("Error getting random video: " + e);
    }
  }
  public getTags(): string[] {
    return this.tags;
  }
  public async getImage(url: string, filename: string): Promise<string> {
    return await xvideos.downloadImage(url, `preview/${filename}`);
  }
  private async validateVideo(url: string): Promise<boolean> {
    const videosInDb = await db.select({ url: videos.url }).from(videos);
    return videosInDb.some((v) => url === v.url);
  }
  private async closeRedis(): Promise<void> {
    await redis.quit();
  }
}

export default Video;
