/** One-off chromakey: turn flat black backdrop transparent (PNG). */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");

async function main() {
  const rel = path.join("public", "header-lockup.png");
  const inputPath = path.join(ROOT, rel);
  const tmpPath = `${inputPath}.tmp.png`;

  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const buf = Buffer.from(data);

  /**
   * Only knock out essentially pure black backdrop.
   * Looser thresholds were turning dark-grey subtitle typography transparent,
   * which then read as pale/white over the header.
   */
  for (let i = 0; i < buf.length; i += 4) {
    const r = buf[i];
    const g = buf[i + 1];
    const b = buf[i + 2];
    const maxc = Math.max(r, g, b);
    const sum = r + g + b;
    if (maxc <= 18 && sum <= 50) buf[i + 3] = 0;
  }

  await sharp(buf, {
    raw: {
      width,
      height,
      channels: 4,
    },
  })
    .png()
    .toFile(tmpPath);

  fs.renameSync(tmpPath, inputPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
