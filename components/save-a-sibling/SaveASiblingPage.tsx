"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useState } from "react";
import {
  ArrowRight, BadgeCheck, Building2, Calendar, CreditCard, Globe2,
  HandHeart, Heart, Loader2, Lock, RefreshCw, Shield, Sparkles, Users,
} from "lucide-react";

import * as Tooltip from "@radix-ui/react-tooltip";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { C, CurrencyCode, CURRENCY_CONFIG, Recurrence } from "./config";
import { IMPACT_AMOUNT_PRESETS, DONATION_PURPOSES, PAYMENT_BADGES, TRANSPARENCY, SPONSOR_TIERS, STORIES } from "./data";
import { formatCurrencyAmount, convertUsdAmount, formatEditableAmount } from "./currency";


const CURRENCY_CODES = Object.keys(CURRENCY_CONFIG) as CurrencyCode[];

const HERO_ALT = "Diverse group of friends smiling and linking arms in community";

const PAYMENT_LOGO_MAP: Record<string, string> = {
  Stripe: "/icons/payment/stripe.svg",
  Visa: "/icons/payment/visa.svg",
  Mastercard: "/icons/payment/mastercard.svg",
  "American Express": "/icons/payment/americanexpress.svg",
  "Google Pay": "/icons/payment/googlepay.svg",
  "Apple Pay": "/icons/payment/applepay.svg",
  PayPal: "/icons/payment/paypal.svg",
  Paystack: "/icons/payment/paystack.svg",
  Flutterwave: "/icons/payment/flutterwave.svg",
  Moniepoint: "/icons/payment/moniepoint.svg",
  Opay: "/icons/payment/opay.svg",
  "M Pesa": "/icons/payment/mpesa.svg",
  "Airtel Money": "/icons/payment/airtel.svg",
  "MTN Mobile Money": "/icons/payment/mtn.svg",
  "Bank Transfer": "/icons/payment/banktransfer.svg",
   USSD: "/icons/payment/ussd.svg",
  Klarna: "/icons/payment/klarna.svg",
  "Amazon Pay": "/icons/payment/amazonpay.svg",
  Link: "/icons/payment/link.svg",
  "Local mobile money options": "/icons/payment/localmobile.svg",
};

export default function SaveASiblingPage() {
  const formId = useId();
  const [purpose, setPurpose] = useState<string>(DONATION_PURPOSES[0]);
  const [amountId, setAmountId] = useState<string>("25");
  const [customAmount, setCustomAmount] = useState("");
  const [customAmountInput, setCustomAmountInput] = useState("");
  const [customAmountUsd, setCustomAmountUsd] = useState<number | null>(null);
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [recurrence, setRecurrence] = useState<Recurrence>("once");
  const [sponsorTier, setSponsorTier] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const selectedPreset = IMPACT_AMOUNT_PRESETS.find((preset) => preset.id === amountId);

  const amountLabel =
    amountId === "custom"
      ? customAmountUsd === null
        ? "\u2014"
        : formatCurrencyAmount(convertUsdAmount(customAmountUsd, currency), currency)
      : selectedPreset
        ? formatCurrencyAmount(convertUsdAmount(selectedPreset.amountUsd, currency), currency)
        : "\u2014";

  const handleCurrencyChange = (nextCurrency: CurrencyCode) => {
    if (customAmountUsd !== null) {
      const nextAmount = formatEditableAmount(convertUsdAmount(customAmountUsd, nextCurrency));
      setCustomAmount(nextAmount);
      setCustomAmountInput(nextAmount);
    }
    setCurrency(nextCurrency);
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setCustomAmountInput(value);
    if (!value.trim()) { setCustomAmountUsd(null); return; }
    const parsedValue = Number(value);
    if (!Number.isFinite(parsedValue) || parsedValue <= 0) { setCustomAmountUsd(null); return; }
    setCustomAmountUsd(parsedValue / CURRENCY_CONFIG[currency].rateFromUsd);
  };

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const amount = amountId === "custom" ? customAmountUsd : selectedPreset?.amountUsd;
      const res = await fetch("/api/donate/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, currency, recurrence, purpose, sponsorTier }),
      });
      if (!res.ok) throw new Error("Checkout failed");
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      /* Payment gateway not yet connected */
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] text-[#555555]">
      <HeroSection />
      <DonationFormSection
        formId={formId}
        amountId={amountId}
        setAmountId={setAmountId}
        purpose={purpose}
        setPurpose={setPurpose}
        currency={currency}
        handleCurrencyChange={handleCurrencyChange}
        recurrence={recurrence}
        setRecurrence={setRecurrence}
        sponsorTier={sponsorTier}
        setSponsorTier={setSponsorTier}
        customAmountInput={customAmountInput}
        handleCustomAmountChange={handleCustomAmountChange}
        amountLabel={amountLabel}
        checkoutLoading={checkoutLoading}
        handleCheckout={handleCheckout}
      />
      <PaymentMethodsSection />
      <MonthlySponsorSection
        currency={currency}
        sponsorTier={sponsorTier}
        setSponsorTier={setSponsorTier}
        setRecurrence={setRecurrence}
        setAmountId={setAmountId}
      />
      <TransparencySection />
      <StoriesSection />
      <FinalCTASection />
      <TrustSection />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: C.teal }}>
      <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/25" />
      <div className="container relative mx-auto grid gap-10 px-4 py-16 md:grid-cols-2 md:py-24 lg:gap-16 lg:py-28">
        <div className="flex flex-col justify-center text-white">
          <p className="mb-4 inline-flex w-fit items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em]" style={{ backgroundColor: `${C.orange}e6`, color: C.white }}>
            <Heart className="h-3.5 w-3.5" aria-hidden />
            Impact \u00B7 Save A Sibling
          </p>
          <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
            Save A Sibling. Restore Hope. Build Belonging.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/95 md:text-lg">
            Your gift helps someone feel seen, heard, supported, and never alone. Every donation strengthens safe spaces, emotional support circles, disability inclusion, youth mentorship, adult care, and community outreach.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" className="rounded-full border-0 px-7 font-semibold shadow-lg" style={{ backgroundColor: C.yellow, color: C.gray }} asChild>
              <a href="#give">Donate Now <ArrowRight className="h-4 w-4" aria-hidden /></a>
            </Button>
            <Button size="lg" variant="secondary" className="rounded-full border-2 border-white/40 bg-white/15 px-7 text-white backdrop-blur hover:bg-white/25" asChild>
              <a href="#monthly-sponsor">Sponsor A Sibling</a>
            </Button>
            <Button size="lg" variant="secondary" className="rounded-full border-2 border-white/40 bg-white/10 px-7 text-white hover:bg-white/20" asChild>
              <a href="#monthly-sponsor">Support Monthly</a>
            </Button>
          </div>
        </div>
        <div className="relative min-h-[280px] md:min-h-[420px]">
          <div className="relative h-full min-h-[inherit] overflow-hidden rounded-[2rem] shadow-2xl ring-4 ring-white/20">
            <Image
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=85"
              alt={HERO_ALT}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" aria-hidden />
            <p className="absolute bottom-5 left-5 right-5 text-sm font-medium text-white/95 md:text-base">
              Real lives. Real connection. Your generosity keeps these moments possible.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

interface DonationFormSectionProps {
  formId: string;
  amountId: string;
  setAmountId: (v: string) => void;
  purpose: string;
  setPurpose: (v: string) => void;
  currency: CurrencyCode;
  handleCurrencyChange: (v: CurrencyCode) => void;
  recurrence: Recurrence;
  setRecurrence: (v: Recurrence) => void;
  sponsorTier: string | null;
  setSponsorTier: (v: string | null) => void;
  customAmountInput: string;
  handleCustomAmountChange: (v: string) => void;
  amountLabel: string;
  checkoutLoading: boolean;
  handleCheckout: () => Promise<void>;
}

function DonationFormSection({
  formId, amountId, setAmountId, purpose, setPurpose, currency, handleCurrencyChange,
  recurrence, setRecurrence, sponsorTier, setSponsorTier, customAmountInput,
  handleCustomAmountChange, amountLabel, checkoutLoading, handleCheckout,
}: DonationFormSectionProps) {
  return (
    <section id="give" className="scroll-mt-28 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-bold text-[#555555] md:text-4xl">Choose an amount that feels right</h2>
          <p className="mt-4 text-base leading-relaxed text-[#555555]/90">Every tier is a promise: someone will be met with dignity, care, and a pathway back to hope.</p>
        </div>

        <div className="mx-auto mt-12 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {IMPACT_AMOUNT_PRESETS.map((tier) => {
            const selected = amountId === tier.id;
            return (
              <button key={tier.id} type="button" onClick={() => { setAmountId(tier.id); setSponsorTier(null); }}
                className={cn("flex h-full flex-col rounded-2xl border-2 bg-white p-5 text-left shadow-sm transition-all hover:shadow-md",
                  selected ? "border-[#009FAF] ring-2 ring-[#009FAF]/25" : "border-[#F2F2F2] hover:border-[#009FAF]/40")}>
                <span className="text-2xl font-bold tabular-nums" style={{ color: C.teal }}>
                  {formatCurrencyAmount(convertUsdAmount(tier.amountUsd, currency), currency)}
                </span>
                <span className="mt-1 font-display text-lg font-semibold text-[#555555]">{tier.title}</span>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-[#555555]/85">{tier.detail}</p>
              </button>
            );
          })}
          <button type="button" onClick={() => { setAmountId("custom"); setSponsorTier(null); }}
            className={cn("flex h-full flex-col rounded-2xl border-2 bg-gradient-to-br from-[#E93D8F]/08 to-[#009FAF]/08 p-5 text-left shadow-sm transition-all hover:shadow-md",
              amountId === "custom" ? "border-[#E93D8F] ring-2 ring-[#E93D8F]/20" : "border-transparent ring-1 ring-[#555555]/10")}>
            <span className="text-2xl font-bold" style={{ color: C.pink }}>Custom Amount</span>
            <span className="mt-1 text-sm leading-relaxed text-[#555555]/90">Name your gift\u2014every amount stitches someone back into belonging.</span>
            {amountId === "custom" && (
              <label className="mt-4 block text-xs font-semibold text-[#555555]">
                <span className="sr-only" id={`${formId}-custom`}>Custom donation amount</span>
                <div className="mt-1 flex overflow-hidden rounded-xl border border-[#555555]/20 bg-white">
                  <span className="flex items-center border-r border-[#555555]/15 bg-[#F2F2F2] px-3 text-sm font-semibold text-[#555555]/80">{currency}</span>
                  <input id={`${formId}-custom`} type="number" inputMode="decimal" min={1} step="0.01" placeholder="Enter amount"
                    value={customAmountInput} onChange={(e) => handleCustomAmountChange(e.target.value)}
                    className="w-full border-0 bg-white px-3 py-2 text-base text-[#555555] outline-none ring-[#009FAF]/40 focus:ring-2" />
                </div>
              </label>
            )}
          </button>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <h3 className="text-center font-display text-2xl font-bold text-[#555555] md:text-3xl">Where should we direct your gift?</h3>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-[#555555]/85 md:text-base">
            Pick a lane\u2014or choose General Outreach to let our safeguarding and impact teams deploy funds where urgency is greatest.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {DONATION_PURPOSES.map((p) => {
              const active = purpose === p;
              return (
                <button key={p} type="button" onClick={() => setPurpose(p)}
                  className={cn("rounded-full border-2 px-4 py-2 text-left text-xs font-semibold transition-colors md:text-sm",
                    active ? "border-[#009FAF] bg-[#009FAF] text-white shadow-md" : "border-[#555555]/15 bg-white text-[#555555] hover:border-[#009FAF]/50")}>
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl gap-8 rounded-3xl border border-[#555555]/10 bg-white p-6 shadow-sm md:grid-cols-2 md:p-10">
          <div>
            <label htmlFor={`${formId}-currency`} className="flex items-center gap-2 text-sm font-bold text-[#555555]">
              <Globe2 className="h-4 w-4" style={{ color: C.teal }} aria-hidden /> Support in your preferred currency
            </label>
            <select id={`${formId}-currency`} value={currency} onChange={(e) => handleCurrencyChange(e.target.value as CurrencyCode)}
              className="mt-3 w-full rounded-xl border border-[#555555]/20 bg-[#F2F2F2] px-4 py-3 text-[#555555] outline-none focus:ring-2 focus:ring-[#009FAF]/40">
              {CURRENCY_CODES.map((code) => (
                <option key={code} value={code}>{CURRENCY_CONFIG[code].label}</option>
              ))}
            </select>
            <p className="mt-2 text-xs text-[#555555]/75">Package previews update to match your selected currency. Final conversion and fees are shown securely at checkout.</p>
          </div>
          <div>
            <p className="flex items-center gap-2 text-sm font-bold text-[#555555]">
              <RefreshCw className="h-4 w-4" style={{ color: C.orange }} aria-hidden /> Recurring gift
            </p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row" role="group" aria-label="Donation frequency">
              {([["once", "One time donation", Calendar], ["monthly", "Monthly donation", Heart], ["annual", "Annual donation", Sparkles]] as const).map(([key, label, Icon]) => {
                const k = key as Recurrence;
                const on = recurrence === k;
                return (
                  <button key={key} type="button" onClick={() => setRecurrence(k)}
                    className={cn("flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 px-3 py-3 text-xs font-semibold md:text-sm",
                      on ? "border-[#FF7A00] bg-[#FF7A00]/10 text-[#555555]" : "border-[#555555]/12 bg-[#F2F2F2] text-[#555555]/90 hover:border-[#FF7A00]/40")}>
                    <Icon className="h-4 w-4 shrink-0" aria-hidden /> {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-2xl rounded-3xl p-8 text-center text-white shadow-xl" style={{ backgroundColor: C.teal }}>
          <p className="text-sm uppercase tracking-[0.2em] text-white/80">Your selection</p>
          <p className="mt-3 font-display text-2xl font-bold md:text-3xl">
            {recurrence === "once" && `${amountLabel} \u00B7 ${currency}`}
            {recurrence === "monthly" && `Monthly \u00B7 ${amountLabel} \u00B7 ${currency}`}
            {recurrence === "annual" && `Annual \u00B7 ${amountLabel} \u00B7 ${currency}`}
          </p>
          <p className="mt-2 text-sm text-white/90">{purpose}</p>
          <Button size="lg" className="mt-8 rounded-full border-0 px-10 font-semibold shadow-lg" style={{ backgroundColor: C.yellow, color: C.gray }}
            type="button" disabled={checkoutLoading} onClick={handleCheckout}>
            {checkoutLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <CreditCard className="h-4 w-4" aria-hidden />}
            {checkoutLoading ? "Processing..." : "Continue to secure checkout"}
          </Button>
          <p className="mt-4 flex items-center justify-center gap-2 text-xs text-white/80">
            <Lock className="h-3.5 w-3.5" aria-hidden /> Encrypted processing \u00B7 Donor data never sold
          </p>
        </div>
      </div>
    </section>
  );
}

function PaymentMethodsSection() {
  return (
    <Tooltip.Provider delayDuration={200}>
      <section className="border-y border-[#555555]/10 bg-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold text-[#555555] md:text-4xl">Give From Anywhere</h2>
            <p className="mt-4 text-base leading-relaxed text-[#555555]/88">Support MyTrueSiblings securely using multiple global and local payment options.</p>
          </div>
          <div className="mx-auto mt-10 flex max-w-5xl flex-wrap justify-center gap-3 md:gap-4">
            {PAYMENT_BADGES.map((name) => {
              const src = PAYMENT_LOGO_MAP[name];
              return (
                <Tooltip.Root key={name}>
                  <Tooltip.Trigger asChild>
                    <button type="button" className="flex h-12 w-[84px] items-center justify-center overflow-hidden rounded-lg border border-[#555555]/12 bg-white p-2 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#009FAF]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt={name} className="h-full w-full object-contain" />
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content sideOffset={4} className="z-50 rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium text-white shadow-md animate-in fade-in">
                      {name}
                      <Tooltip.Arrow className="fill-gray-900" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              );
            })}
            <span className="inline-flex h-10 items-center rounded-lg border border-dashed border-[#009FAF]/40 bg-[#009FAF]/08 px-3 text-xs font-semibold text-[#009FAF]">Cryptocurrency (where legally enabled)</span>
          </div>
          <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-[#555555]/75">Payment options may vary by country and availability.</p>
        </div>
      </section>
    </Tooltip.Provider>
  );
}

interface MonthlySponsorSectionProps {
  currency: CurrencyCode;
  sponsorTier: string | null;
  setSponsorTier: (v: string | null) => void;
  setRecurrence: (v: Recurrence) => void;
  setAmountId: (v: string) => void;
}

function MonthlySponsorSection({ currency, sponsorTier, setSponsorTier, setRecurrence, setAmountId }: MonthlySponsorSectionProps) {
  return (
    <section id="monthly-sponsor" className="scroll-mt-28 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <HandHeart className="mx-auto h-10 w-10" style={{ color: C.pink }} aria-hidden />
          <h2 className="mt-4 font-display text-3xl font-bold text-[#555555] md:text-4xl">Sponsor A Sibling Monthly</h2>
          <p className="mt-4 text-base text-[#555555]/88">Predictable love in the inbox. Pick a lane of monthly care\u2014change or pause any time.</p>
        </div>
        <div className="mx-auto mt-12 grid max-w-6xl gap-4 md:grid-cols-2 lg:grid-cols-3">
          {SPONSOR_TIERS.map((s) => {
            const selected = sponsorTier === s.id;
            return (
              <button key={s.id} type="button" onClick={() => { setSponsorTier(s.id); setRecurrence("monthly"); setAmountId(String(s.amountUsd)); }}
                className={cn("flex h-full flex-col rounded-2xl border-2 bg-white p-6 text-left shadow-sm transition-all",
                  selected ? "border-[#E93D8F] ring-2 ring-[#E93D8F]/20" : "border-[#F2F2F2] hover:border-[#E93D8F]/35")}>
                <span className="text-sm font-bold uppercase tracking-widest text-[#FF7A00]">{formatCurrencyAmount(convertUsdAmount(s.amountUsd, currency), currency)}/month</span>
                <span className="mt-2 font-display text-xl font-bold text-[#555555]">{s.title}</span>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-[#555555]/85">{s.blurb}</p>
              </button>
            );
          })}
          <button type="button" onClick={() => { setSponsorTier("custom"); setRecurrence("monthly"); setAmountId("custom"); }}
            className={cn("flex h-full flex-col rounded-2xl border-2 border-dashed bg-[#F2F2F2] p-6 text-left transition-all",
              sponsorTier === "custom" ? "border-[#009FAF] ring-2 ring-[#009FAF]/25" : "border-[#555555]/20 hover:border-[#009FAF]/45")}>
            <span className="font-display text-xl font-bold text-[#009FAF]">Custom Monthly Support</span>
            <p className="mt-3 text-sm leading-relaxed text-[#555555]/85">Build a bespoke monthly pledge for schools, caregivers, or a whole circle\u2014our team will confirm impact reporting with you.</p>
          </button>
        </div>
      </div>
    </section>
  );
}

function TransparencySection() {
  return (
    <section className="bg-[rgba(0,159,175,0.08)] py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <BadgeCheck className="mx-auto h-10 w-10 text-[#009FAF]" aria-hidden />
          <h2 className="mt-4 font-display text-3xl font-bold text-[#555555] md:text-4xl">Where Your Gift Goes</h2>
          <p className="mt-4 text-[#555555]/88">We are committed to responsible giving, transparent reporting, and measurable impact.</p>
        </div>
        <div className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TRANSPARENCY.map((row) => (
            <div key={row.label} className="rounded-2xl border border-[#555555]/10 bg-white p-5 shadow-sm">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-semibold text-[#555555]">{row.label}</span>
                <span className="font-display text-3xl font-bold tabular-nums" style={{ color: C.teal }}>{row.pct}%</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#F2F2F2]">
                <div className="h-full rounded-full" style={{ width: `${row.pct}%`, backgroundImage: `linear-gradient(90deg, ${C.teal}, ${C.yellow})` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StoriesSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-center font-display text-3xl font-bold text-[#555555] md:text-4xl">Every Sibling Has a Story</h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-[#555555]/85">Names withheld for dignity\u2014gratitude amplified for humanity.</p>
        <div className="mx-auto mt-12 grid max-w-6xl gap-8 md:grid-cols-3">
          {STORIES.map((s) => (
            <article key={s.title} className="flex flex-col overflow-hidden rounded-[1.75rem] border border-[#555555]/10 bg-white shadow-md">
              <div className="relative aspect-[4/3]">
                <Image src={s.image} alt={s.alt} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-lg font-bold text-[#009FAF]">{s.title}</h3>
                <p className="mt-4 flex-1 text-sm italic leading-relaxed text-[#555555]/92">&ldquo;{s.quote}&rdquo;</p>
                <p className="mt-4 text-xs font-bold uppercase tracking-wider text-[#555555]/60">Anonymous \u00B7 MyTrueSiblings community</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTASection() {
  return (
    <section className="py-16 md:py-20" style={{ background: `linear-gradient(135deg, ${C.pink} 0%, ${C.red} 45%, ${C.orange} 100%)` }}>
      <div className="container mx-auto px-4 text-center text-white">
        <Users className="mx-auto h-10 w-10 text-white/90" aria-hidden />
        <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl lg:text-[2.65rem]">One gift can make someone feel less alone today.</h2>
        <div className="mx-auto mt-10 flex flex-wrap justify-center gap-3">
          <Button size="lg" className="rounded-full border-0 px-8 font-semibold shadow-lg" style={{ backgroundColor: C.yellow, color: C.gray }} asChild>
            <a href="#give">Donate Now <Heart className="h-4 w-4" aria-hidden /></a>
          </Button>
          <Button size="lg" className="rounded-full border-2 border-white/50 bg-white/15 px-8 text-white backdrop-blur hover:bg-white/25" asChild>
            <a href="#monthly-sponsor">Become A Monthly Sponsor</a>
          </Button>
          <Button size="lg" className="rounded-full border-2 border-white/50 bg-white/10 px-8 text-white hover:bg-white/20" asChild>
            <Link href="/corporate-partnership">Partner With Us</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function TrustSection() {
  return (
    <section className="border-t border-[#555555]/10 bg-white py-12 md:py-16">
      <div className="container mx-auto max-w-3xl px-4 text-center">
        <Shield className="mx-auto h-9 w-9 text-[#009FAF]" aria-hidden />
        <p className="mt-4 text-sm leading-relaxed text-[#555555]/88 md:text-base">Your donation is processed securely. Donor information is protected and never sold.</p>
        <p className="mt-4 text-sm leading-relaxed text-[#555555]/75">Donation receipts and nonprofit tax details will be provided where applicable.</p>
        <p className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-[#555555]/65">
          <Building2 className="h-4 w-4 shrink-0" aria-hidden /> MyTrueSiblings \u00B7 Global belonging \u00B7 Local care
        </p>
      </div>
    </section>
  );
}
