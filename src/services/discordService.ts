import { Webhook } from "discord-webhook-node";
import { getGirl } from "../utils/getGirl";

export const sendingWebhook = async (file: string, webhook_url: string) => {
  const girl = await getGirl();
  const hook = new Webhook(webhook_url);
  hook.setAvatar(girl.image);
  hook.setUsername(girl.name);
  hook.sendFile(file);
};
