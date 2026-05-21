import type { ReactNode } from "react";

/**
 * Shared /admin segment root. Auth and the dashboard shell live in
 * app/admin/(dashboard)/layout.tsx for dashboard routes only.
 */
export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return children;
}
