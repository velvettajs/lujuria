import type { NeonHttpDatabase } from "drizzle-orm/neon-http";

declare global {
  type DbType = NeonHttpDatabase<Record<string, never>>;
  interface WebhookType {
    tag: string;
    webhook_url: string;
    server_id: string;
  }

  interface VideoType {
    id: string;
    title: string;
    description: string;
    url: string;
    preview: string;
    image: string;
    duration: string;
    hls: string;
    low: string;
    high: string;
    views: number;
    tag: string;
  }

  interface GirlType {
    name: string;
    avatar: string;
  }

  interface TagType {
    id: string;
    name: string;
  }

  interface ServerType {
    server_id: string;
  }
}
