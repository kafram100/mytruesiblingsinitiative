"use client";

import { useEffect, useState } from "react";
import { Wallet, Loader2 } from "lucide-react";

import type { DonationRow } from "@/lib/auth";
import { formatCurrency, formatDateTime, statusBadge } from "@/lib/admin-utils";

export default function DonationsSection() {
  const [donations, setDonations] = useState<DonationRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/donations")
      .then((r) => r.json())
      .then((data) => setDonations(data || []))
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
        <div className="rounded-xl bg-blue-100 p-2 text-blue-600">
          <Wallet className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Donations</h1>
          <p className="text-sm text-muted-foreground">All donation transactions across the platform.</p>
        </div>
      </div>

      {donations.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <Wallet className="mx-auto mb-3 h-8 w-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No donations yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 font-semibold text-foreground">Amount</th>
                  <th className="px-4 py-3 font-semibold text-foreground">Currency</th>
                  <th className="px-4 py-3 font-semibold text-foreground">Type</th>
                  <th className="px-4 py-3 font-semibold text-foreground">Purpose</th>
                  <th className="px-4 py-3 font-semibold text-foreground">Status</th>
                  <th className="px-4 py-3 font-semibold text-foreground">Donor</th>
                  <th className="px-4 py-3 font-semibold text-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((d) => (
                  <tr key={d.id} className="border-b border-border/50 transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium text-foreground">{formatCurrency(Number(d.amount_usd), d.currency)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{d.currency.toUpperCase()}</td>
                    <td className="px-4 py-3 text-muted-foreground">{d.recurrence === "once" ? "One time" : d.recurrence}</td>
                    <td className="max-w-[200px] truncate px-4 py-3 text-muted-foreground">{d.purpose}</td>
                    <td className="px-4 py-3">{statusBadge(d.status)}</td>
                    <td className="max-w-[150px] truncate px-4 py-3 text-muted-foreground">{d.donor_name || d.donor_email || "\u2014"}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{formatDateTime(d.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
