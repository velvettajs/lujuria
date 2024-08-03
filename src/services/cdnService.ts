import { PutObjectCommand } from "@aws-sdk/client-s3";
import { CdnConfig, CDN_URL } from "../config/config.js";
import * as fs from "fs";
import { s3Client } from "../config/cdn.js";
import path from "path";

const { R2_BUCKET_NAME, R2_ENDPOINT } = CdnConfig;

const getContentType = (fileExtension: string): string => {
  switch (fileExtension) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    case ".mp4":
      return "video/mp4";
    default:
      return "application/octet-stream";
  }
};

export const uploadToCdn = async (
  file: string,
  folder: string,
  title: string,
): Promise<string> => {
  try {
    const fileExtension = path.extname(file);
    const contentType = getContentType(fileExtension);
    const fileStream = fs.createReadStream(file);
    const uploadParams = {
      Bucket: R2_BUCKET_NAME,
      Key: `videos/${folder}/${title}${fileExtension}`,
      Body: fileStream,
      ContentType: contentType,
    };
    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);
    return `${CDN_URL}/videos/${folder}/${title}${fileExtension}`;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("Error uploading file");
  }
};
