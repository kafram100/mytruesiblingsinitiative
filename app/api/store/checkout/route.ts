import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

import { getStripe } from "@/lib/stripe";
import db from "@/lib/db";
import { rateLimitByIp } from "@/lib/rate-limit";
import { validateOrigin } from "@/lib/csrf";

export async function POST(request: Request) {
  try {
    const csrf = validateOrigin(request);
    if (!csrf.ok) return csrf.error;

    const { ok: rlOk } = await rateLimitByIp(request, "store-checkout", 10, 60_000);
    if (!rlOk) {
      return NextResponse.json(
        { error: "Too many requests. Try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    const orderId = randomUUID();
    const totalAmount = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

    await db.execute(
      `INSERT INTO orders (id, items, total_amount, currency, status)
       VALUES (?, ?, ?, 'USD', 'pending')`,
      [orderId, JSON.stringify(items), totalAmount]
    );

    const origin = request.headers.get("origin") || "http://localhost:3000";
    const stripe = await getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card", "link"],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.title,
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      metadata: {
        order_id: orderId,
        type: "store_order",
      },
      success_url: `${origin}/store/checkout?success=true&order=${orderId}`,
      cancel_url: `${origin}/store/checkout?cancelled=true`,
    });

    await db.execute(
      "UPDATE orders SET stripe_session_id = ? WHERE id = ?",
      [session.id, orderId]
    );

    return NextResponse.json({
      success: true,
      url: session.url,
    });
  } catch (err) {
    console.error("Store checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
