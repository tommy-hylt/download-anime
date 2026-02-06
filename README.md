# Anime Downloader Automation

This project automates downloading anime episodes from a specific website using a set of scripts. The `start.cmd` script orchestrates the entire process, from downloading M3U8 playlists to combining and exporting the final MP4 files.

## Getting Started

To initiate the download process, you'll first need to set up FFmpeg and then configure the `start.cmd` script with the target anime's details.

## FFmpeg Setup

FFmpeg is essential for combining video segments.

1.  **Download & Extract:** Obtain FFmpeg from its official website (e.g., gyan.dev for Windows builds) and extract it. Consider placing it in a `ffmpeg/` subfolder within this project.
2.  **Configure Path:** Update the `ffmpegPath` variable in `combine_ts_to_mp4.js` to point to your `ffmpeg.exe` executable. For instance: `const ffmpegPath = 'ffmpeg/path/to/ffmpeg.exe';`

## Prepare Target Information

The `start.cmd` file uses two main parameters: `CODE` and `TITLE`. These need to be updated for each anime you wish to download.

### 1. Extracting CODE from a URL

The `CODE` is a numerical identifier found within the URL of the anime's page on the source website (e.g., `thread-XXXXX` where `XXXXX` is the CODE).

**Example:** For `https://myself-bbs.com/thread-44469-1-1.html`, the `CODE` is `44469`.

### 2. Fetching TITLE from the URL

The `TITLE` is the name of the anime, typically displayed prominently on the anime's webpage.

### 3. Updating `start.cmd`

After obtaining the `CODE` and `TITLE`, update the `start.cmd` file:

1. Open `start.cmd` in a text editor.
2. Locate and replace `XXXXX` and `YYYYY` in the following lines:
   ```cmd
   SET "CODE=XXXXX"
   SET "TITLE=YYYYY"
   ```
   **Example:**
   ```cmd
   SET "CODE=44469"
   SET "TITLE=火星異種"
   ```

## Running the Download Process

Once `start.cmd` is updated with the correct `CODE` and `TITLE`, simply execute:

```cmd
start.cmd
```

The script will then handle the download, combination, and export of the anime episodes.

> Note: The download process can be lengthy. It’s generally recommended to run `start.cmd` manually rather than through an AI for continuous monitoring.