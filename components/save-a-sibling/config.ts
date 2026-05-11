export const C = {
  teal: "#009FAF",
  orange: "#FF7A00",
  yellow: "#FFC400",
  pink: "#E93D8F",
  red: "#F52A3D",
  gray: "#555555",
  white: "#FFFFFF",
  light: "#F2F2F2",
} as const;

export const CURRENCY_CONFIG = {
  USD: { label: "United States (USD)", locale: "en-US", rateFromUsd: 1, symbol: "$" },
  NGN: { label: "Nigeria (NGN)", locale: "en-NG", rateFromUsd: 1360.07, symbol: "\u20A6" },
  GBP: { label: "United Kingdom (GBP)", locale: "en-GB", rateFromUsd: 0.7335, symbol: "\u00A3" },
  EUR: { label: "Euro Area (EUR)", locale: "en-IE", rateFromUsd: 0.8483, symbol: "\u20AC" },
  CAD: { label: "Canada (CAD)", locale: "en-CA", rateFromUsd: 1.3673, symbol: "C$" },
  GHS: { label: "Ghana (GHS)", locale: "en-GH", rateFromUsd: 11.235, symbol: "GH\u20B5" },
  KES: { label: "Kenya (KES)", locale: "en-KE", rateFromUsd: 129.18, symbol: "KSh " },
  ZAR: { label: "South Africa (ZAR)", locale: "en-ZA", rateFromUsd: 16.381, symbol: "R" },
  AED: { label: "United Arab Emirates (AED)", locale: "en-AE", rateFromUsd: 3.6725, symbol: "AED " },
  SAR: { label: "Saudi Arabia (SAR)", locale: "en-SA", rateFromUsd: 3.7675, symbol: "SAR " },
} as const;

export type CurrencyCode = keyof typeof CURRENCY_CONFIG;
export type Recurrence = "once" | "monthly" | "annual";
