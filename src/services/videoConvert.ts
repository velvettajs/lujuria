import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import util from "util";
import axios from "axios";
import { addProcessedTitle } from "../utils/handleRepeated";
const xvideos = require("@rodrigogs/xvideos");

const pipeline = util.promisify(require("stream").pipeline);

const downloadFile = async (url: string, outputPath: string) => {
  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  if (response.status !== 200) throw new Error(`Failed to fetch ${url}`);

  const writer = fs.createWriteStream(outputPath);
  await pipeline(response.data, writer);
};

const scrapeLocoloader = async (
  pageUrl: string,
  outputFilePath: string,
  retries = 3
) => {
  let browser;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.goto(
        `https://www.tubeninja.net/welcome?url=${encodeURIComponent(pageUrl)}`,
        {
          waitUntil: "networkidle2",
        }
      );

      // Wait for the necessary elements to load
      await page.waitForSelector(".list-group-item-action", { timeout: 30000 });

      // Get the specific download link
      const downloadLink = await page.evaluate(() => {
        const links = Array.from(
          document.querySelectorAll(".list-group-item-action")
        ) as HTMLAnchorElement[];
        const targetLink = links.find((link) => link.href.includes("mp4"));
        return targetLink ? targetLink.href : null;
      });

      if (!downloadLink) {
        throw new Error("Download link not found.");
      }

      // Download the file
      console.log(`Downloading video from ${downloadLink}...`);
      await downloadFile(downloadLink, outputFilePath);

      console.log(`Video downloaded successfully: ${outputFilePath}`);
      await browser.close();
      return;
    } catch (error: any) {
      console.error(`Attempt ${attempt + 1} failed: ${error.message}`);
      if (browser) await browser.close();
      if (attempt === retries - 1) {
        console.error("All attempts failed.");
        throw error;
      }
      console.log("Retrying...");
    }
  }
};

export const processVideo = async (
  query: string,
  alternativeIndex: number = 0,
  next: boolean = false
): Promise<string> => {
  try {
    let page = 1;
    if (next) {
      page++;
    }
    const searchResults = await xvideos.videos.search({ k: query, page });
    if (searchResults.videos.length === 0) {
      throw new Error("No videos found");
    }
    let video;
    let videoIndex = alternativeIndex;

    while (videoIndex < searchResults.videos.length) {
      const v = searchResults.videos[videoIndex];
      if (v.duration.includes("h")) {
        videoIndex++;
        continue;
      } else if (parseInt(v.duration.split(" ")[0], 10) > 6) {
        videoIndex++;
        continue;
      } else {
        const videoTitle = v.title.replace(/[\/\\?%*:|"<>]/g, "_");
        const titleProcessed = await addProcessedTitle(videoTitle);
        if (!titleProcessed) {
          videoIndex++;
          continue;
        }
        video = v;
        break;
      }
    }

    if (!video) throw new Error("No suitable video found");

    const videoUrl = video.url;
    const videoTitle = video.title.replace(/[\/\\?%*:|"<>]/g, "_");
    const outputFilePath = path.join(
      __dirname,
      "videos",
      `${videoTitle}_converted.mp4`
    );

    console.log(`Processing video from ${videoUrl}...`);
    await scrapeLocoloader(videoUrl, outputFilePath);

    console.log(`Video converted successfully: ${outputFilePath}`);

    return outputFilePath;
  } catch (error: any) {
    console.error("Error processing video:", error);
    return `Error processing video: ${error.message}`;
  }
};
