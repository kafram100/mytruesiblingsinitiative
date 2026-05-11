import type { Metadata } from "next";
import { Wallet } from "lucide-react";

import db from "@/lib/db";
import { DonationRow } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Donations",
};

function formatCurrency(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusBadge(status: string) {
  const styles: Record<string, string> = {
    completed: "bg-emerald-100 text-emerald-700",
    pending: "bg-amber-100 text-amber-700",
    cancelled: "bg-red-100 text-red-700",
    failed: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}

export default async function AdminDonationsPage() {
  const [rows] = await db.execute(
    "SELECT * FROM donations ORDER BY created_at DESC LIMIT 100"
  );
  const donations = rows as DonationRow[];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-blue-100 p-2 text-blue-600">
          <Wallet className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Donations
          </h1>
          <p className="text-sm text-muted-foreground">
            All donation transactions across the platform.
          </p>
        </div>
      </div>

      {donations.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <Wallet className="mx-auto mb-3 h-8 w-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            No donations yet.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 font-semibold text-foreground">
                    Amount
                  </th>
                  <th className="px-4 py-3 font-semibold text-foreground">
                    Currency
                  </th>
                  <th className="px-4 py-3 font-semibold text-foreground">
                    Type
                  </th>
                  <th className="px-4 py-3 font-semibold text-foreground">
                    Purpose
                  </th>
                  <th className="px-4 py-3 font-semibold text-foreground">
                    Status
                  </th>
                  <th className="px-4 py-3 font-semibold text-foreground">
                    Donor
                  </th>
                  <th className="px-4 py-3 font-semibold text-foreground">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {donations.map((d: DonationRow) => (
                  <tr
                    key={d.id}
                    className="border-b border-border/50 transition-colors hover:bg-muted/30"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {formatCurrency(Number(d.amount_usd), d.currency)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {d.currency.toUpperCase()}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {d.recurrence === "once" ? "One-time" : d.recurrence}
                    </td>
                    <td className="max-w-[200px] truncate px-4 py-3 text-muted-foreground">
                      {d.purpose}
                    </td>
                    <td className="px-4 py-3">{statusBadge(d.status)}</td>
                    <td className="max-w-[150px] truncate px-4 py-3 text-muted-foreground">
                      {d.donor_name || d.donor_email || "\u2014"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                      {formatDate(d.created_at)}
                    </td>
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
