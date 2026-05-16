import type { Metadata } from "next";
import Link from "next/link";
import {
  DollarSign,
  Users,
  ShoppingBag,
  Mail,
} from "lucide-react";

import db from "@/lib/db";
import { DonationRow, ProfileRow } from "@/lib/auth";
import HashScroll from "@/components/admin/HashScroll";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function Donut({
  pct,
  color = "#009FAF",
  label,
}: {
  pct: number;
  color?: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="relative grid h-[130px] w-[130px] place-items-center rounded-full"
        style={{
          background: `conic-gradient(${color} ${pct}%, #E6ECEF 0)`,
        }}
      >
        <div className="flex h-[80px] w-[80px] items-center justify-center rounded-full bg-white font-serif text-2xl font-bold text-[#00736B]">
          {label}
        </div>
      </div>
    </div>
  );
}

const barChartData = [
  { label: "Dec", height: 48, value: "1.2k" },
  { label: "Jan", height: 60, value: "1.6k" },
  { label: "Feb", height: 72, value: "2.1k" },
  { label: "Mar", height: 65, value: "1.9k" },
  { label: "Apr", height: 88, value: "2.7k" },
  { label: "May", height: 96, value: "3.1k" },
];

const matchingStats = [
  { label: "Pending Matches", value: "38", desc: "Awaiting mentor confirmation.", color: "text-[#FF7A00]" },
  { label: "This Week's Matches", value: "126", desc: "Across 14 countries.", color: "text-[#009FAF]" },
  { label: "Avg. Compatibility", value: "92%", desc: "Based on Superpower quiz.", color: "text-[#E93D8F]" },
];

const programData = [
  { program: "School Outreach — West Africa", lead: "Chinwe E.", region: "Nigeria, Ghana", reach: "42 schools", status: "Running", statusClass: "g" },
  { program: "Adult Safe Place — Europe", lead: "Sara M.", region: "UK, Ireland", reach: "1,210 adults", status: "Running", statusClass: "g" },
  { program: "Inclusive Support Hub", lead: "David R.", region: "Global", reach: "580 members", status: "Scaling", statusClass: "o" },
  { program: "Religious Outreach", lead: "Imam Yusuf", region: "MENA", reach: "18 partners", status: "Pilot", statusClass: "t" },
];

const lifecycleData = [
  { stage: "Early Childhood", age: "0\u20136", active: "820", capacity: "1,500" },
  { stage: "Primary Years", age: "7\u201311", active: "1,640", capacity: "2,200" },
  { stage: "Adolescence", age: "12\u201317", active: "2,310", capacity: "3,000" },
  { stage: "Young Adult", age: "18\u201325", active: "2,980", capacity: "3,500" },
  { stage: "Adult Belonging", age: "26\u201345", active: "3,120", capacity: "4,000" },
  { stage: "Mid-life Reconnection", age: "46\u201360", active: "980", capacity: "1,500" },
  { stage: "Elder Sibling Circle", age: "60+", active: "630", capacity: "1,000" },
];

const membershipData = [
  { tier: "Sibling Friend", price: "Free", members: "8,420", revenue: "\u2014" },
  { tier: "Sibling Circle", price: "$5", members: "2,140", revenue: "$10,700" },
  { tier: "Sibling Family", price: "$12", members: "980", revenue: "$11,760" },
  { tier: "Sibling Champion", price: "$25", members: "410", revenue: "$10,250" },
  { tier: "Sibling Patron", price: "$60", members: "142", revenue: "$8,520" },
  { tier: "Sibling Legacy", price: "$150", members: "38", revenue: "$5,700" },
];

const contentData = [
  { page: "Home", lastEdited: "2026-05-12", status: "Published", statusClass: "g" },
  { page: "Save A Sibling", lastEdited: "2026-05-11", status: "Published", statusClass: "g" },
  { page: "Match-A-Sibling", lastEdited: "2026-05-09", status: "Draft", statusClass: "o" },
  { page: "Safeguarding Policy", lastEdited: "2026-04-22", status: "Published", statusClass: "g" },
  { page: "SDG Framework", lastEdited: "2026-04-18", status: "Published", statusClass: "g" },
];

const integrationsData = [
  { name: "Open Badge Factory", desc: "Issue achievement badges to siblings & mentors.", status: "Connected", statusClass: "g" },
  { name: "Zoom / Agora", desc: "Secure video sessions with safeguarding logs.", status: "Connected", statusClass: "g" },
  { name: "TensorFlow.js", desc: "On-device personality matching for the Superpower quiz.", status: "Active", statusClass: "t" },
  { name: "Woebot", desc: "Emotional support companion for adult safe places.", status: "Connected", statusClass: "g" },
  { name: "Cal.com", desc: "Mentor scheduling & reminders.", status: "Connected", statusClass: "g" },
  { name: "Lovable Cloud", desc: "Database, auth, storage & edge functions.", status: "Primary", statusClass: "t" },
];

const safeguardingCards = [
  { label: "Background Checks", value: "2,317 / 2,317", desc: "100% of mentors verified.", color: "text-[#009FAF]" },
  { label: "Open Cases", value: "14", desc: "2 high priority \u2014 assign now.", color: "text-[#F52A3D]" },
  { label: "Moderator on call", value: "7", desc: "24/7 coverage across regions.", color: "text-[#E93D8F]" },
];

const corporatePartners = [
  { tier: "Bronze", amount: "$5K", desc: "12 partners \u2014 local school sponsorships." },
  { tier: "Silver", amount: "$15K", desc: "7 partners \u2014 regional safe spaces." },
  { tier: "Gold", amount: "$50K", desc: "3 partners \u2014 global mentor network funding." },
];

const pillStyles: Record<string, string> = {
  t: "bg-[rgba(0,159,175,0.12)] text-[#009FAF]",
  o: "bg-[rgba(255,122,0,0.12)] text-[#FF7A00]",
  p: "bg-[rgba(233,61,143,0.12)] text-[#E93D8F]",
  r: "bg-[rgba(245,42,61,0.12)] text-[#F52A3D]",
  g: "bg-[rgba(10,138,74,0.12)] text-[#0a8a4a]",
};

interface CountRow {
  count: number;
}

interface SumRow {
  total: number;
}

export default async function AdminDashboardPage() {
  const [donationsRows] = await db.execute(
    "SELECT * FROM donations ORDER BY created_at DESC LIMIT 5"
  ).then(([r]) => [r as DonationRow[]]);

  const [profileRows] = await db.execute(
    "SELECT id, email, full_name, role, created_at FROM profiles ORDER BY created_at DESC LIMIT 5"
  ).then(([r]) => [r as ProfileRow[]]);

  const [totalProfiles] = await db.execute(
    "SELECT COUNT(*) as count FROM profiles"
  ).then(([r]) => [r as CountRow[]]);

  const [contactCount] = await db.execute(
    "SELECT COUNT(*) as count FROM contacts"
  ).then(([r]) => [r as CountRow[]]);

  const [donationSum] = await db.execute(
    "SELECT COALESCE(SUM(amount_usd), 0) as total FROM donations WHERE status = 'completed'"
  ).then(([r]) => [r as SumRow[]]);

  const [totalDonations] = await db.execute(
    "SELECT COUNT(*) as count FROM donations WHERE status = 'completed'"
  ).then(([r]) => [r as CountRow[]]);

  const totalUsers = totalProfiles[0]?.count || 0;
  const totalContacts = contactCount[0]?.count || 0;
  const revenueTotal = donationSum[0]?.total || 0;
  const completedDonations = totalDonations[0]?.count || 0;

  const kpiData = [
    { label: "Total Users", value: formatNumber(totalUsers), delta: "Registered on platform", borderColor: "border-l-[#009FAF]" },
    { label: "Contact Submissions", value: formatNumber(totalContacts), delta: "Form entries received", borderColor: "border-l-[#FF7A00]" },
    { label: "Completed Donations", value: formatNumber(completedDonations), delta: "Successful transactions", borderColor: "border-l-[#E93D8F]" },
    { label: "Revenue Raised", value: formatCurrency(revenueTotal), delta: "Total donations YTD", borderColor: "border-l-[#FFC400]" },
    { label: "Open Safeguarding", value: "14 open", delta: "2 high priority", borderColor: "border-l-[#F52A3D]", deltaClass: "text-[#F52A3D]" },
  ];

  return (
    <div className="space-y-6">
      <HashScroll />
      {/* Welcome Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-[26px] font-bold text-[#00736B]">
            Welcome back, Admin 👋
          </h1>
          <p className="text-sm text-[#555]">
            MyTrueSiblings Foundation — Admin Control Center
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/contacts"
            className="inline-flex items-center gap-2 rounded-full bg-[#009FAF] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#00736B]"
          >
            <Users className="h-4 w-4" />
            Contacts
          </Link>
          <Link
            href="/admin/donations"
            className="inline-flex items-center gap-2 rounded-full bg-[#E93D8F] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#d42d7a]"
          >
            <DollarSign className="h-4 w-4" />
            Donations
          </Link>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 rounded-full bg-[#FF7A00] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#e06900]"
          >
            <ShoppingBag className="h-4 w-4" />
            Orders
          </Link>
          <Link
            href="/admin/subscribers"
            className="inline-flex items-center gap-2 rounded-full bg-[#555555] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#333333]"
          >
            <Mail className="h-4 w-4" />
            Subscribers
          </Link>
        </div>
      </div>

      {/* KPIs — 5 cards with colored left border */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {kpiData.map((kpi) => (
          <div
            key={kpi.label}
            className={`rounded-2xl border border-[#E6ECEF] bg-white p-4 shadow-[0_6px_24px_rgba(15,27,45,0.08)] ${kpi.borderColor} border-l-[5px]`}
          >
            <p className="text-[11px] font-bold uppercase tracking-wide text-[#555]">
              {kpi.label}
            </p>
            <p className="mt-1 font-serif text-[28px] font-bold text-[#0F1B2D]">
              {kpi.value}
            </p>
            <p className={`mt-0.5 text-xs font-bold text-[#0a8a4a] ${kpi.deltaClass || ""}`}>
              {kpi.delta}
            </p>
          </div>
        ))}
      </div>

      {/* Engagement Analytics: bar chart + match success donut */}
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-2xl border border-[#E6ECEF] bg-white p-5 shadow-[0_6px_24px_rgba(15,27,45,0.08)]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-[#00736B]">
              Sibling Engagement (last 6 months)
            </h3>
            <span className="rounded-full bg-[rgba(0,159,175,0.12)] px-3 py-0.5 text-xs font-bold uppercase tracking-wide text-[#009FAF]">
              Live
            </span>
          </div>
          <div className="flex items-end gap-3 border-b border-dashed border-[#E6ECEF] pb-2" style={{ height: 200 }}>
            {barChartData.map((b) => (
              <div key={b.label} className="flex flex-1 flex-col items-center justify-end h-full">
                <div
                  className="w-full rounded-t-lg text-center text-[11px] font-bold text-white"
                  style={{
                    height: `${b.height}%`,
                    background: b.label === "Apr" || b.label === "May"
                      ? "linear-gradient(180deg, #FF7A00, #c95e00)"
                      : "linear-gradient(180deg, #009FAF, #00736B)",
                  }}
                >
                  <span className="block pt-1">{b.value}</span>
                </div>
                <span className="mt-1 text-[11px] font-semibold text-[#555]">
                  {b.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#E6ECEF] bg-white p-5 shadow-[0_6px_24px_rgba(15,27,45,0.08)]">
          <h3 className="mb-4 font-serif text-lg font-bold text-[#00736B]">
            Match Success Rate
          </h3>
          <Donut pct={84} color="#009FAF" label="84%" />
          <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-[#555]">
            <span>
              <i className="mr-1.5 inline-block h-2.5 w-2.5 rounded-sm bg-[#009FAF]" />
              Matched &amp; Active
            </span>
            <span>
              <i className="mr-1.5 inline-block h-2.5 w-2.5 rounded-sm bg-[#E6ECEF]" />
              Pending / Review
            </span>
          </div>
        </div>
      </div>

      {/* Siblings & Mentors */}
      <section id="siblings">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-[#00736B]">
            Users
          </h2>
          <Link
            href="/admin/users"
            className="rounded-full border border-[#E6ECEF] bg-white px-4 py-1.5 text-xs font-bold text-[#00736B] transition-colors hover:bg-gray-50"
          >
            View All Users
          </Link>
        </div>
        <p className="mb-3 text-sm text-[#555]">
          Registered profiles on the platform.
        </p>
        <div className="overflow-x-auto rounded-2xl border border-[#E6ECEF] bg-white shadow-[0_6px_24px_rgba(15,27,45,0.08)]">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-[#FAFCFD]">
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-[#555]">Name</th>
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-[#555]">Email</th>
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-[#555]">Role</th>
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-[#555]">Joined</th>
              </tr>
            </thead>
            <tbody>
              {profileRows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-[#555]">No users yet.</td>
                </tr>
              ) : profileRows.map((row, i) => (
                <tr key={row.id} className="border-t border-[#E6ECEF] hover:bg-[#FAFCFD]">
                  <td className="px-4 py-3 font-medium text-[#0F1B2D]">{row.full_name || "\u2014"}</td>
                  <td className="px-4 py-3 text-[#555]">{row.email || "\u2014"}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${pillStyles[row.role === "admin" ? "t" : "g"]}`}>
                      {row.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#555]">{formatDate(row.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Match-A-Sibling */}
      <section id="matching">
        <h2 className="font-serif text-xl font-bold text-[#00736B]">
          Match-A-Sibling System
        </h2>
        <p className="mb-3 text-sm text-[#555]">
          Personality-based mentor matching via the Sibling Superpower quiz.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {matchingStats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-[#E6ECEF] bg-white p-5 shadow-[0_6px_24px_rgba(15,27,45,0.08)]">
              <h3 className="mb-2 text-sm font-semibold text-[#555]">{stat.label}</h3>
              <p className={`font-serif text-[32px] font-bold ${stat.color}`}>{stat.value}</p>
              <p className="mt-1 text-sm text-[#555]">{stat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Programs & Outreach */}
      <section id="programs">
        <h2 className="font-serif text-xl font-bold text-[#00736B]">
          Programs &amp; Outreach
        </h2>
        <p className="mb-3 text-sm text-[#555]">
          School outreach, adult safe spaces, and disability inclusion.
        </p>
        <div className="overflow-x-auto rounded-2xl border border-[#E6ECEF] bg-white shadow-[0_6px_24px_rgba(15,27,45,0.08)]">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-[#FAFCFD]">
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-[#555]">Program</th>
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-[#555]">Lead</th>
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-[#555]">Region</th>
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-[#555]">Reach</th>
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-[#555]">Status</th>
              </tr>
            </thead>
            <tbody>
              {programData.map((row, i) => (
                <tr key={i} className="border-t border-[#E6ECEF] hover:bg-[#FAFCFD]">
                  <td className="px-4 py-3 font-medium text-[#0F1B2D]">{row.program}</td>
                  <td className="px-4 py-3 text-[#555]">{row.lead}</td>
                  <td className="px-4 py-3 text-[#555]">{row.region}</td>
                  <td className="px-4 py-3 text-[#555]">{row.reach}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${pillStyles[row.statusClass] || pillStyles.g}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Lifecycle Support */}
      <section id="lifecycle">
        <h2 className="font-serif text-xl font-bold text-[#00736B]">
          Lifecycle Support Timeline
        </h2>
        <p className="mb-3 text-sm text-[#555]">
          7 stages of age-specific support — adjust capacity allocations.
        </p>
        <div className="overflow-x-auto rounded-2xl border border-[#E6ECEF] bg-white shadow-[0_6px_24px_rgba(15,27,45,0.08)]">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-[#FAFCFD]">
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-[#555]">Stage</th>
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-[#555]">Age</th>
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-[#555]">Active Members</th>
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-[#555]">Capacity</th>
              </tr>
            </thead>
            <tbody>
              {lifecycleData.map((row, i) => (
                <tr key={i} className="border-t border-[#E6ECEF] hover:bg-[#FAFCFD]">
                  <td className="px-4 py-3 font-medium text-[#0F1B2D]">{row.stage}</td>
                  <td className="px-4 py-3 text-[#555]">{row.age}</td>
                  <td className="px-4 py-3 text-[#555]">{row.active}</td>
                  <td className="px-4 py-3 text-[#555]">{row.capacity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Safeguarding */}
      <section id="safeguarding">
        <h2 className="font-serif text-xl font-bold text-[#00736B]">
          Safeguarding &amp; Trust
        </h2>
        <p className="mb-3 text-sm text-[#555]">
          Mandatory background checks, no private physical contact, GDPR/COPPA compliant.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {safeguardingCards.map((card) => (
            <div key={card.label} className="rounded-2xl border border-[#E6ECEF] bg-white p-5 shadow-[0_6px_24px_rgba(15,27,45,0.08)]">
              <h3 className="mb-2 text-sm font-semibold text-[#555]">{card.label}</h3>
              <p className={`font-serif text-[30px] font-bold ${card.color}`}>{card.value}</p>
              <p className="mt-1 text-sm text-[#555]">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Membership Tiers */}
      <section id="membership">
        <h2 className="font-serif text-xl font-bold text-[#00736B]">
          Membership Tiers
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-[#E6ECEF] bg-white shadow-[0_6px_24px_rgba(15,27,45,0.08)]">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-[#FAFCFD]">
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-[#555]">Tier</th>
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-[#555]">Price / mo</th>
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-[#555]">Members</th>
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-[#555]">Revenue / mo</th>
              </tr>
            </thead>
            <tbody>
              {membershipData.map((row, i) => (
                <tr key={i} className="border-t border-[#E6ECEF] hover:bg-[#FAFCFD]">
                  <td className="px-4 py-3 font-medium text-[#0F1B2D]">{row.tier}</td>
                  <td className="px-4 py-3 text-[#555]">{row.price}</td>
                  <td className="px-4 py-3 text-[#555]">{row.members}</td>
                  <td className="px-4 py-3 text-[#555]">{row.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Corporate Partners */}
      <section id="partners">
        <h2 className="font-serif text-xl font-bold text-[#00736B]">
          Corporate Partnerships
        </h2>
        <p className="mb-3 text-sm text-[#555]">
          ESG/SDG packages — Bronze, Silver, Gold.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {corporatePartners.map((partner) => (
            <div key={partner.tier} className="rounded-2xl border border-[#E6ECEF] bg-white p-5 shadow-[0_6px_24px_rgba(15,27,45,0.08)]">
              <h3 className="mb-3 flex items-center justify-between font-serif text-lg font-bold text-[#00736B]">
                {partner.tier}
                <span className="rounded-full bg-[rgba(255,122,0,0.12)] px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-[#FF7A00]">
                  {partner.amount}
                </span>
              </h3>
              <p className="text-sm text-[#555]">{partner.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Save A Sibling — Donations (real + static) */}
      <section id="donations">
        <h2 className="font-serif text-xl font-bold text-[#00736B]">
          Save A Sibling — Donations
        </h2>
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-2xl border border-[#E6ECEF] bg-white p-5 shadow-[0_6px_24px_rgba(15,27,45,0.08)]">
            <h3 className="mb-4 font-serif text-lg font-bold text-[#00736B]">
              Recent Donations
            </h3>
            {donationsRows.length === 0 ? (
              <p className="py-6 text-center text-sm text-[#555]">No donations yet.</p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-[#FAFCFD]">
                    <th className="px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-[#555]">Donor</th>
                    <th className="px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-[#555]">Amount</th>
                    <th className="px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-[#555]">Designation</th>
                    <th className="px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-[#555]">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {donationsRows.map((d: DonationRow, i: number) => (
                    <tr key={d.id} className="border-t border-[#E6ECEF] hover:bg-[#FAFCFD]">
                      <td className="px-3 py-2.5 font-medium text-[#0F1B2D]">
                        {d.donor_name || d.donor_email || "Anonymous"}
                      </td>
                      <td className="px-3 py-2.5 text-[#555]">{formatCurrency(Number(d.amount_usd))}</td>
                      <td className="px-3 py-2.5 text-[#555]">{d.purpose}</td>
                      <td className="px-3 py-2.5 text-[#555]">{formatDate(d.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="rounded-2xl border border-[#E6ECEF] bg-white p-5 shadow-[0_6px_24px_rgba(15,27,45,0.08)]">
            <h3 className="mb-4 font-serif text-lg font-bold text-[#00736B]">
              Allocation
            </h3>
            <Donut pct={62} color="#009FAF" label="62%" />
            <p className="mt-3 text-center text-sm text-[#555]">
              Direct programs vs. operations
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-4 text-sm text-[#555]">
              <span><i className="mr-1.5 inline-block h-2.5 w-2.5 rounded-sm bg-[#009FAF]" />Programs</span>
              <span><i className="mr-1.5 inline-block h-2.5 w-2.5 rounded-sm bg-[#FF7A00]" />Outreach</span>
              <span><i className="mr-1.5 inline-block h-2.5 w-2.5 rounded-sm bg-[#E93D8F]" />Operations</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content & CMS */}
      <section id="content">
        <h2 className="font-serif text-xl font-bold text-[#00736B]">
          Content &amp; CMS
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-[#E6ECEF] bg-white shadow-[0_6px_24px_rgba(15,27,45,0.08)]">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-[#FAFCFD]">
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-[#555]">Page</th>
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-[#555]">Last edited</th>
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-[#555]">Status</th>
              </tr>
            </thead>
            <tbody>
              {contentData.map((row, i) => (
                <tr key={i} className="border-t border-[#E6ECEF] hover:bg-[#FAFCFD]">
                  <td className="px-4 py-3 font-medium text-[#0F1B2D]">{row.page}</td>
                  <td className="px-4 py-3 text-[#555]">{row.lastEdited}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${pillStyles[row.statusClass] || pillStyles.g}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Integrations */}
      <section id="integrations">
        <h2 className="font-serif text-xl font-bold text-[#00736B]">
          Integrations
        </h2>
        <p className="mb-3 text-sm text-[#555]">
          Connected services powering the platform.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {integrationsData.map((int) => (
            <div key={int.name} className="rounded-2xl border border-[#E6ECEF] bg-white p-5 shadow-[0_6px_24px_rgba(15,27,45,0.08)]">
              <h3 className="mb-1 font-serif text-lg font-bold text-[#00736B]">
                {int.name}
              </h3>
              <p className="mb-3 text-sm text-[#555]">{int.desc}</p>
              <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${pillStyles[int.statusClass] || pillStyles.g}`}>
                {int.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Settings: Brand Palette + Compliance */}
      <section id="settings">
        <h2 className="font-serif text-xl font-bold text-[#00736B]">
          Settings
        </h2>
        <div className="rounded-2xl border border-[#E6ECEF] bg-white p-5 shadow-[0_6px_24px_rgba(15,27,45,0.08)]">
          <h3 className="mb-3 font-serif text-lg font-bold text-[#00736B]">
            Brand Palette
          </h3>
          <div className="mb-6 flex flex-wrap gap-5 text-sm text-[#555]">
            <span><span className="mr-1.5 inline-block h-3.5 w-3.5 rounded-sm bg-[#009FAF]" />Teal #009FAF</span>
            <span><span className="mr-1.5 inline-block h-3.5 w-3.5 rounded-sm bg-[#FF7A00]" />Orange #FF7A00</span>
            <span><span className="mr-1.5 inline-block h-3.5 w-3.5 rounded-sm bg-[#FFC400]" />Yellow #FFC400</span>
            <span><span className="mr-1.5 inline-block h-3.5 w-3.5 rounded-sm bg-[#E93D8F]" />Pink #E93D8F</span>
            <span><span className="mr-1.5 inline-block h-3.5 w-3.5 rounded-sm bg-[#F52A3D]" />Red #F52A3D</span>
          </div>

          <h3 className="mb-3 font-serif text-lg font-bold text-[#00736B]">
            Compliance
          </h3>
          <ul className="space-y-1.5 text-sm text-[#555]">
            <li>• GDPR &amp; COPPA compliant data flows</li>
            <li>• Mandatory background checks on all mentors</li>
            <li>• No private physical contact between mentors and siblings</li>
            <li>• Trauma-informed moderation policy enforced platform-wide</li>
          </ul>

          <div className="mt-6">
            <Link
              href="/admin/settings"
              className="rounded-full border border-[#E6ECEF] bg-white px-5 py-2 text-sm font-bold text-[#00736B] transition-colors hover:bg-gray-50"
            >
              Open Settings →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E6ECEF] pt-5 text-center text-xs text-[#555]">
        &copy; 2026 MyTrueSiblings Foundation — Admin Dashboard
      </footer>
    </div>
  );
}
