import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

import { getStripe } from "@/lib/stripe";
import db from "@/lib/db";

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
    const body = await request.json();
    const { amount, currency, recurrence, purpose, sponsorTier } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid donation amount" },
        { status: 400 }
      );
    }

    const amountInCents = Math.round(amount * 100);
    const donationId = randomUUID();
    const normalizedCurrency = (currency || "USD").toUpperCase();
    const isRecurring = recurrence === "monthly" || recurrence === "annual";

    await db.execute(
      `INSERT INTO donations (id, amount_usd, currency, recurrence, purpose, sponsor_tier, status)
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [
        donationId,
        amount,
        currency || "USD",
        recurrence || "once",
        purpose || "General Outreach Fund",
        sponsorTier || null,
      ]
    );

    const origin = request.headers.get("origin") || "http://localhost:3000";
    const stripe = await getStripe();

    const recurringInterval = isRecurring
      ? recurrence === "monthly"
        ? "month"
        : "year"
      : null;

    const session = await stripe.checkout.sessions.create({
      mode: recurringInterval ? "subscription" : "payment",
      payment_method_types: getPaymentMethods(normalizedCurrency, !!recurringInterval) as any,
      line_items: [
        {
          price_data: {
            currency: currency?.toLowerCase() || "usd",
            product_data: {
              name: purpose || "Donation to My True Siblings",
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
        purpose: purpose || "General Outreach Fund",
        recurrence,
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
