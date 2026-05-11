import Stripe from "stripe";
import db from "@/lib/db";

interface SettingsValueRow {
  value: string;
}

let _stripe: Stripe | null = null;

export async function getStripe(): Promise<Stripe> {
  if (_stripe) return _stripe;

  let key = process.env.STRIPE_SECRET_KEY;

  if (!key) {
    const [rows] = await db.execute(
      "SELECT `value` FROM settings WHERE `key` = 'stripe_secret_key'"
    );
    key = (rows as SettingsValueRow[])[0]?.value;
  }

  if (!key) {
    throw new Error(
      "Missing Stripe secret key. Set it in Admin → Settings → Payment Gateway."
    );
  }

  _stripe = new Stripe(key, {
    apiVersion: "2026-04-22.dahlia",
    typescript: true,
  });

  return _stripe;
}

export async function getStripeWebhookSecret(): Promise<string | null> {
  const envSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (envSecret) return envSecret;

  const [rows] = await db.execute(
    "SELECT `value` FROM settings WHERE `key` = 'stripe_webhook_secret'"
  );
  return (rows as SettingsValueRow[])[0]?.value || null;
}
