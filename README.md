# Anime Downloader Automation

This project automates downloading anime episodes from M3U8 playlists to final MP4 files.

## How to Use

To initiate the AI-assisted download process, give your AI this exact prompt:

```
Read README.md and follow the steps
```

Your AI will then guide you through the process, starting by asking for the URL of the anime.

## Prepare Target

The `start.cmd` file uses two main parameters: `CODE` and `TITLE`. These need to be updated for each anime you wish to download.

### 1. Extracting CODE from a URL

Ask the user to provide the URL of the anime's page. 

**Example URL:** `https://myself-bbs.com/thread-44469-1-1.html`

To extract the `CODE`, locate the `thread-XXXXX` part of the URL, where `XXXXX` is the CODE.

**Extracted CODE:** `44469`

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

## Download FFmpeg

1. Download the **Essentials Build** from [gyan.dev](https://www.gyan.dev/ffmpeg/builds/).
2. Unzip it into the project root.
3. Update `ffmpegPath` in `combine_ts_to_mp4.js` with the folder name of your unzipped FFmpeg.

## Run Scripts

After updating `start.cmd` with the correct `CODE` and `TITLE`, simply run the script:

```cmd
start.cmd
```

The script will then execute the steps to download, combine, and export the anime episodes.

> Note: The download process can take hours. It’s usually best to run `start.cmd` yourself (manually) rather than asking the AI to run it end-to-end.