import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  /** Never wrap Next internals — avoids flaky ChunkLoadError / stale CSP on webpack chunks */
  if (pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  /** Legacy or mistaken paths that would otherwise 404 */
  if (pathname === "/admin/dashboard" || pathname === "/admin/dashboard/") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  /** APIs: headers only (no CSP) — avoids odd client behavior / noise on JSON handlers */
  if (pathname.startsWith("/api")) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "0");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      process.env.NODE_ENV === 'development'
        ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
        : "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://images.unsplash.com https://plus.unsplash.com https://images.pexels.com",
      "font-src 'self'",
      "connect-src 'self' https://images.unsplash.com https://plus.unsplash.com https://images.pexels.com https://videos.pexels.com https://interactive-examples.mdn.mozilla.net https://samplelib.com",
      "media-src 'self' blob: https://videos.pexels.com https://interactive-examples.mdn.mozilla.net https://samplelib.com",
      "frame-src 'self' https://js.stripe.com",
      "object-src 'none'",
      "base-uri 'self'",
    ].join("; ")
  );
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  return response;
}

export const config = {
  /**
   * Skip Next assets and static files so middleware isn’t loaded for chunk/HMR requests
   * (reduces “Cannot find the middleware module” when .next is rebuilding).
   */
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|webmanifest)$).*)",
  ],
};
