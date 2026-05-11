import { CURRENCY_CONFIG, CurrencyCode } from "./config";

export function formatPreviewNumber(amount: number, locale: string): string {
  const rounded = Math.round(amount * 100) / 100;
  const isWhole = Number.isInteger(rounded);
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: isWhole ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(rounded);
}

export function formatCurrencyAmount(amount: number, currency: CurrencyCode): string {
  const { locale, symbol } = CURRENCY_CONFIG[currency];
  return `${symbol}${formatPreviewNumber(amount, locale)}`;
}

export function convertUsdAmount(amountUsd: number, currency: CurrencyCode): number {
  return amountUsd * CURRENCY_CONFIG[currency].rateFromUsd;
}

export function formatEditableAmount(amount: number): string {
  const rounded = Math.round(amount * 100) / 100;
  if (Number.isInteger(rounded)) return String(rounded);
  return rounded.toFixed(2).replace(/\.?0+$/, "");
}
