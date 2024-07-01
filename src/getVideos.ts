// getVideos.ts
import { Webhook } from "discord-webhook-node";
import webhooks from "./jsons/webhooks.json";
import { processVideo } from "./videoConvert";
import { getGirl } from "./getGirl";
import * as fs from "fs/promises";

// Función para pausar la ejecución
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getVideos = async () => {
  for (const item of webhooks) {
    const [key, webhookUrl] = Object.entries(item)[0];

    let videoPath = "";
    let alternativeIndex = 0;
    let next;
    const girl = await getGirl();
    while (!videoPath) {
      try {
        videoPath = await processVideo(key, alternativeIndex, next);
        next = false;
        if (videoPath.includes("Error processing video")) {
          alternativeIndex++;
          if (alternativeIndex >= 27) {
            // Ajusta el límite según lo que consideres apropiado
            console.log(`No more videos available for ${key}. Skipping.`);
            alternativeIndex = 0;
            next = true;
            continue;
          }
          continue;
        }
        const hook = new Webhook(webhookUrl);
        hook.setAvatar(girl.image);
        hook.setUsername(girl.name);
        await hook.sendFile(videoPath);
        console.log(`Message sent to ${key}`);
        break; // Salir del bucle si el video se envió con éxito
      } catch (error) {
        console.error(`Error sending message to ${key}:`, error);
        break; // Salir del bucle en caso de error
      } finally {
        if (videoPath && !videoPath.includes("Error processing video")) {
          try {
            await fs.unlink(videoPath);
            console.log(`File ${videoPath} deleted successfully`);
          } catch (unlinkError) {
            console.error(`Error deleting file ${videoPath}:`, unlinkError);
          }
        }
        await sleep(500000); // Esperar 120 segundos antes de procesar el siguiente webhook
      }
    }
  }
};

// Llama a getVideos una vez al inicio
