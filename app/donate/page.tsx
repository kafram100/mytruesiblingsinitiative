"use client";

import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import {
  Heart, Users, HandHeart, LifeBuoy, Sparkles, Shield, Globe, BookOpen,
  Building2, ShieldCheck, Lock, CheckCircle2,
} from "lucide-react";
import AnimatedCounter from "@/components/AnimatedCounter";

const oneTimeTiers = [
  { amount: 10, icon: BookOpen, label: "Resource Access", impact: "Provides emotional support resources to one person" },
  { amount: 25, icon: Users, label: "Outreach", impact: "Supports safe community outreach programs" },
  { amount: 50, icon: HandHeart, label: "Train a Sibling", impact: "Helps train a volunteer sibling" },
  { amount: 100, icon: LifeBuoy, label: "Crisis Support", impact: "Strengthens our crisis support infrastructure" },
  { amount: 250, icon: Sparkles, label: "Belonging Event", impact: "Sponsors an inclusive belonging event" },
  { amount: 500, icon: Globe, label: "Global Reach", impact: "Helps expand community wellness systems globally" },
];

const monthlyCircles = [
  { name: "Hope Circle", price: 10, color: "from-[#FFC400]/20 to-[#FF7A00]/10" },
  { name: "Care Circle", price: 25, color: "from-[#FF7A00]/20 to-[#E93D8F]/10" },
  { name: "Unity Circle", price: 50, color: "from-[#E93D8F]/20 to-[#009FAF]/10" },
  { name: "Healing Circle", price: 100, color: "from-[#009FAF]/20 to-[#009FAF]/30" },
  { name: "Legacy Circle", price: 250, color: "from-[#F52A3D]/20 to-[#E93D8F]/20" },
];

const monthlyBenefits = [
  "Monthly impact updates",
  "Community stories from siblings",
  "Volunteer highlights",
  "Quarterly transparency reports",
  "Early access to new initiatives",
];

const allocation = [
  { label: "Programs & Mentorship", pct: 38, color: "#009FAF" },
  { label: "Community Outreach", pct: 18, color: "#FF7A00" },
  { label: "Platform & Technology", pct: 14, color: "#E93D8F" },
  { label: "Accessibility & Inclusion", pct: 10, color: "#FFC400" },
  { label: "Volunteer Systems", pct: 12, color: "#009FAF" },
  { label: "Emergency Support Fund", pct: 8, color: "#F52A3D" },
];

const stories = [
  { quote: "Someone finally listened to me.", who: "Amaka, 17, Lagos", img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&q=80" },
  { quote: "I found safe people again.", who: "Daniel, 24, Nairobi", img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&q=80" },
  { quote: "I no longer feel alone.", who: "Hauwa, 19, Abuja", img: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&q=80" },
  { quote: "I finally found belonging.", who: "Marcus, 22, Accra", img: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80" },
];

const payments = ["Stripe", "PayPal", "Apple Pay", "Google Pay", "Cash App", "Venmo", "Paystack", "Flutterwave"];

function DonateContent() {
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState(50);
  const [tab, setTab] = useState<"once" | "monthly">("once");
  const raised = 18500;

  useEffect(() => {
    const amt = searchParams.get("amount");
    const freq = searchParams.get("frequency");
    if (amt) {
      const n = Number(amt);
      if (!Number.isNaN(n) && n > 0) setSelected(n);
    }
    if (freq === "monthly") setTab("monthly");
    if (freq === "once") setTab("once");
  }, [searchParams]);
  const goal = 100000;
  const progress = (raised / goal) * 100;

  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative py-20 md:py-28 bg-gradient-hero">
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1529390079861-591de354faf5?w=1600&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/15 via-primary/[0.04] to-transparent" aria-hidden />
        <div className="relative container mx-auto px-4 text-center max-w-3xl">
          <div className="rounded-3xl bg-card/80 backdrop-blur-md border p-8 md:p-12 shadow-xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border text-xs font-medium text-primary">
                <Heart className="h-3.5 w-3.5" /> A nonprofit movement for belonging
              </span>
              <h1 className="mt-6 text-4xl md:text-6xl font-display font-bold leading-tight">
                Support Belonging. Support Healing. <span className="text-gradient-primary">Support Humanity.</span>
              </h1>
              <p className="mt-5 text-lg text-muted-foreground">
                Your support helps vulnerable individuals find emotional safety, mentorship, crisis support resources,
                and meaningful human connection through My True Siblings Initiative.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button variant="primary" size="lg" onClick={() => setTab("once")}>
                  <Heart className="h-4 w-4" /> Donate Once
                </Button>
                <Button variant="secondary" size="lg" onClick={() => setTab("monthly")}>
                  <Sparkles className="h-4 w-4" /> Become Monthly Supporter
                </Button>
              </div>
              <p className="mt-6 text-xs text-muted-foreground italic">
                &ldquo;No one should feel alone. Support should be accessible, safe, and human.&rdquo;
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* COMMUNITY IMPACT GOALS */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">Together, We Can Build Belonging</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every donation helps create safer emotional spaces, crisis support access, mentorship opportunities,
              volunteer training, inclusive support systems, and life changing human connection.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Target People Supported", end: 25000 },
              { label: "Volunteer Siblings Trained", end: 1200 },
              { label: "Crisis Support Visits", end: 8500 },
              { label: "Youth Mentorship Matches", end: 2400 },
              { label: "Safe Community Events", end: 320 },
              { label: "Countries Reached", end: 18 },
              { label: "People Connected", end: 60000 },
              { label: "Care Packages Sponsored", end: 4500 },
            ].map((g) => (
              <div key={g.label} className="p-6 rounded-2xl bg-card border shadow-warm text-center">
                <p className="text-3xl md:text-4xl font-display font-bold text-primary">
                  <AnimatedCounter end={g.end} suffix="+" />
                </p>
                <p className="text-xs md:text-sm text-muted-foreground mt-2">{g.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IMPACT TIERS / GIVE */}
      <section className="py-16 bg-muted/40">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display font-bold">Your Gift, Your Impact</h2>
            <p className="text-muted-foreground mt-2">Choose what feels right today.</p>
          </div>

          <div className="flex justify-center mb-8">
            <div className="inline-flex p-1 rounded-full bg-muted border shadow-sm">
              {(["once", "monthly"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                    tab === t
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-foreground/70 hover:text-foreground hover:bg-muted-foreground/10"
                  }`}
                >
                  {t === "once" ? "One-Time Gift" : "Monthly Belonging"}
                </button>
              ))}
            </div>
          </div>

          {tab === "once" ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {oneTimeTiers.map((tier) => (
                  <button
                    key={tier.amount}
                    onClick={() => setSelected(tier.amount)}
                    className={`p-5 rounded-2xl border text-left transition-all backdrop-blur ${
                      selected === tier.amount
                        ? "border-primary bg-primary/5 shadow-teal scale-[1.02]"
                        : "bg-card/70 hover:border-primary/40 hover:shadow-warm"
                    }`}
                  >
                    <tier.icon className="h-5 w-5 text-warm-gold mb-2" />
                    <p className="text-2xl font-display font-bold text-primary">${tier.amount}</p>
                    <p className="text-xs font-semibold mt-1">{tier.label}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-snug">{tier.impact}</p>
                  </button>
                ))}
              </div>
              <div className="text-center">
                <Button variant="primary" size="lg">
                  <Heart className="h-4 w-4" /> Donate ${selected} Now
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-display font-bold">Become A Belonging Builder</h3>
                <p className="text-sm text-muted-foreground">Sustained monthly giving fuels lasting change.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                {monthlyCircles.map((c) => (
                  <div
                    key={c.name}
                    className={`p-5 rounded-2xl border bg-gradient-to-br ${c.color} hover:shadow-warm transition-all text-center`}
                  >
                    <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">{c.name}</p>
                    <p className="text-3xl font-display font-bold text-primary mt-2">
                      ${c.price}<span className="text-sm font-normal text-muted-foreground">/mo</span>
                    </p>
                    <Button variant="secondary" size="sm" className="mt-4 w-full">Join</Button>
                  </div>
                ))}
              </div>
              <div className="p-6 rounded-2xl bg-card border">
                <p className="font-semibold mb-3 text-center">Monthly supporter benefits</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-2xl mx-auto">
                  {monthlyBenefits.map((b) => (
                    <div key={b} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      {b}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* FUNDRAISING CAMPAIGN */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="p-8 md:p-10 rounded-3xl bg-gradient-to-br from-primary/5 via-card to-[#FFC400]/5 border shadow-warm">
            <div className="text-center mb-6">
              <span className="inline-block px-3 py-1 rounded-full bg-[#FFC400]/20 text-xs font-semibold text-foreground">LIVE CAMPAIGN</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold mt-3">Help Build The Future Of Belonging</h2>
              <p className="text-muted-foreground mt-2 max-w-xl mx-auto text-sm">
                Raise initial funding to launch and scale MTSI safely and sustainably across platform, volunteers,
                outreach, accessibility, crisis support, and youth mentorship.
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <p className="text-2xl font-display font-bold text-primary">${raised.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">raised of ${goal.toLocaleString()} goal</p>
              </div>
              <Progress value={progress} className="h-3" />
              <p className="text-xs text-muted-foreground text-center pt-2">
                {progress.toFixed(1)}% funded &bull; Powered by community generosity
              </p>
            </div>
            <div className="mt-6 text-center">
              <Button size="lg" className="border-0 bg-gradient-to-r from-[#009FAF] to-[#00736B] text-white shadow-xl shadow-[#009FAF]/40 hover:shadow-[#009FAF]/50 hover:from-[#009FAF]/90 hover:to-[#00736B]/90 hover:border-0 px-10"><Heart className="h-4 w-4" /> Contribute to the Campaign</Button>
            </div>
          </div>
        </div>
      </section>

      {/* TRANSPARENCY */}
      <section className="py-20 bg-muted/40">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-10">
            <Shield className="h-8 w-8 text-primary mx-auto mb-3" />
            <h2 className="text-3xl md:text-4xl font-display font-bold">Transparency Builds Trust</h2>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
              My True Siblings Initiative is committed to responsible, ethical, and community-focused stewardship of every donation.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-card border shadow-warm">
            <p className="text-sm font-semibold mb-6 text-center">Where every dollar goes</p>
            <div className="space-y-4">
              {allocation.map((a, i) => (
                <motion.div
                  key={a.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{a.label}</span>
                    <span className="text-muted-foreground">{a.pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${a.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: i * 0.08, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: a.color }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center pt-6 border-t">
              {[
                { label: "Program Spend", value: "82%" },
                { label: "Admin & Ops", value: "12%" },
                { label: "Fundraising", value: "6%" },
                { label: "Reports Published", value: "Quarterly" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-display font-bold text-primary">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-6">
            See full breakdowns and budgets on the <Link href="/impact" className="text-primary underline">Impact page</Link>.
          </p>
        </div>
      </section>

      {/* COMMUNITY STORIES */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-display font-bold">Voices Of Belonging</h2>
            <p className="text-muted-foreground mt-2">Real stories from people your support reaches.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {stories.map((s, i) => (
              <motion.div
                key={s.who}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl overflow-hidden bg-card border shadow-warm group"
              >
                <div className="aspect-[4/5] overflow-hidden relative">
                  <Image
                    src={s.img}
                    alt={`Story from ${s.who}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-5">
                  <p className="font-display text-lg leading-snug">&ldquo;{s.quote}&rdquo;</p>
                  <p className="text-xs text-muted-foreground mt-2">{s.who}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CORPORATE / FOUNDATION: explicit colors so text never inherits white-on-white if gradients fail */}
      <section
        className="relative isolate py-20 text-white"
        style={{
          background: "linear-gradient(145deg, #0a5a5c 0%, #064240 45%, #042f2c 100%)",
        }}
      >
        <div className="container relative mx-auto max-w-4xl px-4 text-center">
          <Building2 className="mx-auto mb-4 h-10 w-10 text-[#FFC400]" aria-hidden />
          <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
            Corporate &amp; Foundation Partners
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/95">
            Partner with MTSI to advance community wellbeing, emotional safety, youth empowerment, belonging, mental
            wellness access, disability inclusion, and social connection at scale.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/corporate-partnership"
              className="inline-flex h-11 min-h-[44px] items-center justify-center gap-2 rounded-full bg-white px-8 text-base font-semibold text-[#042f2c] shadow-lg transition-colors hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#042f2c]"
            >
              <Building2 className="h-4 w-4 shrink-0" aria-hidden />
              Partner With MTSI
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-11 min-h-[44px] items-center justify-center gap-2 rounded-full border-2 border-white/80 bg-white/10 px-8 text-base font-semibold text-white backdrop-blur-[2px] transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC400] focus-visible:ring-offset-2 focus-visible:ring-offset-[#042f2c]"
            >
              Talk to our team
            </Link>
          </div>
        </div>
      </section>

      {/* PAYMENT TRUST */}
      <section className="py-12 border-t bg-card">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-5">
            {payments.map((p) => (
              <span key={p} className="text-sm font-semibold text-muted-foreground">{p}</span>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><Lock className="h-3.5 w-3.5 text-primary" /> Secure Donations</span>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-primary" /> SSL Secured</span>
            <span className="inline-flex items-center gap-1.5"><Globe className="h-3.5 w-3.5 text-primary" /> Global Giving Enabled</span>
          </div>
          <p className="mt-6 text-xs text-muted-foreground italic max-w-xl mx-auto">
            My True Siblings Initiative is a nonprofit community platform focused on emotional support, belonging,
            mentorship, inclusion, and human connection. Your contribution helps us provide free resources to vulnerable individuals.
          </p>
        </div>
      </section>
    </div>
  );
}

export default function DonatePage() {
  return (
    <Suspense>
      <DonateContent />
    </Suspense>
  );
}
