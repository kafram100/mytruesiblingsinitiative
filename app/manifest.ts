import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "My True Siblings Initiative",
    short_name: "My Siblings",
    description:
      "A global safe space built on love, belonging, and real human connection. Connection, mentorship, and a safe place to be heard.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf8f5",
    theme_color: "#1d8a82",
    orientation: "portrait-primary",
    categories: ["social", "health", "education", "community"],
    lang: "en",
    scope: "/",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
