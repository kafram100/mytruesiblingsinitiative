import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";

import AppShell from "@/components/AppShell";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getSiteMetadataBase } from "@/lib/metadata-base";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fontDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: getSiteMetadataBase(),
  title: {
    default:
      "MyTrueSiblings | A Global Safe Space for Belonging, Support & Human Connection",
    template: "%s | MyTrueSiblings",
  },
  description:
    "MyTrueSiblings is a global safe space where strangers become siblings through emotional support, mentorship, inclusion, healing, safe conversations, disability support, and lifelong human connection.",
  applicationName: "MyTrueSiblings",
  authors: [{ name: "MyTrueSiblings Initiative" }],
  keywords: [
    "MyTrueSiblings",
    "MTSI",
    "emotional support",
    "belonging platform",
    "safe space community",
    "support network",
    "human connection",
    "mentorship platform",
    "disability inclusion",
    "youth support",
    "adult safe place",
    "loneliness support",
    "global community",
    "healing community",
    "sibling connection",
    "safe conversations",
    "inclusive community",
    "support circles",
    "mental wellness support",
    "caregiver support",
  ],
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://www.mytruesiblings.org",
  },
  openGraph: {
    type: "website",
    url: "https://www.mytruesiblings.org",
    title: "MyTrueSiblings | A Lifetime Platform for Belonging",
    description:
      "A global safe space built on love, belonging, support, inclusion, empathy, and real human connection.",
    siteName: "MyTrueSiblings",
    locale: "en_US",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MyTrueSiblings — A Global Safe Space for Belonging",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MyTrueSiblings | A Lifetime Platform for Belonging",
    description:
      "A global safe space where strangers become siblings through support, healing, mentorship, inclusion, and belonging.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fontSans.variable} ${fontDisplay.variable}`}
    >
      <head>
        <link rel="stylesheet" href="/site.css" />
        <meta name="theme-color" content="#009FAF" />
        <meta name="apple-mobile-web-app-title" content="MyTrueSiblings" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "MyTrueSiblings",
              alternateName: "MTSI",
              url: "https://www.mytruesiblings.org",
              logo: "https://www.mytruesiblings.org/logo.png",
              description:
                "MyTrueSiblings is a global safe space where strangers become siblings through emotional support, mentorship, inclusion, healing, and lifelong human connection.",
              sameAs: [
                "https://facebook.com/mytruesiblings",
                "https://instagram.com/mytruesiblings",
                "https://x.com/mytruesiblings",
                "https://linkedin.com/company/mytruesiblings",
              ],
            }),
          }}
        />
        {process.env.NODE_ENV === "production" ? (
          <script
            dangerouslySetInnerHTML={{
              __html: `
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/sw.js?v=5").catch(function () {});
  });
}`,
            }}
          />
        ) : null}
      </head>
      <body className={fontSans.className}>
        <TooltipProvider>
          <AppShell>{children}</AppShell>
        </TooltipProvider>
      </body>
    </html>
  );
}
