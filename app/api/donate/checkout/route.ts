import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

import { getStripe } from "@/lib/stripe";
import db from "@/lib/db";
import { rateLimitByIp } from "@/lib/rate-limit";
import { validateOrigin } from "@/lib/csrf";

const CURRENCY_PAYMENT_METHODS: Record<string, string[]> = {
  USD: ["card", "link", "us_bank_account"],
  EUR: ["card", "link", "sepa_debit", "ideal", "bancontact", "sofort", "giropay"],
  GBP: ["card", "link", "bacs_debit"],
  CAD: ["card", "link"],
  AED: ["card", "link"],
  SAR: ["card", "link"],
  NGN: ["card", "link"],
  KES: ["card", "link", "mobile_money"],
  GHS: ["card", "link", "mobile_money"],
  UGX: ["card", "link", "mobile_money"],
  TZS: ["card", "link", "mobile_money"],
  RWF: ["card", "link", "mobile_money"],
  ZAR: ["card", "link"],
};

const RECURRING_METHODS = ["card", "link", "sepa_debit", "us_bank_account"];

function getPaymentMethods(
  currency: string,
  isRecurring: boolean
): string[] {
  const currencyMethods = CURRENCY_PAYMENT_METHODS[currency] || ["card", "link"];
  if (!isRecurring) return currencyMethods;
  return currencyMethods.filter((m) => RECURRING_METHODS.includes(m));
}

export async function POST(request: Request) {
  try {
    const csrf = validateOrigin(request);
    if (!csrf.ok) return csrf.error;

    const { ok: rlOk } = await rateLimitByIp(request, "donate-checkout", 10, 60_000);
    if (!rlOk) {
      return NextResponse.json(
        { error: "Too many requests. Try again later." },
        { status: 429 }
      );
    }

    const VALID_CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AED", "SAR", "NGN", "KES", "GHS", "UGX", "TZS", "RWF", "ZAR"];
    const VALID_RECURRENCE = ["once", "monthly", "annual"];
    const MAX_AMOUNT = 999999.99;

    const body = await request.json();
    const { amount, currency, recurrence, purpose, sponsorTier } = body;

    if (typeof amount !== "number" || !isFinite(amount) || amount <= 0 || amount > MAX_AMOUNT) {
      return NextResponse.json(
        { error: "Invalid donation amount" },
        { status: 400 }
      );
    }

    const normalizedCurrency = (currency || "USD").toUpperCase();
    if (!VALID_CURRENCIES.includes(normalizedCurrency)) {
      return NextResponse.json(
        { error: "Unsupported currency" },
        { status: 400 }
      );
    }

    const normalizedRecurrence = (recurrence || "once").toLowerCase();
    if (!VALID_RECURRENCE.includes(normalizedRecurrence)) {
      return NextResponse.json(
        { error: "Invalid recurrence value" },
        { status: 400 }
      );
    }

    const amountInCents = Math.round(amount * 100);
    const donationId = randomUUID();
    const isRecurring = normalizedRecurrence !== "once";

    const normalizedPurpose = typeof purpose === "string" && purpose.length > 0
      ? purpose.slice(0, 255)
      : "General Outreach Fund";
    const normalizedTier = typeof sponsorTier === "string" && sponsorTier.length > 0
      ? sponsorTier.slice(0, 100)
      : null;

    await db.execute(
      `INSERT INTO donations (id, amount_usd, currency, recurrence, purpose, sponsor_tier, status)
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [
        donationId,
        amount,
        normalizedCurrency,
        normalizedRecurrence,
        normalizedPurpose,
        normalizedTier,
      ]
    );

    const origin = request.headers.get("origin") || "http://localhost:3000";
    const stripe = await getStripe();

    const recurringInterval = isRecurring
      ? normalizedRecurrence === "monthly"
        ? "month"
        : "year"
      : null;

    const session = await stripe.checkout.sessions.create({
      mode: recurringInterval ? "subscription" : "payment",
      payment_method_types: getPaymentMethods(normalizedCurrency, !!recurringInterval) as any,
      line_items: [
        {
          price_data: {
            currency: normalizedCurrency.toLowerCase(),
            product_data: {
              name: normalizedPurpose,
            },
            unit_amount: amountInCents,
            ...(recurringInterval
              ? { recurring: { interval: recurringInterval } }
              : {}),
          },
          quantity: 1,
        },
      ],
      metadata: {
        donation_id: donationId,
        purpose: normalizedPurpose,
        recurrence: normalizedRecurrence,
      },
      success_url: `${origin}/save-a-sibling?donation=success`,
      cancel_url: `${origin}/save-a-sibling?donation=cancelled`,
    });

    await db.execute(
      "UPDATE donations SET stripe_payment_intent_id = ? WHERE id = ?",
      [session.id, donationId]
    );

    return NextResponse.json({
      success: true,
      url: session.url,
    });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
