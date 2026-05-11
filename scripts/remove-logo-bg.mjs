/**
 * One-off utility: chroma-keys near-white pixels in the logo PNGs to
 * transparent so the logo can sit on any background.
 *
 * Usage:
 *   node scripts/remove-logo-bg.mjs
 *
 * Re-run after replacing the source asset.
 */

import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const targets = [
  "public/logo.png",
  "app/icon.png",
  "app/apple-icon.png",
];

// A pixel becomes fully transparent when min(R,G,B) >= HARD_WHITE.
// Between SOFT_WHITE and HARD_WHITE, alpha falls off linearly so edges stay
// anti-aliased instead of jagged.
const HARD_WHITE = 245;
const SOFT_WHITE = 215;

async function processFile(relPath) {
  const path = resolve(root, relPath);

  const { data, info } = await sharp(path)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  if (channels !== 4) {
    throw new Error(`Expected 4 channels (RGBA) for ${relPath}, got ${channels}`);
  }

  const out = Buffer.from(data);
  let cleared = 0;
  let faded = 0;

  for (let i = 0; i < out.length; i += 4) {
    const r = out[i];
    const g = out[i + 1];
    const b = out[i + 2];
    const minRgb = Math.min(r, g, b);

    if (minRgb >= HARD_WHITE) {
      out[i + 3] = 0;
      cleared++;
    } else if (minRgb >= SOFT_WHITE) {
      const factor = (HARD_WHITE - minRgb) / (HARD_WHITE - SOFT_WHITE);
      out[i + 3] = Math.round(255 * factor);
      faded++;
    }
  }

  await sharp(out, { raw: { width, height, channels } })
    .png({ compressionLevel: 9, palette: false })
    .toFile(path);

  console.log(
    `✓ ${relPath} (${width}×${height}) — ${cleared} px cleared, ${faded} px faded`
  );
}

for (const file of targets) {
  await processFile(file);
}

console.log("\nDone. Hard-refresh your browser to pick up the new alpha layer.");
