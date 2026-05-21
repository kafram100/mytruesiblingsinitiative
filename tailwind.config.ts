import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      fontFamily: {
        sans: [
          "var(--font-sans, ui-sans-serif)",
          "system-ui",
          "sans-serif",
        ],
        display: [
          "var(--font-display, Georgia)",
          "Georgia",
          "serif",
        ],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // My Siblings brand palette
        "brand-yellow": "hsl(var(--brand-yellow))",
        "brand-pink": "hsl(var(--brand-pink))",
        "brand-orange": "hsl(var(--brand-orange))",
        "brand-red": "hsl(var(--brand-red))",
        "deep-teal": "hsl(var(--deep-teal))",
        "brand-teal": "#009FAF",
        "brand-orange-hex": "#FF7A00",
        "brand-yellow-hex": "#FFC400",
        "brand-pink-hex": "#E93D8F",
        "brand-red-hex": "#F52A3D",
        "brand-dark": "#555555",
        "brand-light": "#F2F2F2",
        /** Accent gold (SDGs, highlights): alias used on Impact & campaign pages */
        "warm-gold": "hsl(var(--brand-yellow))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        teal: "0 18px 40px -18px hsl(var(--primary) / 0.45)",
        warm: "0 4px 20px -6px rgba(233, 61, 143, 0.12), 0 8px 32px -8px rgba(0, 159, 175, 0.08)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        slideUpAndFade: {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.92", transform: "scale(1.02)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        slideUpAndFade: "slideUpAndFade 0.2s ease-out",
        float: "float 5s ease-in-out infinite",
        "pulse-soft": "pulse-soft 2.8s ease-in-out infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
