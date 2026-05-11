import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { headers } from "next/headers";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import WelcomeModal from "@/components/WelcomeModal";
import InstallPrompt from "@/components/InstallPrompt";
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
    default: "My True Siblings: A Lifetime Platform for Belonging",
    template: "%s · My True Siblings",
  },
  description:
    "A global safe space built on love, belonging, and real human connection. Connection, mentorship, and a safe place to be heard, from childhood through adulthood.",
  applicationName: "My True Siblings",
  openGraph: {
    title: "My True Siblings: A Lifetime Platform for Belonging",
    description:
      "A global safe space built on love, belonging, and real human connection. Join a global movement turning loneliness into belonging.",
    type: "website",
    siteName: "My True Siblings",
    images: [
      {
        url: "/logo.png",
        width: 210,
        height: 119,
        alt: "My True Siblings: A Safe Space Initiative",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "My True Siblings: A Lifetime Platform for Belonging",
    description:
      "A global safe space built on love, belonging, and real human connection.",
    images: ["/logo.png"],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const isAdmin = pathname.startsWith("/admin");

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fontSans.variable} ${fontDisplay.variable}`}
    >
      <head>
        <link rel="stylesheet" href="/site.css" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1d8a82" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="My Siblings" />
        <meta name="mobile-web-app-capable" content="yes" />
        {process.env.NODE_ENV === "production" ? (
          <script
            dangerouslySetInnerHTML={{
              __html: `
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/sw.js?v=4").catch(function () {});
  });
}`,
            }}
          />
        ) : null}
      </head>
      <body className={fontSans.className}>
        <TooltipProvider>
          {!isAdmin && <WelcomeModal />}
          {!isAdmin && <InstallPrompt />}
          {!isAdmin && <SiteHeader />}
          <main id="main-content">{children}</main>
          {!isAdmin && <SiteFooter />}
        </TooltipProvider>
      </body>
    </html>
  );
}
