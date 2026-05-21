"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BarChart3,
  Users,
  School,
  Globe,
  Download,
  TrendingUp,
  Heart,
  DollarSign,
  Handshake,
  AlertTriangle,
  Target,
  BookOpen,
  Award,
  Shield,
  HandHeart,
  LifeBuoy,
  Sparkles,
  Accessibility,
  Megaphone,
} from "lucide-react";

import AnimatedCounter from "@/components/AnimatedCounter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const year1Budget = [
  { cat: "Platform Development & Maintenance", min: 12000, max: 20000, icon: Sparkles },
  { cat: "Safety & Crisis Infrastructure", min: 8000, max: 15000, icon: LifeBuoy },
  { cat: "Volunteer Training & Screening", min: 5000, max: 10000, icon: HandHeart },
  { cat: "Community Outreach Programs", min: 8000, max: 15000, icon: Megaphone },
  { cat: "Youth & Adult Support Programs", min: 10000, max: 20000, icon: Users },
  { cat: "Accessibility & Disability Inclusion", min: 5000, max: 10000, icon: Accessibility },
  { cat: "Content, Education & Wellness Resources", min: 4000, max: 8000, icon: BookOpen },
  { cat: "Marketing & Awareness Campaigns", min: 6000, max: 12000, icon: Megaphone },
  { cat: "Administrative & Legal Setup", min: 7000, max: 15000, icon: Shield },
  { cat: "Emergency Community Support Fund", min: 5000, max: 10000, icon: Heart },
  { cat: "Events & Belonging Circles", min: 5000, max: 8000, icon: Sparkles },
  { cat: "Operational Reserve", min: 5000, max: 7000, icon: DollarSign },
];

const year2Categories = [
  "Mobile App Development",
  "Global Crisis Resource Expansion",
  "Community Wellness Partnerships",
  "Youth Leadership Program",
  "Mental Wellness Collaborations",
  "Regional Volunteer Coordinators",
  "Multilingual Support Expansion",
  "Accessibility Technology",
  "School Outreach Programs",
  "Community Healing Events",
  "Care Package Sponsorships",
  "Safe Housing Referral Support",
  "Digital Safety Infrastructure",
  "Emergency Wellness Response Network",
];

const communityGoals = [
  { label: "Target People Supported", end: 25000 },
  { label: "Volunteer Siblings Trained", end: 1200 },
  { label: "Crisis Support Visits", end: 8500 },
  { label: "Youth Mentorship Matches", end: 2400 },
  { label: "Safe Community Events", end: 320 },
  { label: "Countries Reached", end: 18 },
  { label: "People Connected", end: 60000 },
  { label: "Care Packages Sponsored", end: 4500 },
];

const metrics = [
  { label: "Siblings Matched", value: "2,500+", icon: Heart, change: "+340 this year" },
  { label: "Sessions Completed", value: "18,000+", icon: BarChart3, change: "+4,200 this year" },
  { label: "Schools Onboarded", value: "150+", icon: School, change: "+35 this year" },
  { label: "Countries Reached", value: "12", icon: Globe, change: "+3 this year" },
  { label: "Volunteer Retention", value: "87%", icon: TrendingUp, change: "+5% YoY" },
  { label: "Students Mentored", value: "8,000+", icon: Users, change: "+2,100 this year" },
];

const indicators = [
  { icon: Heart, label: "People fed through community outreach" },
  { icon: Award, label: "Scholarships given to vulnerable youth" },
  { icon: Users, label: "Siblings matched through MTSI" },
  { icon: School, label: "Students mentored in schools" },
  { icon: Target, label: "Women & youth empowered" },
  { icon: Globe, label: "Climate & community activities completed" },
];

const tools = [
  {
    title: "Annual SDG Report",
    desc: "Comprehensive annual report aligning all impact with UN Sustainable Development Goals.",
  },
  {
    title: "Digital Beneficiary Tracking",
    desc: "Real-time tracking of beneficiaries across all programs with secure data management.",
  },
  {
    title: "Volunteer Platform",
    desc: "Dedicated platform for volunteer management, training tracking, and match monitoring.",
  },
  {
    title: "Impact Scorecards",
    desc: "Quarterly scorecards measuring outcomes across all six program pillars.",
  },
];

const fundingSources = [
  { title: "Grants", desc: "UN, USAID, ECOWAS, and foundation grants", icon: Award },
  { title: "Corporate CSR", desc: "Corporate social responsibility partnerships", icon: Handshake },
  { title: "Individual Donors", desc: "Monthly and one-time individual contributions", icon: Heart },
  { title: "Zakat & Waqf", desc: "Islamic charitable giving contributions", icon: BookOpen },
  { title: "Crowdfunding", desc: "Digital crowdfunding campaigns", icon: Globe },
  { title: "Events & Galas", desc: "Annual fundraising events and galas", icon: Target },
  { title: "TACE Group Support", desc: "Core funding from TACE Foundation", icon: DollarSign },
];

const projections = [
  { year: "2025", funding: "$150,000", beneficiaries: "10,000" },
  { year: "2026", funding: "$300,000", beneficiaries: "25,000" },
  { year: "2027", funding: "$550,000", beneficiaries: "50,000" },
];

const partnerships = [
  "TACE Group subsidiaries",
  "Schools, mosques & churches",
  "Government ministries",
  "Healthcare networks",
  "Tech & EdTech companies",
  "Local community leaders",
  "International NGOs",
  "University ambassador programs",
];

const risks = [
  {
    risk: "Funding shortages",
    mitigation: "Diversify donor base across grants, corporate, individual, and faith-based sources",
  },
  {
    risk: "Volunteer burnout",
    mitigation: "Rotation systems, mental health support, manageable time commitments",
  },
  {
    risk: "Economic instability",
    mitigation: "Maintain 6-month reserve fund, flexible program scaling",
  },
  {
    risk: "Supply delays",
    mitigation: "Local sourcing strategies, multiple supplier relationships",
  },
  {
    risk: "Data breaches",
    mitigation: "Encrypted storage, role-based access, regular security audits",
  },
  {
    risk: "Safeguarding incidents",
    mitigation: "Strict compliance, mandatory reporting, 24 hour escalation process",
  },
];

const tabDefs = [
  { value: "monitoring", label: "M&E Tools" },
  { value: "indicators", label: "Indicators" },
  { value: "funding", label: "Funding Model" },
  { value: "projections", label: "3-Year Projections" },
  { value: "partnerships", label: "Partnerships" },
  { value: "risks", label: "Risk Management" },
] as const;

type TabValue = (typeof tabDefs)[number]["value"];

const downloadableReports = [
  {
    title: "Annual SDG-Aligned Report",
    desc: "Comprehensive annual report aligning impact with UN Sustainable Development Goals.",
  },
  {
    title: "Financial Transparency Report",
    desc: "Complete financial breakdown showing exactly how every dollar is used.",
  },
  {
    title: "Impact Case Studies",
    desc: "In-depth stories of transformation from across our programs.",
  },
  {
    title: "Quarterly Scorecards",
    desc: "Quarterly performance data across all six program pillars.",
  },
];

export default function ImpactPageContent() {
  const [tab, setTab] = useState<TabValue>("monitoring");
  const tabsId = useId();

  return (
    <article className="bg-background">
      <section className="bg-gradient-to-b from-primary/[0.14] via-primary/[0.06] to-background py-20">
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="mb-4 font-display text-4xl font-bold md:text-5xl">
              Impact &amp; Reports
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Transparent, data-driven impact measurement. Every sibling matched, every session,
              every life changed: tracked, reported, and accountable.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="mb-12 text-center font-display text-3xl font-bold">
            Live Impact Dashboard
          </h2>
          <div className="mb-16 grid grid-cols-2 gap-6 md:grid-cols-3">
            {metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-xl border bg-card p-6 text-center shadow-warm"
              >
                <m.icon className="mx-auto mb-3 h-8 w-8 text-primary" aria-hidden />
                <p className="font-display text-3xl font-bold text-primary">{m.value}</p>
                <p className="text-sm text-muted-foreground">{m.label}</p>
                <p className="mt-2 text-xs font-medium text-warm-gold">{m.change}</p>
              </motion.div>
            ))}
          </div>

          <div className="w-full">
            <div
              className="mb-8 flex h-auto flex-wrap justify-center gap-2 bg-transparent"
              role="tablist"
              aria-label="Impact sections"
            >
              {tabDefs.map((t) => {
                const selected = tab === t.value;
                return (
                  <button
                    key={t.value}
                    id={`${tabsId}-${t.value}`}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls={`${tabsId}-panel-${t.value}`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setTab(t.value)}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      selected
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-muted/80 text-foreground hover:bg-muted"
                    )}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>

            {tab === "monitoring" && (
              <div
                role="tabpanel"
                id={`${tabsId}-panel-monitoring`}
                aria-labelledby={`${tabsId}-monitoring`}
                className="rounded-xl border bg-card p-8"
              >
                <h3 className="mb-6 font-display text-2xl font-bold">
                  Monitoring, Evaluation &amp; Impact Tools
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {tools.map((t) => (
                    <div key={t.title} className="flex gap-4 rounded-xl bg-muted p-4">
                      <Download className="mt-1 h-6 w-6 shrink-0 text-primary" aria-hidden />
                      <div>
                        <h4 className="mb-1 font-semibold">{t.title}</h4>
                        <p className="text-sm text-muted-foreground">{t.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "indicators" && (
              <div
                role="tabpanel"
                id={`${tabsId}-panel-indicators`}
                className="rounded-xl border bg-card p-8"
              >
                <h3 className="mb-6 font-display text-2xl font-bold">Key Performance Indicators</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {indicators.map((ind) => (
                    <div key={ind.label} className="flex items-center gap-3 rounded-xl bg-muted p-4">
                      <ind.icon className="h-5 w-5 shrink-0 text-warm-gold" aria-hidden />
                      <p className="text-sm text-muted-foreground">
                        Number of{" "}
                        <strong className="text-foreground">{ind.label.toLowerCase()}</strong>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "funding" && (
              <div
                role="tabpanel"
                id={`${tabsId}-panel-funding`}
                className="rounded-xl border bg-card p-8"
              >
                <h3 className="mb-6 font-display text-2xl font-bold">Funding Model</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {fundingSources.map((f) => (
                    <div key={f.title} className="flex gap-3 rounded-xl bg-muted p-4">
                      <f.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                      <div>
                        <p className="text-sm font-semibold">{f.title}</p>
                        <p className="text-xs text-muted-foreground">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "projections" && (
              <div
                role="tabpanel"
                id={`${tabsId}-panel-projections`}
                className="rounded-xl border bg-card p-8"
              >
                <h3 className="mb-6 font-display text-2xl font-bold">3-Year Growth Projections</h3>
                <div className="overflow-x-auto">
                  <table className="mx-auto w-full max-w-lg">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-3 text-left font-display font-semibold">Year</th>
                        <th className="px-4 py-3 text-left font-display font-semibold">
                          Target Funding
                        </th>
                        <th className="px-4 py-3 text-left font-display font-semibold">
                          Beneficiaries
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {projections.map((p) => (
                        <tr key={p.year} className="border-b last:border-0">
                          <td className="px-4 py-4 font-bold text-primary">{p.year}</td>
                          <td className="px-4 py-4 font-semibold text-warm-gold">{p.funding}</td>
                          <td className="px-4 py-4 text-muted-foreground">{p.beneficiaries}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mx-auto mt-6 max-w-lg rounded-xl border border-primary/10 bg-primary/5 p-4">
                  <p className="text-center text-sm text-muted-foreground">
                    <strong className="text-primary">Total 3-Year Target:</strong> $1,000,000
                    funding | 85,000 beneficiaries reached
                  </p>
                </div>
              </div>
            )}

            {tab === "partnerships" && (
              <div
                role="tabpanel"
                id={`${tabsId}-panel-partnerships`}
                className="rounded-xl border bg-card p-8"
              >
                <h3 className="mb-6 font-display text-2xl font-bold">Strategic Partnerships</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {partnerships.map((p) => (
                    <div key={p} className="flex items-center gap-3 rounded-xl bg-muted p-4">
                      <Handshake className="h-5 w-5 shrink-0 text-primary" aria-hidden />
                      <p className="text-sm text-muted-foreground">{p}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "risks" && (
              <div
                role="tabpanel"
                id={`${tabsId}-panel-risks`}
                className="rounded-xl border bg-card p-8"
              >
                <h3 className="mb-6 font-display text-2xl font-bold">Risk Management Framework</h3>
                <div className="space-y-4">
                  {risks.map((r) => (
                    <div key={r.risk} className="flex gap-4 rounded-xl bg-muted p-4">
                      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warm-gold" aria-hidden />
                      <div>
                        <p className="text-sm font-semibold">{r.risk}</p>
                        <p className="text-xs text-muted-foreground">→ {r.mitigation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Together, We Can Build Belonging
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Every donation helps create safer emotional spaces, crisis support access, mentorship
              opportunities, volunteer training, inclusive support systems, and life changing human
              connection.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {communityGoals.map((g) => (
              <div
                key={g.label}
                className="rounded-2xl border bg-card p-6 text-center shadow-warm"
              >
                <p className="font-display text-3xl font-bold text-primary md:text-4xl">
                  <AnimatedCounter end={g.end} suffix="+" />
                </p>
                <p className="mt-2 text-xs text-muted-foreground md:text-sm">{g.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-stone-500/10 py-20">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="mb-10 text-center">
            <span className="inline-block rounded-full bg-[#FFC400]/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-warm-gold">
              Transparent Budget
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
              Estimated Year 1 Community Budget
            </h2>
            <p className="mt-3 text-muted-foreground">
              Estimated Goal:{" "}
              <span className="font-semibold text-primary">$85,000 to $150,000</span>
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {year1Budget.map((b, i) => {
              const maxOfAll = Math.max(...year1Budget.map((x) => x.max));
              const pct = (b.max / maxOfAll) * 100;
              return (
                <motion.div
                  key={b.cat}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-2xl border bg-card p-5 shadow-sm"
                >
                  <div className="mb-3 flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <b.icon className="h-4 w-4 text-primary" aria-hidden />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{b.cat}</p>
                      <p className="text-xs text-muted-foreground">
                        ${b.min.toLocaleString()} to ${b.max.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: i * 0.04 }}
                      className="h-full bg-gradient-to-r from-primary to-[#FFC400]"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="mb-10 text-center">
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
              Scale &amp; Sustain
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
              2 Year Expansion Vision
            </h2>
            <p className="mt-3 text-muted-foreground">
              Estimated Goal:{" "}
              <span className="font-semibold text-primary">$250,000 to $500,000</span>
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {year2Categories.map((c, i) => (
              <motion.div
                key={c}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-3 rounded-xl border bg-gradient-to-br from-card to-muted/30 p-4"
              >
                <Sparkles className="h-4 w-4 shrink-0 text-warm-gold" aria-hidden />
                <p className="text-sm font-medium">{c}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button variant="primary" size="lg" asChild>
              <Link href="/save-a-sibling">
                <Heart className="h-4 w-4" aria-hidden />
                Fund The Vision
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-muted py-16">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="mb-8 text-center font-display text-2xl font-bold">Downloadable Reports</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {downloadableReports.map((report) => (
              <div key={report.title} className="flex items-start gap-4 rounded-xl border bg-card p-6">
                <Download className="mt-1 h-6 w-6 shrink-0 text-primary" aria-hidden />
                <div>
                  <h3 className="mb-1 font-semibold">{report.title}</h3>
                  <p className="mb-3 text-sm text-muted-foreground">{report.desc}</p>
                  <Link
                    href="/contact"
                    className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                  >
                    Request report (PDF): contact us →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="relative isolate py-16 text-white"
        style={{
          background: "linear-gradient(145deg, #0f6d72 0%, #0a4a48 50%, #062c2a 100%)",
        }}
      >
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <h2 className="mb-6 font-display text-3xl font-bold text-white md:text-4xl">
            A Legacy of Healing, Dignity &amp; Opportunity
          </h2>
          <p className="mb-4 leading-relaxed text-white/95">
            My True Siblings Initiative is not just a program. It is a movement. A restoration of
            belonging. A commitment that no child, no teen, no adult should grow up without guidance,
            love, or someone to call a sibling.
          </p>
          <p className="mb-8 leading-relaxed text-white/95">
            TACE Foundation, strengthened by the transformative My True Siblings Initiative, is
            positioned to uplift generations through health, education, emotional support,
            empowerment, and community-building.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="warm" size="lg" asChild>
              <Link href="/save-a-sibling">Support the Mission</Link>
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="border-2 border-white/75 bg-white/10 text-white shadow-none hover:bg-white/20 hover:text-white"
              asChild
            >
              <Link href="/contact">Partner With Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </article>
  );
}
