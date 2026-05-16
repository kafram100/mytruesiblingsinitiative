import { NextResponse } from "next/server";

export function validateOrigin(request: Request): { ok: boolean; error?: Response } {
  if (request.method === "GET" || request.method === "HEAD" || request.method === "OPTIONS") {
    return { ok: true };
  }

  const host = request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") || "http";
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const expectedOrigin = `${proto}://${host}`;

  if (origin === expectedOrigin) return { ok: true };
  if (referer?.startsWith(expectedOrigin)) return { ok: true };

  return {
    ok: false,
    error: NextResponse.json({ error: "Invalid request origin" }, { status: 403 }),
  };
}
