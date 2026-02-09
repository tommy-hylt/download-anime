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

    for (const dirName of numberedDirs) {
        const folderPath = path.join(currentDir, dirName);
        const jsonFilePath = path.join(folderPath, '720p.json');
        const outputMp4Path = path.join(folderPath, '720p.mp4');
        const inputListFilePath = path.join(folderPath, 'ts_input_list.txt'); // Temporary file for ffmpeg


        try {
            const filesInDir = await fs.readdir(folderPath);
            tsFiles = filesInDir.filter(file => file.endsWith('.ts')).sort((a, b) => {
                // Natural sort for filenames like 720p_000.ts, 720p_001.ts
                const numA = parseInt(a.match(/\d+/)[0], 10);
                const numB = parseInt(b.match(/\d+/)[0], 10);
                return numA - numB;
            });
        } catch (error) {
            console.error(`Error reading directory ${dirName} for .ts files: ${error.message}. Skipping.`);
            continue;
        }

        if (tsFiles.length === 0) {
            console.log(`No .ts files found in ${dirName}. Skipping combination.`);
            continue;
        }

        // Create input list file for ffmpeg
        // Ensure paths in the list are relative to the folderPath where ffmpeg will be run
        const inputListContent = tsFiles.map(tsFileName => `file '${tsFileName}'`).join('\n');
        try {
            await fs.writeFile(inputListFilePath, inputListContent, 'utf8');
        } catch (error) {
            console.error(`Error creating input list for ${dirName}: ${error.message}. Skipping.`);
            continue;
        }

            const ffmpegPath = path.join('..', 'ffmpeg-2026-02-04-git-627da1111c-essentials_build', 'bin', 'ffmpeg.exe');
            // FFmpeg command
            // -y to overwrite output files without asking if they already exist (though we check for existence above)
            const ffmpegCommand = `"${ffmpegPath}" -f concat -safe 0 -i "${inputListFilePath}" -c:v libx264 -c:a aac -y "${outputMp4Path}"`;        console.log(`Combining .ts files in ${dirName} to ${outputMp4Path}...`);
        
        try {
            // Run ffmpeg in the target folder's directory
            const { stdout, stderr } = await execPromise(ffmpegCommand, { cwd: folderPath });
            // console.log(`ffmpeg stdout for ${dirName}:`); // Uncomment for detailed ffmpeg output
            if (stderr) {
                // FFmpeg often prints informational messages to stderr, so only warn if it seems like an error
                if (!stderr.includes('muxing overhead') && !stderr.includes('frame=') && !stderr.includes('video:') && !stderr.includes('audio:')) {
                     console.warn(`ffmpeg stderr for ${dirName}:`);
                }
            }
            console.log(`Successfully combined .ts files to ${outputMp4Path}`);
        } catch (error) {
            console.error(`Failed to combine .ts files in ${dirName}: ${error.message}`);
        } finally {
            // Clean up the temporary input list file
            try {
                await fs.unlink(inputListFilePath);
            } catch (cleanupError) {
                console.error(`Error cleaning up input list file for ${dirName}: ${cleanupError.message}`);
            }
        }
    }
    console.log('TS file combination to MP4 process completed.');
}

combineTsToMp4();
