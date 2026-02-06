# Anime Downloader Automation

## FFmpeg Setup

FFmpeg is required to combine the downloaded video segments. Follow these steps to set it up:

1.  **Download FFmpeg:**
    Visit the official FFmpeg website (https://ffmpeg.org/download.html) and download the latest stable build for your operating system. For Windows, a common choice is a `Buld by BtbN` (e.g. `ffmpeg-master-latest-win64-gpl.zip`) from gyan.dev (https://www.gyan.dev/ffmpeg/builds/).

2.  **Unzip FFmpeg:**
    Extract the contents of the downloaded FFmpeg archive to a convenient location. For example, you can create a folder named `ffmpeg` in the root of this project and extract it there. The executable `ffmpeg.exe` will typically be found within `ffmpeg-XXXX-XXXX-git-XXXXXXXX-essentials_build/bin/ffmpeg.exe` (the exact path might vary slightly based on the version).

3.  **Configure `combine_ts_to_mp4.js`:**
    Open `combine_ts_to_mp4.js` in a text editor. Locate the line that defines the `ffmpegPath` variable. Update its value to the full path of `ffmpeg.exe` you just unzipped.

    **Example (assuming ffmpeg is in a subfolder named `ffmpeg`):**
    ```javascript
    const ffmpegPath = 'ffmpeg/ffmpeg-XXXX-XXXX-git-XXXXXXXX-essentials_build/bin/ffmpeg.exe';
    ```
    Make sure to replace `ffmpeg-XXXX-XXXX-git-XXXXXXXX-essentials_build/bin/ffmpeg.exe` with the actual path to your `ffmpeg.exe`.

## How to Use

To initiate the AI-assisted download process, give the AI this exact prompt:

> Read README.md and do the AI flow

The AI will then guide you through the process, starting by asking for the URL of the anime.

This project provides a set of scripts to automate the process of downloading anime episodes from a specific website. The `start.cmd` script orchestrates the entire process, from downloading M3U8 playlists to combining and exporting the final MP4 files.

## AI flow

The `start.cmd` file uses two main parameters: `CODE` and `TITLE`. These need to be updated for each anime you wish to download.

### 1. Extracting CODE from a URL

The `CODE` is a numerical identifier found within the URL of the anime's page on the source website.

**Example URL:** `https://myself-bbs.com/thread-44469-1-1.html`
**Extracted CODE:** `44469`

To extract the `CODE`, locate the `thread-XXXXX` part of the URL, where `XXXXX` is the CODE.

### 2. Fetching TITLE from the URL

The `TITLE` is the name of the anime. This can be found on the anime's page itself.

**Steps to find the TITLE:**
1. Open the anime's URL (e.g., `https://myself-bbs.com/thread-44469-1-1.html`) in a web browser.
2. Look for the anime's title on the page. It's usually prominently displayed.

### 3. Updating `start.cmd`

Once you have the `CODE` and `TITLE`, you need to update the `start.cmd` file.

1. Open `start.cmd` in a text editor.
2. Locate the lines that define `CODE` and `TITLE`:
   ```cmd
   SET "CODE=XXXXX"
   SET "TITLE=YYYYY"
   ```
3. Replace `XXXXX` with your extracted numerical `CODE`.
4. Replace `YYYYY` with the anime `TITLE` you fetched from the website.

**Example after update:**
```cmd
SET "CODE=44469"
SET "TITLE=火星異種"
```

## Running the Download Process

After updating `start.cmd` with the correct `CODE` and `TITLE`, simply run the script:

```cmd
start.cmd
```

The script will then execute the steps to download, combine, and export the anime episodes.

> Note: The download process can take hours. It’s usually best to run `start.cmd` yourself (manually) rather than asking the AI to run it end-to-end.