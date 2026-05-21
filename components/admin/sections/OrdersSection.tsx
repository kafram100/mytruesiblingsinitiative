"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Loader2 } from "lucide-react";

import { OrderRow } from "@/lib/auth";
import { formatCurrency, formatDateTime, statusBadge } from "@/lib/admin-utils";

export default function OrdersSection() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((data) => setOrders(data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-orange-100 p-2 text-orange-600">
          <ShoppingBag className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Store Orders</h1>
          <p className="text-sm text-muted-foreground">Product orders placed through the store checkout.</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <ShoppingBag className="mx-auto mb-3 h-8 w-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No orders yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 font-semibold text-foreground">ID</th>
                  <th className="px-4 py-3 font-semibold text-foreground">Items</th>
                  <th className="px-4 py-3 font-semibold text-foreground">Total</th>
                  <th className="px-4 py-3 font-semibold text-foreground">Status</th>
                  <th className="px-4 py-3 font-semibold text-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  let itemsSummary = "\u2014";
                  try {
                    const parsed = JSON.parse(order.items);
                    if (Array.isArray(parsed)) {
                      itemsSummary = parsed.map((i: any) => `${i.title || "Item"} x${i.quantity}`).join(", ");
                    }
                  } catch {}
                  return (
                    <tr key={order.id} className="border-b border-border/50 transition-colors hover:bg-muted/30">
                      <td className="max-w-[100px] truncate px-4 py-3 font-mono text-xs text-foreground">{order.id.slice(0, 8)}...</td>
                      <td className="max-w-[300px] truncate px-4 py-3 text-muted-foreground">{itemsSummary}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{formatCurrency(Number(order.total_amount), order.currency)}</td>
                      <td className="px-4 py-3">{statusBadge(order.status)}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{formatDateTime(order.created_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
