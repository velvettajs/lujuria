import { VideoPreviewer } from "video-previewer";

class Preview {
  constructor(
    private url: string,
    private duration: number,
  ) {
    this.url = url;
    this.duration = duration;
  }
  private getFrames(
    clipCount: number,
    totalClipDuration: number,
    excludeSeconds: number,
  ): { start: string; end: string }[] {
    if (this.duration <= totalClipDuration + excludeSeconds) {
      excludeSeconds = 0;
    }
    this.duration -= excludeSeconds;
    const segmentDuration = Math.min(
      totalClipDuration / clipCount,
      this.duration / clipCount,
    );
    const clips = [];
    for (let i = 0; i < clipCount; i++) {
      const start = (this.duration / clipCount) * i;
      const end = Math.min(start + segmentDuration, this.duration);
      clips.push({
        start: new Date(start * 1000).toISOString().slice(11, 19),
        end: new Date(end * 1000).toISOString().slice(11, 19),
      });
    }

    return clips;
  }

  async get({
    clipCount,
    totalClipDuration,
    excludeSeconds,
  }: {
    clipCount: number;
    totalClipDuration: number;
    excludeSeconds: number;
  }): Promise<string> {
    const frames = this.getFrames(clipCount, totalClipDuration, excludeSeconds);
    const videoPreviewer = new VideoPreviewer(
      this.url,
      "preview/preview.webp",
      frames,
    );
    return videoPreviewer.exec();
  }
}

export default Preview;
