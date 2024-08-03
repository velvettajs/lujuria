import { VideoPreviewer } from "video-previewer";

class Preview {
  constructor(
    private url: string,
    private duration: number,
  ) {
    this.url = url;
    this.duration = duration;
  }
  private getFrames(): { start: string; end: string }[] {
    const totalClipDuration = 12; 
    const clipCount = 3; 
    const segmentDuration =
      this.duration >= totalClipDuration
        ? totalClipDuration / clipCount
        : this.duration / clipCount;

    const clips = [];
    for (let i = 0; i < clipCount; i++) {
      const start = segmentDuration * i;
      const end = start + segmentDuration;
      clips.push({
        start: new Date(Math.min(start, this.duration) * 1000)
          .toISOString()
          .slice(11, 19), 
        end: new Date(Math.min(end, this.duration) * 1000)
          .toISOString()
          .slice(11, 19),
      });
    }

    return clips;
  }

  async get(): Promise<string> {
    const frames = this.getFrames();
    const videoPreviewer = new VideoPreviewer(this.url, frames);
    return videoPreviewer.exec();
  }
}

export default Preview;
