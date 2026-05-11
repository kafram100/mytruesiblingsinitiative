/**
 * Footer lockup subtitle (“My True Sibling…”) is rasterized — recolor neutral
 * dark pixels in that band to white. Does not alter saturated teal/orange brand.
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const rel = path.join("public", "footer-lockup.png");

function isNeutralDark(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lum = (r + g + b) / 3;
  const neutral = Math.abs(r - g) <= 52 && Math.abs(g - b) <= 52;
  return neutral && max - min < 95 && lum < 148;
}

async function main() {
  const inputPath = path.join(ROOT, rel);
  const tmpPath = `${inputPath}.tmp.png`;

  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const buf = Buffer.from(data);

  // Right column subtitle band (~under “MTSI”); avoids colorful left wordmark.
  const xMin = Math.floor(width * 0.56);
  const xMax = width - 4;
  const yMin = Math.floor(height * 0.53);
  const yMax = height - 6;

  for (let y = yMin; y <= yMax; y++) {
    for (let x = xMin; x <= xMax; x++) {
      const i = (y * width + x) * 4;
      const a = buf[i + 3];
      if (a < 20) continue;
      const r = buf[i];
      const g = buf[i + 1];
      const b = buf[i + 2];
      if (!isNeutralDark(r, g, b)) continue;
      buf[i] = 250;
      buf[i + 1] = 250;
      buf[i + 2] = 251;
      buf[i + 3] = 255;
    }
  }

  await sharp(buf, {
    raw: { width, height, channels: 4 },
  })
    .png()
    .toFile(tmpPath);

  fs.renameSync(tmpPath, inputPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
