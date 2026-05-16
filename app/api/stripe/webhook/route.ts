import { NextResponse } from "next/server";

import { getStripe, getStripeWebhookSecret } from "@/lib/stripe";
import db from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature") || "";

  try {
    const stripe = await getStripe();
    const webhookSecret = await getStripeWebhookSecret();

    if (!webhookSecret) {
      return NextResponse.json(
        { error: "Webhook not configured" },
        { status: 503 }
      );
    }

    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      if (session.metadata?.type === "store_order") {
        const orderId = session.metadata?.order_id;
        if (orderId) {
          await db.execute(
            "UPDATE orders SET status = 'completed', stripe_payment_intent_id = ? WHERE id = ?",
            [session.payment_intent as string, orderId]
          );
        }
      } else {
        const donationId = session.metadata?.donation_id;
        if (donationId) {
          await db.execute(
            "UPDATE donations SET status = 'completed', stripe_payment_intent_id = ? WHERE id = ?",
            [session.payment_intent as string, donationId]
          );
        }
      }
    }

    if (event.type === "checkout.session.expired") {
      const session = event.data.object;

      if (session.metadata?.type === "store_order") {
        const orderId = session.metadata?.order_id;
        if (orderId) {
          await db.execute(
            "UPDATE orders SET status = 'failed' WHERE id = ?",
            [orderId]
          );
        }
      } else {
        const donationId = session.metadata?.donation_id;
        if (donationId) {
          await db.execute(
            "UPDATE donations SET status = 'failed' WHERE id = ?",
            [donationId]
          );
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }
}
