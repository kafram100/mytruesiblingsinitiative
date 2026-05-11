import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.mysiblings.app",
  appName: "My Siblings",
  webDir: "out",
  server: {
    url: process.env.CAP_SERVER_URL || "https://my-siblings.vercel.app",
    cleartext: true,
  },
};

export default config;
