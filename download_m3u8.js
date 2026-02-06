const fs = require('fs').promises;
const path = require('path');

async function downloadFile(url, targetDir, filename, headers) {
    try {
        console.log(`Fetching ${url}...`);
        await fs.mkdir(targetDir, { recursive: true }); // Ensure the directory exists

        const fullPath = path.join(targetDir, filename);
        const response = await fetch(url, { headers });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} for ${url}`);
        }

        const content = await response.text();
        await fs.writeFile(fullPath, content);
        console.log(`Successfully downloaded ${filename} to ${targetDir}`);
    } catch (error) {
        console.error(`Error downloading ${url}: ${error.message}`);
    }
}

async function main() {
    const code = process.argv[2]; // Expect 'code' as the first command-line argument
    if (!code) {
        console.error('Usage: node download_m3u8.js <CODE>');
        process.exit(1);
    }

    const baseUrlPattern = `https://vpx05.myself-bbs.com/vpx/${code}/NUM/720p.m3u8`;
    const startNum = 1;
    const endNum = 30;
    const padding = 3; // For "001", "015"

    // User-Agent to mimic a Chrome browser request
    const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
    const headers = {
        'User-Agent': userAgent
    };

    console.log('Starting download process...');

    for (let i = startNum; i <= endNum; i++) {
        const numStr = String(i).padStart(padding, '0');
        const url = baseUrlPattern.replace('NUM', numStr);
        const targetDirectory = path.join(__dirname, numStr); // Create a folder for each number
        const actualFilename = `720p.m3u8`; // The name of the file inside the folder

        await downloadFile(url, targetDirectory, actualFilename, headers);

        if (i < endNum) {
            console.log('Pausing for 1 second before next fetch...');
            await new Promise(resolve => setTimeout(resolve, 1000)); // 1-second pause
        }
    }

    console.log('Download process completed.');
}

main();
