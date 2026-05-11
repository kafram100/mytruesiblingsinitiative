import fs from "node:fs";
import path from "node:path";

/** Main site logo `/logo.png` (header + fallback footer). */
const DEFAULT_LOGO = { src: "/logo.png", width: 210, height: 119 } as const;

/** Opaque JPEG footer asset (legacy). */
const FOOTER_JPG = { src: "/logo-footer.jpg", width: 1024, height: 682 } as const;

/** Transparent PNG wordmark dimensions (matches `public/logo-footer.png`). */
const FOOTER_PNG = { src: "/logo-footer.png", width: 451, height: 527 } as const;

/**
 * Full horizontal lockup for footer only (`public/footer-lockup.png`).
 * Must match real file dimensions.
 */
const FOOTER_LOCKUP_PNG = {
  src: "/footer-lockup.png",
  width: 1227,
  height: 331,
} as const;

/**
 * Prefer dedicated footer lockup, then standalone footer wordmarks, then main logo.
 */
export function resolvePublicFooterLogo(): {
  src: string;
  width: number;
  height: number;
} {
  try {
    const pub = path.join(process.cwd(), "public");
    const lockupFile = FOOTER_LOCKUP_PNG.src.replace(/^\//, "");
    if (fs.existsSync(path.join(pub, lockupFile))) {
      return { ...FOOTER_LOCKUP_PNG };
    }
    if (fs.existsSync(path.join(pub, "logo-footer.png"))) {
      return { ...FOOTER_PNG };
    }
    if (fs.existsSync(path.join(pub, "logo-footer.jpg"))) {
      return { ...FOOTER_JPG };
    }
  } catch {
    /* fs unavailable (edge); fall through */
  }
  return { ...DEFAULT_LOGO };
}
