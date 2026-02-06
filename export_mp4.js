#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();

function pad3(n) {
  return String(n).padStart(3, '0');
}

function isNumericDir(name) {
  return /^[0-9]+$/.test(name);
}

function main() {
  const title = process.argv[2] || '火星異種';
  const quality = process.argv[3] || '720p';
  const srcName = `${quality}.mp4`;

  const entries = fs.readdirSync(ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory() && isNumericDir(d.name))
    .map((d) => d.name)
    .sort((a, b) => Number(a) - Number(b));

  if (entries.length === 0) {
    console.error('No numeric episode folders found in:', ROOT);
    process.exit(1);
  }

  let copied = 0;
  let skipped = 0;
  let missing = 0;

  for (const dir of entries) {
    const ep = pad3(Number(dir));
    const src = path.join(ROOT, dir, srcName);
    const dst = path.join(ROOT, `${title}_${ep}_${quality}.mp4`);

    if (!fs.existsSync(src)) {
      console.warn('MISSING:', path.relative(ROOT, src));
      missing++;
      continue;
    }

    if (fs.existsSync(dst)) {
      console.log('SKIP exists:', path.basename(dst));
      skipped++;
      continue;
    }

    fs.copyFileSync(src, dst);
    console.log('COPIED:', path.basename(dst));
    copied++;
  }

  console.log(JSON.stringify({ title, quality, episodes: entries.length, copied, skipped, missing }, null, 2));
  if (missing > 0) process.exit(2);
}

main();
