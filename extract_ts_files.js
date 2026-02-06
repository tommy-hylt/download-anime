const fs = require('fs').promises;
const path = require('path');

async function extractTsFiles() {
    const currentDir = __dirname;
    let allFilesAndDirs;
    try {
        allFilesAndDirs = await fs.readdir(currentDir, { withFileTypes: true });
    } catch (error) {
        console.error(`Error reading current directory: ${error.message}`);
        return;
    }


    const numberedDirs = allFilesAndDirs.filter(dirent =>
        dirent.isDirectory() && /^\d{3}$/.test(dirent.name)
    ).map(dirent => dirent.name);

    if (numberedDirs.length === 0) {
        console.log("No numbered directories (e.g., '001', '002') found in the current folder.");
        return;
    }

    for (const dirName of numberedDirs) {
        const m3u8FilePath = path.join(currentDir, dirName, '720p.m3u8');
        const jsonFilePath = path.join(currentDir, dirName, '720p.json');

        try {
            console.log(`Processing ${m3u8FilePath}...`);
            const m3u8Content = await fs.readFile(m3u8FilePath, 'utf8');
            const lines = m3u8Content.split('\n');

            const tsFiles = [];
            for (const line of lines) {
                const trimmedLine = line.trim();
                // Check if the line ends with .ts and is not a comment or empty
                if (trimmedLine.endsWith('.ts') && !trimmedLine.startsWith('#') && trimmedLine.length > 0) {
                    tsFiles.push(trimmedLine);
                }
            }

            await fs.writeFile(jsonFilePath, JSON.stringify(tsFiles, null, 2), 'utf8');
            console.log(`Successfully extracted .ts files and saved to ${jsonFilePath}`);

        } catch (error) {
            console.error(`Error processing directory ${dirName}: ${error.message}`);
        }
    }
    console.log('Extraction process completed.');
}

extractTsFiles();
