import type { Metadata } from "next";
import Link from "next/link";
import {
  DollarSign,
  MessageSquare,
  HandHeart,
  Activity,
  TrendingUp,
  Clock,
  MailQuestion,
} from "lucide-react";

import db from "@/lib/db";
import { ContactRow, DonationRow, AggregateResult } from "@/lib/auth";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ExportButton from "@/components/admin/ExportButton";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function AdminDashboardPage() {
  const [contactsRows, donationsRows, completedDonations, totalDonationsRow] =
    await Promise.all([
      db.execute("SELECT * FROM contacts ORDER BY created_at DESC LIMIT 5").then(([r]) => r as ContactRow[]),
      db.execute("SELECT * FROM donations ORDER BY created_at DESC LIMIT 5").then(([r]) => r as DonationRow[]),
      db.execute(
        "SELECT COALESCE(SUM(amount_usd), 0) as total FROM donations WHERE status = 'completed'"
      ).then(([r]) => (r as AggregateResult[])[0]?.total || 0),
      db.execute("SELECT COUNT(*) as total FROM donations").then(([r]) => (r as AggregateResult[])[0]?.total || 0),
    ]);

  const [contactsCount] = await db.execute(
    "SELECT COUNT(*) as total FROM contacts"
  );
  const [unreadContacts] = await db.execute(
    "SELECT COUNT(*) as total FROM contacts WHERE `read` = false"
  );
  const [pendingDonations] = await db.execute(
    "SELECT COUNT(*) as total FROM donations WHERE status = 'pending'"
  );
  const [contactsThisWeek] = await db.execute(
    "SELECT COUNT(*) as total FROM contacts WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)"
  );
  const [contactsThisMonth] = await db.execute(
    "SELECT COUNT(*) as total FROM contacts WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)"
  );
  const [donationsThisMonth] = await db.execute(
    "SELECT COUNT(*) as total FROM donations WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)"
  );

  const recentContacts = contactsRows;
  const recentDonations = donationsRows;
  const totalRevenue = completedDonations;
  const totalDonations = totalDonationsRow;
  const totalContacts = (contactsCount as AggregateResult[])[0]?.total || 0;
  const unreadCount = (unreadContacts as AggregateResult[])[0]?.total || 0;
  const pendingCount = (pendingDonations as AggregateResult[])[0]?.total || 0;
  const inquiriesWeek = (contactsThisWeek as AggregateResult[])[0]?.total || 0;
  const inquiriesMonth = (contactsThisMonth as AggregateResult[])[0]?.total || 0;
  const donationsMonth = (donationsThisMonth as AggregateResult[])[0]?.total || 0;

  const stats = [
    {
      label: "Total Donations",
      value: totalDonations.toString(),
      icon: DollarSign,
      color: "text-emerald-600 bg-emerald-100",
    },
    {
      label: "Total Revenue",
      value: formatCurrency(totalRevenue),
      icon: Activity,
      color: "text-blue-600 bg-blue-100",
    },
    {
      label: "Contact Messages",
      value: totalContacts.toString(),
      icon: HandHeart,
      color: "text-purple-600 bg-purple-100",
    },
    {
      label: "Unread Messages",
      value: unreadCount.toString(),
      icon: MailQuestion,
      color: "text-orange-600 bg-orange-100",
    },
  ];

  const pipelineStats = [
    {
      label: "Pending Donations",
      value: pendingCount.toString(),
      icon: Clock,
      color: "text-amber-600 bg-amber-100",
    },
    {
      label: "New Messages This Week",
      value: inquiriesWeek.toString(),
      icon: TrendingUp,
      color: "text-cyan-600 bg-cyan-100",
    },
    {
      label: "New Messages This Month",
      value: inquiriesMonth.toString(),
      icon: MessageSquare,
      color: "text-indigo-600 bg-indigo-100",
    },
    {
      label: "Donations This Month",
      value: donationsMonth.toString(),
      icon: DollarSign,
      color: "text-emerald-600 bg-emerald-100",
    },
  ];

  function statHref(label: string): string {
    if (label.includes("Donation") || label.includes("Revenue")) return "/admin/donations";
    if (label.includes("Message") || label.includes("Inquir") || label.includes("Contact")) return "/admin/contacts";
    return "/admin";
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Overview of your platform activity.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ExportButton type="contacts" label="Export Contacts" />
          <ExportButton type="donations" label="Export Donations" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Tooltip key={stat.label}>
              <TooltipTrigger asChild>
                <Link
                  href={statHref(stat.label)}
                  className="block rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </p>
                    <div className={`rounded-xl p-2 ${stat.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                    {stat.value}
                  </p>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                {stat.label === "Total Donations" && "Total number of donations received"}
                {stat.label === "Total Revenue" && "Revenue from completed donations"}
                {stat.label === "Contact Messages" && "Total contact form submissions"}
                {stat.label === "Unread Messages" && "New messages awaiting review"}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {pipelineStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Tooltip key={stat.label}>
              <TooltipTrigger asChild>
                <Link
                  href={statHref(stat.label)}
                  className="block rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </p>
                    <div className={`rounded-xl p-2 ${stat.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                    {stat.value}
                  </p>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                {stat.label === "Pending Donations" && "Donations awaiting payment completion"}
                {stat.label === "New Messages This Week" && "Contact form submissions in the last 7 days"}
                {stat.label === "New Messages This Month" && "Contact form submissions in the last 30 days"}
                {stat.label === "Donations This Month" && "Donations received in the last 30 days"}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-foreground">
            Recent Inquiries
          </h2>
          {recentContacts.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No contact submissions yet.
            </p>
          ) : (
            <div className="space-y-3">
              {recentContacts.map((c: ContactRow) => (
                <div
                  key={c.id}
                  className="flex items-start justify-between gap-3 rounded-xl border border-border/50 p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {c.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {c.subject}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatDate(c.created_at)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-foreground">
            Recent Donations
          </h2>
          {recentDonations.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No donations yet.
            </p>
          ) : (
            <div className="space-y-3">
              {recentDonations.map((d: DonationRow) => (
                <div
                  key={d.id}
                  className="flex items-start justify-between gap-3 rounded-xl border border-border/50 p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {formatCurrency(Number(d.amount_usd))}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {d.purpose}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        d.status === "completed"
                          ? "bg-emerald-100 text-emerald-700"
                          : d.status === "pending"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {d.status}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(d.created_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
