"use client";

import { useEffect, useState } from "react";
import { Users, DollarSign, ShoppingBag, Mail, ArrowUpRight } from "lucide-react";

import {
  DonationRow,
  ProfileRow,
} from "@/lib/auth";
import { formatCurrency, formatNumber, formatDate } from "@/lib/admin-utils";

function Donut({ pct, color = "#009FAF", label }: { pct: number; color?: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="relative grid h-[130px] w-[130px] place-items-center rounded-full"
        style={{ background: `conic-gradient(${color} ${pct}%, #E6ECEF 0)` }}
      >
        <div className="flex h-[80px] w-[80px] items-center justify-center rounded-full bg-white text-2xl font-bold text-[#00736B]">
          {label}
        </div>
      </div>
    </div>
  );
}

interface MonthEngagement {
  label: string;
  activeSessions: number;
  mentorCalls: number;
  messagesSent: number;
  total: number;
}

function tot(m: Omit<MonthEngagement, "total">): MonthEngagement {
  return { ...m, total: m.activeSessions + m.mentorCalls + m.messagesSent };
}

const monthlyEngagement: MonthEngagement[] = [
  tot({ label: "Jan", activeSessions: 720, mentorCalls: 340, messagesSent: 540 }),
  tot({ label: "Feb", activeSessions: 880, mentorCalls: 410, messagesSent: 810 }),
  tot({ label: "Mar", activeSessions: 760, mentorCalls: 390, messagesSent: 750 }),
  tot({ label: "Apr", activeSessions: 1120, mentorCalls: 520, messagesSent: 1060 }),
  tot({ label: "May", activeSessions: 1340, mentorCalls: 610, messagesSent: 1150 }),
];

/** Monthly bar colors: warm to cool progression (matches capsule chart reference) */
const engagementCapsuleColors = [
  "#E85D6C",
  "#E87850",
  "#E89A45",
  "#D9A84C",
  "#B8A85E",
  "#9BA86E",
  "#7BA896",
  "#5D9B9E",
  "#4FA8BD",
  "#5EB0E8",
  "#58C4D8",
  "#4DCDEA",
] as const;

const matchingStats = [
  { label: "Pending Matches", value: "38", desc: "Awaiting mentor confirmation.", color: "text-[#FF7A00]" },
  { label: "This Week's Matches", value: "126", desc: "Across 14 countries.", color: "text-[#009FAF]" },
  { label: "Avg. Compatibility", value: "92%", desc: "Based on Superpower quiz.", color: "text-[#E93D8F]" },
];

const programData = [
  { program: "School Outreach, West Africa", lead: "Chinwe E.", region: "Nigeria, Ghana", reach: "42 schools", status: "Running", statusClass: "g" as const },
  { program: "Adult Safe Place, Europe", lead: "Sara M.", region: "UK, Ireland", reach: "1,210 adults", status: "Running", statusClass: "g" as const },
  { program: "Inclusive Support Hub", lead: "David R.", region: "Global", reach: "580 members", status: "Scaling", statusClass: "o" as const },
  { program: "Religious Outreach", lead: "Imam Yusuf", region: "MENA", reach: "18 partners", status: "Pilot", statusClass: "t" as const },
];

const lifecycleData = [
  { stage: "Early Childhood", age: "0-6", active: "820", capacity: "1,500" },
  { stage: "Primary Years", age: "7-11", active: "1,640", capacity: "2,200" },
  { stage: "Adolescence", age: "12-17", active: "2,310", capacity: "3,000" },
  { stage: "Young Adult", age: "18-25", active: "2,980", capacity: "3,500" },
  { stage: "Adult Belonging", age: "26-45", active: "3,120", capacity: "4,000" },
  { stage: "Mid-life Reconnection", age: "46-60", active: "980", capacity: "1,500" },
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
  { page: "Home", lastEdited: "2026-05-12", status: "Published", statusClass: "g" as const },
  { page: "Save A Sibling", lastEdited: "2026-05-11", status: "Published", statusClass: "g" as const },
  { page: "Match A Sibling", lastEdited: "2026-05-09", status: "Draft", statusClass: "o" as const },
  { page: "Safeguarding Policy", lastEdited: "2026-04-22", status: "Published", statusClass: "g" as const },
  { page: "SDG Framework", lastEdited: "2026-04-18", status: "Published", statusClass: "g" as const },
];

const integrationsData = [
  { name: "Open Badge Factory", desc: "Issue achievement badges to siblings & mentors.", status: "Connected", statusClass: "g" as const },
  { name: "Zoom / Agora", desc: "Secure video sessions with safeguarding logs.", status: "Connected", statusClass: "g" as const },
  { name: "TensorFlow.js", desc: "On-device personality matching for the Superpower quiz.", status: "Active", statusClass: "t" as const },
  { name: "Woebot", desc: "Emotional support companion for adult safe places.", status: "Connected", statusClass: "g" as const },
  { name: "Cal.com", desc: "Mentor scheduling & reminders.", status: "Connected", statusClass: "g" as const },
  { name: "Lovable Cloud", desc: "Database, auth, storage & edge functions.", status: "Primary", statusClass: "t" as const },
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

function Pill({ status, statusClass }: { status: string; statusClass: string }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${pillStyles[statusClass] || pillStyles.g}`}>
      {status}
    </span>
  );
}

interface KpiCardProps {
  label: string;
  value: string;
  delta: string;
  borderColor: string;
  deltaClass?: string;
}

function KpiCard({ label, value, delta, borderColor, deltaClass }: KpiCardProps) {
  return (
    <div className={`rounded-xl border border-[#E6ECEF] bg-white p-4 shadow-sm ${borderColor} border-l-[4px]`}>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#888]">{label}</p>
      <p className="mt-1 text-[26px] font-bold tracking-tight text-[#1a1a1a]">{value}</p>
      <p className={`mt-0.5 text-xs font-medium ${deltaClass || "text-[#0a8a4a]"}`}>{delta}</p>
    </div>
  );
}

function SectionCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-[#E6ECEF] bg-white shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-bold tracking-tight text-[#1a1a1a]">{title}</h2>
      {subtitle && <p className="mt-0.5 text-sm text-[#888]">{subtitle}</p>}
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-[#E6ECEF] bg-white p-5 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function Table({ headers = [], children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-[#E6ECEF] bg-[#FAFAFA]">
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#888]">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export default function DashboardOverview({ onNavigate }: { onNavigate?: (section: string) => void }) {
  const [profileRows, setProfileRows] = useState<ProfileRow[]>([]);
  const [donationsRows, setDonationsRows] = useState<DonationRow[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalContacts, setTotalContacts] = useState(0);
  const [revenueTotal, setRevenueTotal] = useState(0);
  const [completedDonations, setCompletedDonations] = useState(0);
  const [engagementData, setEngagementData] = useState<MonthEngagement[] | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/users").then(r => r.json()).then(data => {
        const list = data || [];
        setProfileRows(list);
        setTotalUsers(list.length);
      }).catch(() => {}),
      fetch("/api/admin/donations").then(r => r.json()).then(data => {
        const list = data || [];
        setDonationsRows(list);
        const completed = list.filter((d: DonationRow) => d.status === "completed");
        setCompletedDonations(completed.length);
        setRevenueTotal(completed.reduce((sum: number, d: DonationRow) => sum + Number(d.amount_usd), 0));
      }).catch(() => {}),
      fetch("/api/admin/contacts").then(r => r.json()).then(data => {
        setTotalContacts(data?.length || 0);
      }).catch(() => {}),
      fetch("/api/admin/engagement").then(r => r.json()).then(data => {
        if (data?.months?.length) {
          const merged: MonthEngagement[] = data.months.map((api: { label: string; visits: number }) => {
            if (api.visits > 0) {
              return tot({ label: api.label, activeSessions: Math.round(api.visits * 0.65), mentorCalls: Math.round(api.visits * 0.2), messagesSent: Math.round(api.visits * 0.15) });
            }
            const fallback = monthlyEngagement.find(m => m.label === api.label);
            return fallback ? { ...fallback } : tot({ label: api.label, activeSessions: 0, mentorCalls: 0, messagesSent: 0 });
          });
          setEngagementData(merged);
        }
      }).catch(() => {}),
    ]);
  }, []);

  const chartData = engagementData ?? monthlyEngagement;
  const chartMax = Math.max(...chartData.map(m => m.total), 1);
  const chartTotal = chartData.reduce((s, m) => s + m.total, 0);
  const chartAvg = Math.round(chartTotal / chartData.length);
  const chartPeak = [...chartData].sort((a, b) => b.total - a.total)[0];

  const kpiData = [
    { label: "Total Users", value: formatNumber(totalUsers), delta: "Registered on platform", borderColor: "border-l-[#009FAF]" },
    { label: "Contact Submissions", value: formatNumber(totalContacts), delta: "Form entries received", borderColor: "border-l-[#FF7A00]" },
    { label: "Completed Donations", value: formatNumber(completedDonations), delta: "Successful transactions", borderColor: "border-l-[#E93D8F]" },
    { label: "Revenue Raised", value: formatCurrency(revenueTotal), delta: "Total donations YTD", borderColor: "border-l-[#FFC400]" },
    { label: "Open Safeguarding", value: "14 open", delta: "2 high priority", borderColor: "border-l-[#F52A3D]", deltaClass: "text-[#F52A3D]" },
  ];

  const quickLinks = [
    { label: "Contacts", section: "contacts", icon: Users, bg: "bg-[#009FAF]" },
    { label: "Donations", section: "donations", icon: DollarSign, bg: "bg-[#E93D8F]" },
    { label: "Orders", section: "orders", icon: ShoppingBag, bg: "bg-[#FF7A00]" },
    { label: "Subscribers", section: "subscribers", icon: Mail, bg: "bg-[#555555]" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1a1a1a]">Dashboard</h1>
          <p className="mt-0.5 text-sm text-[#888]">
            MyTrueSiblings Foundation: Admin Control Center
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickLinks.map((btn) => (
            <button
              key={btn.section}
              onClick={() => onNavigate?.(btn.section)}
              className={`inline-flex items-center gap-1.5 rounded-lg ${btn.bg} px-3.5 py-2 text-xs font-semibold text-white transition-all hover:opacity-90 active:scale-95`}
            >
              <btn.icon className="h-3.5 w-3.5" />
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      <section id="overview" className="scroll-mt-20">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {kpiData.map((kpi) => <KpiCard key={kpi.label} {...kpi} />)}
        </div>

        <Card className="w-full">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-[#1a1a1a]">Sibling Engagement ({chartData[0]?.label ?? "Jan"} to {chartData[chartData.length - 1]?.label ?? "May"})</h3>
            <div className="flex items-center gap-3">
              <span className="hidden text-[10px] text-[#888] sm:inline">
                <strong className="text-[#1a1a1a]">Total:</strong> {formatNumber(chartTotal)}
              </span>
              <span className="rounded-full bg-[rgba(0,159,175,0.1)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#009FAF]">Live</span>
            </div>
          </div>
          <div className="rounded-xl bg-gray-50/80 px-3 py-6 sm:px-4 sm:py-8 md:px-6">
            <div className="grid h-[min(64svh,52rem)] min-h-[min(40svh,20rem)] w-full grid-cols-12 gap-1.5 sm:h-[min(68svh,54rem)] sm:min-h-[min(46svh,24rem)] sm:gap-2 md:h-[min(72svh,56rem)] md:min-h-[min(50svh,28rem)] md:gap-3 lg:gap-4">
              {chartData.map((m, i) => {
                const pct = chartMax > 0 ? (m.total / chartMax) * 100 : 0;
                const fill = engagementCapsuleColors[i] ?? "#58C4D8";
                return (
                  <div
                    key={m.label}
                    className="flex h-full min-h-0 min-w-0 flex-col items-stretch"
                  >
                    <div className="flex min-h-0 w-full flex-1 flex-col justify-end">
                      <div className="flex h-full w-full flex-col justify-end overflow-hidden rounded-t-[9999px] bg-[#E6ECEF]">
                        <div
                          className="flex w-full flex-col items-center rounded-t-[9999px] px-0.5 pt-2 transition-opacity duration-200 hover:opacity-95 sm:pt-2.5"
                          style={{
                            height: `${pct}%`,
                            backgroundColor: fill,
                          }}
                          title={`${m.label}: ${formatNumber(m.total)}. Sessions ${formatNumber(m.activeSessions)}, calls ${formatNumber(m.mentorCalls)}, messages ${formatNumber(m.messagesSent)}`}
                        >
                          <span className="max-w-full px-0.5 text-center text-[9px] font-bold leading-tight tracking-tight text-white sm:text-[10px] md:text-xs">
                            {Math.round(pct)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="mt-2.5 shrink-0 text-center text-[9px] font-semibold uppercase tracking-wider text-[#888] sm:text-[10px]">
                      {m.label}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-1.5 text-[10px] text-[#888]">
              <span>
                Avg monthly:{" "}
                <strong className="text-[#1a1a1a]">{formatNumber(chartAvg)}</strong>
              </span>
              <span>
                Peak:{" "}
                <strong className="text-[#1a1a1a]">
                  {chartPeak.label} ({formatNumber(chartPeak.total)})
                </strong>
              </span>
            </div>
          </div>
        </Card>

        <Card className="mx-auto w-full max-w-lg">
          <h3 className="mb-4 text-sm font-bold text-[#1a1a1a]">Match Success Rate</h3>
          <Donut pct={84} color="#009FAF" label="84%" />
          <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-[#888]">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-sm bg-[#009FAF]" />
              Matched &amp; Active
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-sm bg-[#E6ECEF]" />
              Pending / Review
            </span>
          </div>
        </Card>
      </section>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <SectionTitle title="Users" subtitle="Registered profiles on the platform." />
          <button
            onClick={() => onNavigate?.("users")}
            className="inline-flex items-center gap-1 rounded-lg border border-[#E6ECEF] bg-white px-3 py-1.5 text-xs font-semibold text-[#009FAF] transition-colors hover:bg-gray-50"
          >
            View All <ArrowUpRight className="h-3 w-3" />
          </button>
        </div>
        <Table headers={["Name", "Email", "Role", "Joined"]}>
          {profileRows.length === 0 ? (
            <tr><td colSpan={4} className="px-4 py-8 text-center text-sm text-[#888]">No users yet.</td></tr>
          ) : profileRows.slice(0, 5).map((row) => (
            <tr key={row.id} className="border-b border-[#E6ECEF] transition-colors hover:bg-[#FAFAFA] last:border-0">
              <td className="px-4 py-3 font-medium text-[#1a1a1a]">{row.full_name || "\u2014"}</td>
              <td className="px-4 py-3 text-[#888]">{row.email || "\u2014"}</td>
              <td className="px-4 py-3"><Pill status={row.role} statusClass={row.role === "admin" ? "t" : "g"} /></td>
              <td className="px-4 py-3 text-[#888]">{formatDate(row.created_at)}</td>
            </tr>
          ))}
        </Table>
      </Card>

      <section id="siblings" className="scroll-mt-20">
        <SectionTitle title="Sibling Profiles" subtitle="Registered siblings across age stages." />
        <Card>
          <Table headers={["ID", "Name", "Age Stage", "Region", "Status", "Wellbeing"]}>
            <tr className="border-b border-[#E6ECEF] transition-colors hover:bg-[#FAFAFA]">
              <td className="px-4 py-3 font-medium text-[#1a1a1a]">SB-1042</td>
              <td className="px-4 py-3 text-[#888]">Amara O.</td>
              <td className="px-4 py-3 text-[#888]">Teen (13-17)</td>
              <td className="px-4 py-3 text-[#888]">Lagos, NG</td>
              <td className="px-4 py-3"><Pill status="Active" statusClass="g" /></td>
              <td className="px-4 py-3 text-[#888]">★★★★☆</td>
            </tr>
            <tr className="border-b border-[#E6ECEF] transition-colors hover:bg-[#FAFAFA]">
              <td className="px-4 py-3 font-medium text-[#1a1a1a]">SB-1043</td>
              <td className="px-4 py-3 text-[#888]">Liam P.</td>
              <td className="px-4 py-3 text-[#888]">Young Adult (18-24)</td>
              <td className="px-4 py-3 text-[#888]">London, UK</td>
              <td className="px-4 py-3"><Pill status="Active" statusClass="g" /></td>
              <td className="px-4 py-3 text-[#888]">★★★★★</td>
            </tr>
            <tr className="border-b border-[#E6ECEF] transition-colors hover:bg-[#FAFAFA]">
              <td className="px-4 py-3 font-medium text-[#1a1a1a]">SB-1044</td>
              <td className="px-4 py-3 text-[#888]">Sara M.</td>
              <td className="px-4 py-3 text-[#888]">Child (8-12)</td>
              <td className="px-4 py-3 text-[#888]">Nairobi, KE</td>
              <td className="px-4 py-3"><Pill status="Onboarding" statusClass="o" /></td>
              <td className="px-4 py-3 text-[#888]">★★★☆☆</td>
            </tr>
            <tr className="border-b border-[#E6ECEF] transition-colors hover:bg-[#FAFAFA]">
              <td className="px-4 py-3 font-medium text-[#1a1a1a]">SB-1045</td>
              <td className="px-4 py-3 text-[#888]">Diego R.</td>
              <td className="px-4 py-3 text-[#888]">Adult (25-40)</td>
              <td className="px-4 py-3 text-[#888]">São Paulo, BR</td>
              <td className="px-4 py-3"><Pill status="Active" statusClass="g" /></td>
              <td className="px-4 py-3 text-[#888]">★★★★☆</td>
            </tr>
          </Table>
        </Card>
      </section>

      <section id="matching" className="scroll-mt-20">
        <SectionTitle title="Match A Sibling System" subtitle="Personality-based mentor matching via the Sibling Superpower quiz." />
        <div className="grid gap-4 sm:grid-cols-3">
          {matchingStats.map((stat) => (
            <Card key={stat.label}>
              <p className="mb-1.5 text-xs font-semibold text-[#888]">{stat.label}</p>
              <p className={`text-3xl font-bold tracking-tight ${stat.color}`}>{stat.value}</p>
              <p className="mt-1 text-xs text-[#888]">{stat.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="mentors" className="scroll-mt-20">
        <SectionTitle title="Mentor Roster" subtitle="Verified mentors and their specialties." />
        <Card>
          <Table headers={["ID", "Mentor", "Specialty", "Background Check", "Active Matches", "Rating"]}>
            <tr className="border-b border-[#E6ECEF] transition-colors hover:bg-[#FAFAFA]">
              <td className="px-4 py-3 font-medium text-[#1a1a1a]">MN-201</td>
              <td className="px-4 py-3 text-[#888]">Dr. Ifeoma A.</td>
              <td className="px-4 py-3 text-[#888]">Trauma-informed listening</td>
              <td className="px-4 py-3"><Pill status="Verified" statusClass="g" /></td>
              <td className="px-4 py-3 text-[#888]">7</td>
              <td className="px-4 py-3 text-[#888]">4.9</td>
            </tr>
            <tr className="border-b border-[#E6ECEF] transition-colors hover:bg-[#FAFAFA]">
              <td className="px-4 py-3 font-medium text-[#1a1a1a]">MN-202</td>
              <td className="px-4 py-3 text-[#888]">Marcus T.</td>
              <td className="px-4 py-3 text-[#888]">Youth mentorship</td>
              <td className="px-4 py-3"><Pill status="Verified" statusClass="g" /></td>
              <td className="px-4 py-3 text-[#888]">5</td>
              <td className="px-4 py-3 text-[#888]">4.8</td>
            </tr>
            <tr className="border-b border-[#E6ECEF] transition-colors hover:bg-[#FAFAFA]">
              <td className="px-4 py-3 font-medium text-[#1a1a1a]">MN-203</td>
              <td className="px-4 py-3 text-[#888]">Priya S.</td>
              <td className="px-4 py-3 text-[#888]">Disability inclusion</td>
              <td className="px-4 py-3"><Pill status="Verified" statusClass="g" /></td>
              <td className="px-4 py-3 text-[#888]">6</td>
              <td className="px-4 py-3 text-[#888]">5.0</td>
            </tr>
            <tr className="border-b border-[#E6ECEF] transition-colors hover:bg-[#FAFAFA]">
              <td className="px-4 py-3 font-medium text-[#1a1a1a]">MN-204</td>
              <td className="px-4 py-3 text-[#888]">Omar D.</td>
              <td className="px-4 py-3 text-[#888]">Adult safe place</td>
              <td className="px-4 py-3"><Pill status="Renewing" statusClass="o" /></td>
              <td className="px-4 py-3 text-[#888]">3</td>
              <td className="px-4 py-3 text-[#888]">4.7</td>
            </tr>
          </Table>
        </Card>
      </section>

      <section id="programs" className="scroll-mt-20">
        <SectionTitle title="Programs & Outreach" subtitle="School outreach, adult safe spaces, and disability inclusion." />
        <Card>
          <Table headers={["Program", "Lead", "Region", "Reach", "Status"]}>
            {programData.map((row, i) => (
              <tr key={i} className="border-b border-[#E6ECEF] transition-colors hover:bg-[#FAFAFA] last:border-0">
                <td className="px-4 py-3 font-medium text-[#1a1a1a]">{row.program}</td>
                <td className="px-4 py-3 text-[#888]">{row.lead}</td>
                <td className="px-4 py-3 text-[#888]">{row.region}</td>
                <td className="px-4 py-3 text-[#888]">{row.reach}</td>
                <td className="px-4 py-3"><Pill status={row.status} statusClass={row.statusClass} /></td>
              </tr>
            ))}
          </Table>
        </Card>
      </section>

      <section id="sibling-connect" className="scroll-mt-20">
        <SectionTitle title="Sibling Connect Hub" subtitle="Badges, journals, toolkits, and safe video calls." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-[#E6ECEF] bg-white p-4 shadow-sm border-l-[4px] border-l-[#009FAF]">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#888]">Open Badges Earned</p>
            <p className="mt-1 text-[26px] font-bold tracking-tight text-[#1a1a1a]">19,420</p>
          </div>
          <div className="rounded-xl border border-[#E6ECEF] bg-white p-4 shadow-sm border-l-[4px] border-l-[#FF7A00]">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#888]">Journals Written</p>
            <p className="mt-1 text-[26px] font-bold tracking-tight text-[#1a1a1a]">38,901</p>
          </div>
          <div className="rounded-xl border border-[#E6ECEF] bg-white p-4 shadow-sm border-l-[4px] border-l-[#E93D8F]">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#888]">Toolkits Downloaded</p>
            <p className="mt-1 text-[26px] font-bold tracking-tight text-[#1a1a1a]">12,066</p>
          </div>
          <div className="rounded-xl border border-[#E6ECEF] bg-white p-4 shadow-sm border-l-[4px] border-l-[#FFC400]">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#888]">Safe Video Calls</p>
            <p className="mt-1 text-[26px] font-bold tracking-tight text-[#1a1a1a]">7,432</p>
          </div>
        </div>
      </section>

      <section id="lifecycle" className="scroll-mt-20">
        <SectionTitle title="Lifecycle Support Timeline" subtitle="7 stages of age-specific support. Adjust capacity allocations." />
        <Card>
          <Table headers={["Stage", "Age", "Active Members", "Capacity"]}>
            {lifecycleData.map((row, i) => (
              <tr key={i} className="border-b border-[#E6ECEF] transition-colors hover:bg-[#FAFAFA] last:border-0">
                <td className="px-4 py-3 font-medium text-[#1a1a1a]">{row.stage}</td>
                <td className="px-4 py-3 text-[#888]">{row.age}</td>
                <td className="px-4 py-3 text-[#888]">{row.active}</td>
                <td className="px-4 py-3 text-[#888]">{row.capacity}</td>
              </tr>
            ))}
          </Table>
        </Card>
      </section>

      <section id="safeguarding" className="scroll-mt-20">
        <SectionTitle title="Safeguarding & Trust" subtitle="Mandatory background checks, no private physical contact, GDPR/COPPA compliant." />
        <div className="grid gap-4 sm:grid-cols-3">
          {safeguardingCards.map((card) => (
            <Card key={card.label}>
              <p className="mb-1.5 text-xs font-semibold text-[#888]">{card.label}</p>
              <p className={`text-2xl font-bold tracking-tight ${card.color}`}>{card.value}</p>
              <p className="mt-1 text-xs text-[#888]">{card.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="compliance" className="scroll-mt-20">
        <SectionTitle title="Compliance & Audits" subtitle="Regulatory frameworks and audit status." />
        <Card>
          <Table headers={["Framework", "Status", "Last Audit", "Next Review"]}>
            <tr className="border-b border-[#E6ECEF] transition-colors hover:bg-[#FAFAFA]">
              <td className="px-4 py-3 font-medium text-[#1a1a1a]">GDPR (EU)</td>
              <td className="px-4 py-3"><Pill status="Compliant" statusClass="g" /></td>
              <td className="px-4 py-3 text-[#888]">2026-03-02</td>
              <td className="px-4 py-3 text-[#888]">2026-09-02</td>
            </tr>
            <tr className="border-b border-[#E6ECEF] transition-colors hover:bg-[#FAFAFA]">
              <td className="px-4 py-3 font-medium text-[#1a1a1a]">COPPA (US, &lt;13)</td>
              <td className="px-4 py-3"><Pill status="Compliant" statusClass="g" /></td>
              <td className="px-4 py-3 text-[#888]">2026-02-18</td>
              <td className="px-4 py-3 text-[#888]">2026-08-18</td>
            </tr>
            <tr className="border-b border-[#E6ECEF] transition-colors hover:bg-[#FAFAFA]">
              <td className="px-4 py-3 font-medium text-[#1a1a1a]">WCAG 2.2 AA</td>
              <td className="px-4 py-3"><Pill status="Pass" statusClass="g" /></td>
              <td className="px-4 py-3 text-[#888]">2026-04-09</td>
              <td className="px-4 py-3 text-[#888]">2026-10-09</td>
            </tr>
            <tr className="border-b border-[#E6ECEF] transition-colors hover:bg-[#FAFAFA]">
              <td className="px-4 py-3 font-medium text-[#1a1a1a]">SOC 2 Type II</td>
              <td className="px-4 py-3"><Pill status="In progress" statusClass="o" /></td>
              <td className="px-4 py-3 text-[#888]">&mdash;</td>
              <td className="px-4 py-3 text-[#888]">2026-12-01</td>
            </tr>
          </Table>
        </Card>
      </section>

      <section id="donations" className="scroll-mt-20">
        <SectionTitle title="Donations" />
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <Card>
            <h3 className="mb-4 text-sm font-bold text-[#1a1a1a]">Recent Donations</h3>
            {donationsRows.length === 0 ? (
              <p className="py-6 text-center text-sm text-[#888]">No donations yet.</p>
            ) : (
              <Table headers={["Donor", "Amount", "Designation", "Date"]}>
                {donationsRows.slice(0, 5).map((d) => (
                  <tr key={d.id} className="border-b border-[#E6ECEF] transition-colors hover:bg-[#FAFAFA] last:border-0">
                    <td className="px-4 py-3 font-medium text-[#1a1a1a]">{d.donor_name || d.donor_email || "Anonymous"}</td>
                    <td className="px-4 py-3 text-[#888]">{formatCurrency(Number(d.amount_usd))}</td>
                    <td className="px-4 py-3 text-[#888]">{d.purpose}</td>
                    <td className="px-4 py-3 text-[#888]">{formatDate(d.created_at)}</td>
                  </tr>
                ))}
              </Table>
            )}
          </Card>
          <Card>
            <h3 className="mb-4 text-sm font-bold text-[#1a1a1a]">Allocation</h3>
            <Donut pct={62} color="#009FAF" label="62%" />
            <p className="mt-3 text-center text-xs text-[#888]">Direct programs vs. operations</p>
            <div className="mt-3 flex flex-wrap justify-center gap-4 text-xs text-[#888]">
              <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-2 rounded-sm bg-[#009FAF]" />Programs</span>
              <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-2 rounded-sm bg-[#FF7A00]" />Outreach</span>
              <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-2 rounded-sm bg-[#E93D8F]" />Operations</span>
            </div>
          </Card>
        </div>
      </section>

      <section id="membership" className="scroll-mt-20">
        <SectionTitle title="Membership Tiers" />
        <Card>
          <Table headers={["Tier", "Price / mo", "Members", "Revenue / mo"]}>
            {membershipData.map((row, i) => (
              <tr key={i} className="border-b border-[#E6ECEF] transition-colors hover:bg-[#FAFAFA] last:border-0">
                <td className="px-4 py-3 font-medium text-[#1a1a1a]">{row.tier}</td>
                <td className="px-4 py-3 text-[#888]">{row.price}</td>
                <td className="px-4 py-3 text-[#888]">{row.members}</td>
                <td className="px-4 py-3 text-[#888]">{row.revenue}</td>
              </tr>
            ))}
          </Table>
        </Card>
      </section>

      <section id="partners" className="scroll-mt-20">
        <SectionTitle title="Corporate Partnerships" subtitle="ESG/SDG packages: Bronze, Silver, Gold." />
        <div className="grid gap-4 sm:grid-cols-3">
          {corporatePartners.map((partner) => (
            <Card key={partner.tier}>
              <div className="mb-1 flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#1a1a1a]">{partner.tier}</h3>
                <span className="rounded-full bg-[rgba(255,122,0,0.1)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#FF7A00]">{partner.amount}</span>
              </div>
              <p className="text-xs text-[#888]">{partner.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="pwa" className="scroll-mt-20">
        <SectionTitle title="PWA / Mobile App" subtitle="Install metrics and engagement." />
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[#E6ECEF] bg-white p-4 shadow-sm border-l-[4px] border-l-[#009FAF]">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#888]">iOS Installs</p>
            <p className="mt-1 text-[26px] font-bold tracking-tight text-[#1a1a1a]">8,210</p>
          </div>
          <div className="rounded-xl border border-[#E6ECEF] bg-white p-4 shadow-sm border-l-[4px] border-l-[#FF7A00]">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#888]">Android Installs</p>
            <p className="mt-1 text-[26px] font-bold tracking-tight text-[#1a1a1a]">9,682</p>
          </div>
          <div className="rounded-xl border border-[#E6ECEF] bg-white p-4 shadow-sm border-l-[4px] border-l-[#E93D8F]">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#888]">Affirmation Popups Sent</p>
            <p className="mt-1 text-[26px] font-bold tracking-tight text-[#1a1a1a]">412,900</p>
          </div>
        </div>
      </section>

      <section id="content" className="scroll-mt-20">
        <SectionTitle title="Content & CMS" />
        <Card>
          <Table headers={["Page", "Last edited", "Status"]}>
            {contentData.map((row, i) => (
              <tr key={i} className="border-b border-[#E6ECEF] transition-colors hover:bg-[#FAFAFA] last:border-0">
                <td className="px-4 py-3 font-medium text-[#1a1a1a]">{row.page}</td>
                <td className="px-4 py-3 text-[#888]">{row.lastEdited}</td>
                <td className="px-4 py-3"><Pill status={row.status} statusClass={row.statusClass} /></td>
              </tr>
            ))}
          </Table>
        </Card>
      </section>

      <section id="integrations" className="scroll-mt-20">
        <SectionTitle title="Integrations" subtitle="Connected services powering the platform." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {integrationsData.map((int) => (
            <Card key={int.name}>
              <h3 className="mb-1 text-sm font-bold text-[#1a1a1a]">{int.name}</h3>
              <p className="mb-3 text-xs text-[#888]">{int.desc}</p>
              <Pill status={int.status} statusClass={int.statusClass} />
            </Card>
          ))}
        </div>
      </section>

      <section id="settings-section" className="scroll-mt-20">
        <SectionTitle title="Settings" />
        <Card>
          <h3 className="mb-3 text-sm font-bold text-[#1a1a1a]">Brand Palette</h3>
          <div className="mb-6 flex flex-wrap gap-4 text-xs text-[#888]">
            <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-sm bg-[#009FAF]" />Teal #009FAF</span>
            <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-sm bg-[#FF7A00]" />Orange #FF7A00</span>
            <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-sm bg-[#FFC400]" />Yellow #FFC400</span>
            <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-sm bg-[#E93D8F]" />Pink #E93D8F</span>
            <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-sm bg-[#F52A3D]" />Red #F52A3D</span>
          </div>
          <h3 className="mb-3 text-sm font-bold text-[#1a1a1a]">Compliance</h3>
          <ul className="space-y-1 text-xs text-[#888]">
            <li className="flex items-start gap-2">• GDPR &amp; COPPA compliant data flows</li>
            <li className="flex items-start gap-2">• Mandatory background checks on all mentors</li>
            <li className="flex items-start gap-2">• No private physical contact between mentors and siblings</li>
            <li className="flex items-start gap-2">• Trauma-informed moderation policy enforced platform-wide</li>
          </ul>
        </Card>
      </section>

      <footer className="border-t border-[#E6ECEF] pt-4 text-center text-xs text-[#888]">
        &copy; 2026 MyTrueSiblings Foundation. Admin Dashboard
      </footer>
    </div>
  );
}
