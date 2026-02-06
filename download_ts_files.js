const fs = require('fs').promises;
const path = require('path');

const MIN_DELAY_MS = 10 * 1000; // 10 seconds

async function fetchAndSaveTs(url, localSavePath, headers) {
    try {
        console.log(`Fetching ${url} to ${localSavePath}...`);
        const response = await fetch(url, { headers });

        if (!response.ok) {
            console.error(`Error: Received HTTP status ${response.status} for ${url}. Not saving.`);
            return false; // Indicate failure
        }

        // Consider a more robust corruption check if needed, e.g., checking file size against expected,
        // or a simple header check. For now, response.ok is the primary check.
        const arrayBuffer = await response.arrayBuffer();
        await fs.writeFile(localSavePath, Buffer.from(arrayBuffer));
        console.log(`Successfully downloaded ${path.basename(localSavePath)} to ${path.dirname(localSavePath)}`);
        return true; // Indicate success

    } catch (error) {
        console.error(`Failed to download ${url}: ${error.message}. Not saving.`);
        return false; // Indicate failure
    }
}

async function downloadTsFiles() {
    const code = process.argv[2];
    if (!code) {
        console.error('Usage: node download_ts_files.js <CODE>');
        process.exit(1);
    }

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

    const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
    const headers = {
        'User-Agent': userAgent
    };

    console.log('Starting TS file download process...');

    for (const dirName of numberedDirs) {
        const jsonFilePath = path.join(currentDir, dirName, '720p.json');
        let tsFiles;

        try {
            const jsonContent = await fs.readFile(jsonFilePath, 'utf8');
            tsFiles = JSON.parse(jsonContent);
        } catch (error) {
            console.error(`Error reading or parsing ${jsonFilePath}: ${error.message}. Skipping directory ${dirName}.`);
            continue; // Skip to next directory
        }

        if (tsFiles.length === 0) {
            console.log(`No .ts files listed in ${jsonFilePath}. Skipping directory ${dirName}.`);
            continue;
        }

        for (const tsFileName of tsFiles) {
            const downloadUrl = `https://vpx05.myself-bbs.com/vpx/${code}/${dirName}/${tsFileName}`;
            const localSavePath = path.join(currentDir, dirName, tsFileName);

            // Check if file already exists
            try {
                await fs.access(localSavePath);
                console.log(`File ${tsFileName} already exists in ${dirName}, skipping download.`);
                continue;
            } catch (e) {
                // File does not exist, proceed to download
            }

            const startTime = Date.now();
            const success = await fetchAndSaveTs(downloadUrl, localSavePath, headers);

            const endTime = Date.now();
            const elapsedTime = endTime - startTime;

            if (elapsedTime < MIN_DELAY_MS) {
                const sleepTime = MIN_DELAY_MS - elapsedTime;
                console.log(`Rate limiting: Waiting for ${sleepTime / 1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, sleepTime));
            }
        }
    }
    console.log('TS file download process completed.');
}

downloadTsFiles();