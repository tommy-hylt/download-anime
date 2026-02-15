const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function combineTsToMp4() {
    const currentDir = __dirname;
    let allFilesAndDirs;
    try {
        allFilesAndDirs = await fs.readdir(currentDir, { withFileTypes: true });
    } catch (error) {
        console.error(`Error reading current directory: ${error.message}`);
        process.exit(1);
    }

    const numberedDirs = allFilesAndDirs.filter(dirent =>
        dirent.isDirectory() && /^\d{3}$/.test(dirent.name)
    ).map(dirent => dirent.name);

    if (numberedDirs.length === 0) {
        console.log("No numbered directories (e.g., '001', '002') found in the current folder.");
        return;
    }

    console.log('Starting TS file combination to MP4 process...');
    console.log("NOTE: This script requires FFmpeg to be installed and available in your system's PATH.");

    const ffmpegPath = path.join('..', 'ffmpeg-2026-02-04-git-627da1111c-essentials_build', 'bin', 'ffmpeg.exe');

    for (const dirName of numberedDirs) {
        const folderPath = path.join(currentDir, dirName);
        const m3u8FilePath = path.join(folderPath, '720p.m3u8');
        const outputMp4Path = path.join(folderPath, '720p.mp4');

        try {
            await fs.access(m3u8FilePath);
        } catch {
            console.log(`No 720p.m3u8 found in ${dirName}. Skipping.`);
            continue;
        }

        console.log(`Combining .ts files in ${dirName} to ${outputMp4Path}...`);

        // Use m3u8 as input — FFmpeg handles segment order and timestamps natively
        const ffmpegCommand = `"${ffmpegPath}" -allowed_extensions ALL -i "${m3u8FilePath}" -c copy -y "${outputMp4Path}"`;

        try {
            const { stdout, stderr } = await execPromise(ffmpegCommand, { cwd: folderPath });
            if (stderr) {
                if (!stderr.includes('muxing overhead') && !stderr.includes('frame=') && !stderr.includes('video:') && !stderr.includes('audio:')) {
                     console.warn(`ffmpeg stderr for ${dirName}:`);
                }
            }
            console.log(`Successfully combined .ts files to ${outputMp4Path}`);
        } catch (error) {
            console.error(`Failed to combine .ts files in ${dirName}: ${error.message}`);
        }
    }
    console.log('TS file combination to MP4 process completed.');
}

combineTsToMp4();
