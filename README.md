# <img src="assets/lujuria.webp" alt="Lujuria Logo" width="35" style="vertical-align: middle;"/> lujuria
**lujuria** is a powerful and automated tool designed to scrape videos from Xvideos, download them, and send them directly to a designated Discord channel via a webhook. 

## Features

- **Automated Scraping:** Efficiently scrapes videos from Xvideos.
- **Download Manager:** Automatically downloads the scraped videos.
- **Discord Integration:** Sends the downloaded videos to a specified Discord channel using a webhook.
- **Customizable:** Easily configure scraping parameters and webhook settings.
- **User-Friendly:** Simple setup and straightforward operation.

## Installation

To get started with LujuriaStream, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/RevoltSec/lujuria
    cd lujuria
    ```

2. Install dependencies using `pnpm`:
    ```bash
    pnpm install
    ```

## Configuration

Before running the script, you need to configure the scraping parameters and Discord webhook settings.

1. Edit `src/webhooks.json` file in the root directory and add the video tags and the webhook you are using
    ```json
    [
      {
          "feet": "https://discord.com/api/webhooks/0"
      },
      {
          "goth": "https://discord.com/api/webhooks/1"
      },
      {
          "threesome": "https://discord.com/api/webhooks/2"
      },
    ]
    ```

## Usage

To start scraping, downloading, and sending videos to Discord, run the following command:
```bash
pnpm start
```
