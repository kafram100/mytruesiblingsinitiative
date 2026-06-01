import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";

import "./globals.css";
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
      "My True Siblings Initiative | A Global Safe Space for Belonging, Support & Human Connection",
    template: "%s | My True Siblings Initiative",
  },
  description:
    "My True Siblings Initiative is a global safe space where strangers become siblings through emotional support, mentorship, inclusion, healing, safe conversations, disability support, and lifelong human connection.",
  applicationName: "My True Siblings Initiative",
  authors: [{ name: "My True Siblings Initiative" }],
  keywords: [
    "My True Siblings Initiative",
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
    canonical: "https://www.MyTrueSiblingsInitiative.org",
  },
  openGraph: {
    type: "website",
    url: "https://www.MyTrueSiblingsInitiative.org",
    title: "My True Siblings Initiative | A Lifetime Platform for Belonging",
    description:
      "A global safe space built on love, belonging, support, inclusion, empathy, and real human connection.",
    siteName: "My True Siblings Initiative",
    locale: "en_US",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "My True Siblings Initiative: A Global Safe Space for Belonging",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "My True Siblings Initiative | A Lifetime Platform for Belonging",
    description:
      "A global safe space where strangers become siblings through support, healing, mentorship, inclusion, and belonging.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [{ url: "/my-true-siblings-favicon.png", type: "image/png" }],
    apple: [{ url: "/my-true-siblings-favicon.png", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
};

export default async function RootLayout({
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
        <meta name="theme-color" content="#009FAF" />
        <meta name="apple-mobile-web-app-title" content="My True Siblings Initiative" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "My True Siblings Initiative",
              alternateName: "MTSI",
              url: "https://www.MyTrueSiblingsInitiative.org",
              logo: "https://www.MyTrueSiblingsInitiative.org/logo.png",
              description:
                "My True Siblings Initiative is a global safe space where strangers become siblings through emotional support, mentorship, inclusion, healing, and lifelong human connection.",
              sameAs: [
                "https://facebook.com/MyTrueSiblingsInitiative",
                "https://instagram.com/MyTrueSiblingsInitiative",
                "https://x.com/MyTrueSiblingsInitiative",
                "https://linkedin.com/company/MyTrueSiblingsInitiative",
              ],
            }),
          }}
        />
        {process.env.NODE_ENV === "production" ? (
          <script src="/sw-register.js" defer />
        ) : null}
        <script src="/simulator-fix.js" defer />
      </head>
      <body className={fontSans.className}>
        <TooltipProvider>
          <AppShell>{children}</AppShell>
        </TooltipProvider>
      </body>
    </html>
  );
}
