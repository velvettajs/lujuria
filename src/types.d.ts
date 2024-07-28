interface WebhookType {
  tag: TagType;
  webhook_url: string;
}

interface VideoType {
  id: any;
  x_url: string;
  preview: string;
  tag: TagType;
}

interface GirlType {
  name: string;
  avatar: string;
}

interface TagType {
  name: string;
}

interface ServerType {
  server_id: string;
}
