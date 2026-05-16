"use client";

import { useState } from "react";
import {
  Heart,
  Shield,
  Users,
  Globe,
  GraduationCap,
  Accessibility,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const donationOptions = [
  {
    value: "10",
    label: "$10",
    desc: "Provides a comfort kit",
  },
  {
    value: "25",
    label: "$25",
    desc: "Funds a safe conversation",
  },
  {
    value: "50",
    label: "$50",
    desc: "Sponsors mentorship for a week",
  },
  {
    value: "100",
    label: "$100",
    desc: "Supports community outreach",
  },
  {
    value: "250",
    label: "$250",
    desc: "Funds an accessibility resource",
  },
  {
    value: "custom",
    label: "Custom",
    desc: "Any amount matters",
  },
];

const funds = [
  {
    icon: Heart,
    title: "Monthly Giving",
    desc: "Sustained support that powers our safe spaces every day.",
    color: "text-brand-pink-hex",
    bg: "bg-brand-pink-hex/10",
  },
  {
    icon: Users,
    title: "Sponsor Mentorship",
    desc: "Connect a vulnerable individual with a trained sibling mentor.",
    color: "text-brand-teal",
    bg: "bg-brand-teal/10",
  },
  {
    icon: Globe,
    title: "Community Outreach",
    desc: "Bring belonging workshops to schools and communities worldwide.",
    color: "text-brand-orange-hex",
    bg: "bg-brand-orange-hex/10",
  },
  {
    icon: Shield,
    title: "Support Fund",
    desc: "Emergency resources for siblings in crisis.",
    color: "text-brand-red-hex",
    bg: "bg-brand-red-hex/10",
  },
  {
    icon: Accessibility,
    title: "Accessibility Fund",
    desc: "Make our platform accessible for all abilities.",
    color: "text-brand-yellow-hex",
    bg: "bg-brand-yellow-hex/10",
  },
  {
    icon: GraduationCap,
    title: "Youth Voices",
    desc: "Empower young people to lead and be heard.",
    color: "text-brand-teal",
    bg: "bg-brand-teal/10",
  },
];

export default function DonateSection() {
  const [selected, setSelected] = useState("25");
  const [customAmount, setCustomAmount] = useState("");
  const [frequency, setFrequency] = useState<"one-time" | "monthly">("one-time");
  const [customAmountError, setCustomAmountError] = useState("");

  const validateCustom = (v: string) => {
    if (!v.trim()) return "";
    const n = Number(v);
    if (!Number.isFinite(n) || n <= 0) return "Enter a valid amount greater than 0.";
    return "";
  };

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-pink-hex/10 px-4 py-1.5 text-sm font-medium text-brand-pink-hex">
            <Heart className="h-3.5 w-3.5" />
            Support A Sibling
          </div>
          <h2 className="font-display text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
            Your Support Changes Lives
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Every contribution creates safe spaces, funds mentorship, and builds
            a world where no one is alone.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-4xl">
          <div className="mb-8 flex justify-center gap-2 rounded-2xl bg-brand-light p-1.5">
            {(["one-time", "monthly"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFrequency(f)}
                className={cn(
                  "rounded-xl px-6 py-2.5 text-sm font-semibold shadow-none motion-safe:hover:translate-y-0",
                  frequency === f
                    ? "border-2 border-transparent bg-white text-brand-teal shadow-sm hover:bg-white hover:shadow-sm"
                    : "border-2 border-transparent bg-transparent text-gray-500 hover:bg-transparent hover:text-gray-800"
                )}
              >
                {f === "one-time" ? "One Time" : "Monthly"}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
            {donationOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setSelected(opt.value);
                  setCustomAmount("");
                }}
                className={cn(
                  "flex h-auto flex-col items-center justify-center gap-1 rounded-2xl border-2 p-4 text-center normal-case hover:shadow-md motion-safe:hover:translate-y-0",
                  selected === opt.value
                    ? "border-brand-teal bg-brand-teal/5 shadow-sm"
                    : "border-border/50 bg-white hover:border-brand-teal/30"
                )}
              >
                <span
                  className={cn(
                    "font-display text-lg font-bold",
                    selected === opt.value ? "text-brand-teal" : "text-gray-800"
                  )}
                >
                  {opt.label}
                </span>
                <span className="mt-1 block text-xs font-normal leading-snug text-gray-500">
                  {opt.desc}
                </span>
              </button>
            ))}
          </div>

          {selected === "custom" && (
            <div className="mt-4">
              <input
                type="number"
                value={customAmount}
                onChange={(e) => { setCustomAmount(e.target.value); setCustomAmountError(validateCustom(e.target.value)); }}
                onBlur={(e) => setCustomAmountError(validateCustom(e.target.value))}
                placeholder="Enter your amount"
                className={`w-full rounded-2xl border-2 bg-white px-5 py-4 text-lg text-gray-800 outline-none ring-1 transition-all focus:ring-2 ${
                  customAmountError ? "border-red-400 ring-red-400/30 focus:border-red-500 focus:ring-red-500" : "border-border/50 ring-border/50 focus:border-brand-teal focus:ring-brand-teal"
                }`}
                min="1"
              />
              {customAmountError && <p className="mt-1 text-sm text-red-500">{customAmountError}</p>}
            </div>
          )}

          <div className="mt-8 text-center">
            <Button
              asChild
              variant="primary"
              size="lg"
              className="rounded-full bg-brand-pink-hex px-10 py-6 text-base text-primary-foreground shadow-xl shadow-brand-pink-hex/30 hover:bg-brand-pink-hex/90 hover:shadow-2xl"
            >
              <Link href={`/save-a-sibling?amount=${selected}&frequency=${frequency}`}>
                <Heart className="h-5 w-5 fill-white" />
                {frequency === "monthly" ? "Give Monthly" : "Give Hope"}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-20 max-w-5xl">
          <h3 className="mb-8 text-center font-display text-2xl font-bold text-gray-900">
            Where Your Donation Goes
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {funds.map((fund) => {
              const Icon = fund.icon;
              return (
                <div
                  key={fund.title}
                  className="group rounded-2xl border border-border/50 bg-white p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${fund.bg} transition-transform group-hover:scale-110`}
                  >
                    <Icon className={`h-6 w-6 ${fund.color}`} />
                  </div>
                  <h4 className="mt-4 font-semibold text-gray-900">
                    {fund.title}
                  </h4>
                  <p className="mt-1 text-sm text-gray-500">{fund.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
