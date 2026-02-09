@echo off
chcp 65001

:: Define input parameters
SET "CODE=44469"
SET "TITLE=火星異種"

:: Step 1: Download M3U8
REM node download_m3u8.js %CODE%

:: Step 2: Extract TS files
REM node extract_ts_files.js

:: Step 3: Download TS files
REM node download_ts_files.js %CODE%

:: Step 4: Combine TS to MP4
REM node combine_ts_to_mp4.js

:: Step 5: Export MP4
node "export_mp4.js" "%TITLE%"
