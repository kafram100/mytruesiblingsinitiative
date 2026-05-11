/**
 * 1) Edge flood-fill strips the flat outer matte (white or near-black studio).
 * 2) Interior neutral near-black blobs (letter counters like e/b/g) are removed
 *    via 4-connected components that never touch the image boundary — colored
 *    dark pixels (teal, etc.) are preserved by a chroma-spread test.
 */

import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

function withinTolerance(r, g, b, br, bg, bb, tol) {
  const dr = r - br;
  const dg = g - bg;
  const db = b - bb;
  return Math.sqrt(dr * dr + dg * dg + db * db) <= tol * 255;
}

/**
 * Letter counters (bowls in e/b/g etc.) ship as neutral near-black disks.
 * We remove them by finding 4-connected components of neutral-dark pixels that
 * do **not** touch the image bbox — blobs that reach an edge stay (safety).
 * Colored shadows (large RGB spread) are never touched.
 */
function removeInteriorNeutralDarkBlobs(data, stride, w, h) {
  const maxChannel = 58;
  const maxRgbSpread = 42;
  const minPixelCount = 6;

  function neutralDarkAt(o) {
    if (data[o + 3] < 8) return false;
    const r = data[o];
    const g = data[o + 1];
    const b = data[o + 2];
    const mx = Math.max(r, g, b);
    const mn = Math.min(r, g, b);
    return mx <= maxChannel && mx - mn <= maxRgbSpread;
  }

  const seen = new Uint8Array(w * h);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      if (seen[idx]) continue;

      const o = y * stride + x * 4;
      if (data[o + 3] < 8) {
        seen[idx] = 1;
        continue;
      }
      if (!neutralDarkAt(o)) {
        seen[idx] = 1;
        continue;
      }

      /** @type {number[]} */
      const comp = [];
      /** @type {number[]} */
      const stack = [idx];
      seen[idx] = 1;
      let touchesImageEdge = false;

      while (stack.length > 0) {
        const cur = stack.pop();
        const cx = cur % w;
        const cy = (cur / w) | 0;

        comp.push(cur);
        if (cx === 0 || cx === w - 1 || cy === 0 || cy === h - 1) {
          touchesImageEdge = true;
        }

        const neigh = [
          [cx + 1, cy],
          [cx - 1, cy],
          [cx, cy + 1],
          [cx, cy - 1],
        ];

        for (const [nx, ny] of neigh) {
          if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;
          const nidx = ny * w + nx;
          if (seen[nidx]) continue;

          const no = ny * stride + nx * 4;
          if (data[no + 3] < 8) continue;
          if (!neutralDarkAt(no)) continue;

          seen[nidx] = 1;
          stack.push(nidx);
        }
      }

      if (!touchesImageEdge && comp.length >= minPixelCount) {
        for (const cidx of comp) {
          const cy = (cidx / w) | 0;
          const cx = cidx % w;
          data[cy * stride + cx * 4 + 3] = 0;
        }
      }
    }
  }
}

async function removeFlatBackground(inputPath, outputs) {  const buf = fs.readFileSync(inputPath);

  const { data, info } = await sharp(buf)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const w = info.width;
  const h = info.height;
  const stride = w * 4;

  let br = 0,
    bg = 0,
    bb = 0;
  {
    let n = 0;
    const sampleCorners = [
      [0, 0],
      [w - 1, 0],
      [0, h - 1],
      [w - 1, h - 1],
    ];
    for (const [x, y] of sampleCorners) {
      const o = y * stride + x * 4;
      br += data[o];
      bg += data[o + 1];
      bb += data[o + 2];
      n++;
    }
    br /= n;
    bg /= n;
    bb /= n;
  }

  // Average corner luminance → dark matte (black JPEG/PNG fringe) vs light paper.
  const cornerLum = (br + bg + bb) / 3;
  // Euclidean distance tol in 0–255 units: tighter on white, looser on black
  // edges so faint gray anti-alias ring doesn't leave a halo.
  const tol = cornerLum < 48 ? 0.14 : 0.085;

  const visited = new Uint8Array(w * h);

  /** @type {number[]} */
  const stack = [];

  function pushBorder(x, y) {
    if (x < 0 || x >= w || y < 0 || y >= h) return;
    const idx = y * w + x;
    if (visited[idx]) return;
    const o = y * stride + x * 4;
    const r = data[o],
      g = data[o + 1],
      b = data[o + 2];
    if (
      withinTolerance(r, g, b, Math.round(br), Math.round(bg), Math.round(bb), tol)
    ) {
      visited[idx] = 1;
      stack.push(idx);
    }
  }

  for (let x = 0; x < w; x++) {
    pushBorder(x, 0);
    pushBorder(x, h - 1);
  }
  for (let y = 0; y < h; y++) {
    pushBorder(0, y);
    pushBorder(w - 1, y);
  }

  while (stack.length > 0) {
    const idx = stack.pop();
    const x = idx % w;
    const y = (idx / w) | 0;
    const o = y * stride + x * 4;
    data[o + 3] = 0;

    const neigh = [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
    ];
    for (const [nx, ny] of neigh) {
      if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;
      const nidx = ny * w + nx;
      if (visited[nidx]) continue;
      const no = ny * stride + nx * 4;
      const nr = data[no],
        ng = data[no + 1],
        nb = data[no + 2];
      if (
        withinTolerance(
          nr,
          ng,
          nb,
          Math.round(br),
          Math.round(bg),
          Math.round(bb),
          tol
        )
      ) {
        visited[nidx] = 1;
        stack.push(nidx);
      }
    }
  }

  removeInteriorNeutralDarkBlobs(data, stride, w, h);

  const outBuf = await sharp(Buffer.from(data), {
    raw: { width: w, height: h, channels: 4 },
  })
    .png({ compressionLevel: 9 })
    .toBuffer();

  for (const rel of outputs) {
    fs.writeFileSync(path.join(ROOT, rel), outBuf);
    console.log("Wrote", rel);
  }
}

const INPUT = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(ROOT, "public", "logo.png");

await removeFlatBackground(INPUT, [
  "public/logo.png",
  "app/icon.png",
  "app/apple-icon.png",
]);
