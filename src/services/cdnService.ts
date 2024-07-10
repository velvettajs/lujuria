import { PutObjectCommand } from "@aws-sdk/client-s3";
import { CdnConfig } from "../config/config";
import * as fs from "fs";
import { s3Client } from "../cdn/cdnClient";

const { R2_BUCKET_NAME, R2_ENDPOINT } = CdnConfig;
export const uploadToCdn = async (
  file: string,
  folder: string,
  title: string
): Promise<string> => {
  try {
    const fileStream = fs.createReadStream(file);
    const uploadParams = {
      Bucket: R2_BUCKET_NAME,
      Key: `videos/${folder}/${title}.mp4`,
      Body: fileStream,
      ContentType: "video/mp4",
    };
    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);
    return `${R2_ENDPOINT}/${R2_BUCKET_NAME}/${title}.mp4`;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("Error uploading file");
  }
};
