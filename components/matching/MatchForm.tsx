"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Check, Heart, Loader2, Sparkles,
  ShieldCheck, EyeOff, Users, MessageCircle, Globe, Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PILLARS, AGE_RANGES, SUPPORT_TYPES, INTERESTS,
  LANGUAGES, COUNTRIES, type MatchRequest,
} from "@/lib/matching";

const GENDER_OPTIONS = [
  "Male", "Female", "Non-binary", "Prefer not to say",
];

const TIMEZONES = [
  "UTC-12", "UTC-11", "UTC-10", "UTC-9", "UTC-8", "UTC-7", "UTC-6", "UTC-5",
  "UTC-4", "UTC-3", "UTC-2", "UTC-1", "UTC+0", "UTC+1", "UTC+2", "UTC+3",
  "UTC+4", "UTC+5", "UTC+5:30", "UTC+6", "UTC+7", "UTC+8", "UTC+9", "UTC+10",
  "UTC+11", "UTC+12",
];

interface StepProps {
  data: Partial<MatchRequest>;
  update: (fields: Partial<MatchRequest>) => void;
  onNext: () => void;
  onBack?: () => void;
}

function StepPillar({ data, update, onNext }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-2">
          Step 1 of 5
        </p>
        <h3 className="text-2xl font-display font-bold">Where would you like to start?</h3>
        <p className="text-muted-foreground mt-1">Choose the community that fits you best.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        {PILLARS.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => { update({ pillar: p.value }); onNext(); }}
            className={`flex flex-col items-start p-5 rounded-2xl border-2 text-left transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              data.pillar === p.value
                ? "border-primary bg-primary/5 shadow-md"
                : "border-border bg-card hover:border-primary/50"
            }`}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
              <Heart className="h-5 w-5" />
            </span>
            <p className="font-display font-bold text-base mb-1">{p.label}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{p.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function StepAbout({ data, update, onNext, onBack }: StepProps) {
  const canProceed = data.ageRange && data.language;
  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-2">
          Step 2 of 5
        </p>
        <h3 className="text-2xl font-display font-bold">Tell us about yourself</h3>
        <p className="text-muted-foreground mt-1">This helps us find a compatible sibling.</p>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Age Range *</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {AGE_RANGES.map((a) => (
            <button
              key={a.value}
              type="button"
              onClick={() => update({ ageRange: a.value })}
              className={`px-3 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                data.ageRange === a.value
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border bg-card hover:border-primary/50"
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Gender</label>
        <div className="flex flex-wrap gap-2">
          {GENDER_OPTIONS.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => update({ gender: data.gender === g ? "" : g })}
              className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                data.gender === g
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border bg-card hover:border-primary/50"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Language *</label>
          <select
            value={data.language || "English"}
            onChange={(e) => update({ language: e.target.value })}
            className="w-full rounded-xl border-2 border-border bg-card px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Country</label>
          <select
            value={data.country || ""}
            onChange={(e) => update({ country: e.target.value })}
            className="w-full rounded-xl border-2 border-border bg-card px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
          >
            <option value="">Prefer not to say</option>
            {COUNTRIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Time Zone</label>
        <select
          value={data.timezone || ""}
          onChange={(e) => update({ timezone: e.target.value })}
          className="w-full rounded-xl border-2 border-border bg-card px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
        >
          <option value="">Select time zone</option>
          {TIMEZONES.map((tz) => (
            <option key={tz} value={tz}>{tz}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-3 pt-2">
        {onBack && <Button variant="outline" onClick={onBack} className="rounded-full"><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>}
        <Button onClick={canProceed ? onNext : undefined} disabled={!canProceed} className="rounded-full ml-auto">
          Next <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

function StepSupport({ data, update, onNext, onBack }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-2">
          Step 3 of 5
        </p>
        <h3 className="text-2xl font-display font-bold">What kind of support are you looking for?</h3>
      </div>

      <div className="grid gap-3">
        {SUPPORT_TYPES.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => { update({ supportType: s.value }); }}
            className={`flex items-start gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
              data.supportType === s.value
                ? "border-primary bg-primary/5 shadow-md"
                : "border-border bg-card hover:border-primary/50"
            }`}
          >
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              data.supportType === s.value ? "bg-primary text-white" : "bg-primary/10 text-primary"
            }`}>
              {data.supportType === s.value ? <Check className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
            </span>
            <div>
              <p className="font-semibold text-sm">{s.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.description}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        {onBack && <Button variant="outline" onClick={onBack} className="rounded-full"><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>}
        <Button onClick={data.supportType ? onNext : undefined} disabled={!data.supportType} className="rounded-full ml-auto">
          Next <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

function StepInterests({ data, update, onNext, onBack }: StepProps) {
  const selected = data.interests || [];
  const toggle = (interest: string) => {
    update({
      interests: selected.includes(interest)
        ? selected.filter((i) => i !== interest)
        : [...selected, interest],
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-2">
          Step 4 of 5
        </p>
        <h3 className="text-2xl font-display font-bold">Pick your interests</h3>
        <p className="text-muted-foreground mt-1">Select as many as you like. This helps us connect you with like-minded siblings.</p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {INTERESTS.map((interest) => (
          <button
            key={interest}
            type="button"
            onClick={() => toggle(interest)}
            className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
              selected.includes(interest)
                ? "border-primary bg-primary/10 text-primary shadow-sm"
                : "border-border bg-card hover:border-primary/50"
            }`}
          >
            {interest}
            {selected.includes(interest) && <Check className="h-3.5 w-3.5 inline ml-1.5" />}
          </button>
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        {onBack && <Button variant="outline" onClick={onBack} className="rounded-full"><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>}
        <Button onClick={onNext} className="rounded-full ml-auto">
          Next <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

function StepReview({ data, onBack, onSubmit, submitting }: StepProps & { submitting: boolean; onSubmit: () => void }) {
  const pillarLabel = PILLARS.find((p) => p.value === data.pillar)?.label || data.pillar;
  const ageLabel = AGE_RANGES.find((a) => a.value === data.ageRange)?.label || data.ageRange;
  const supportLabel = SUPPORT_TYPES.find((s) => s.value === data.supportType)?.label || data.supportType;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-2">
          Step 5 of 5
        </p>
        <h3 className="text-2xl font-display font-bold">Review your request</h3>
        <p className="text-muted-foreground mt-1">A trained sibling coach will review your match before it reaches you.</p>
      </div>

      <div className="rounded-2xl border-2 border-border bg-card p-6 space-y-4">
        <div className="flex items-center gap-3"><Sparkles className="h-5 w-5 text-primary" /><div><p className="text-sm font-semibold">Community</p><p className="text-sm text-muted-foreground">{pillarLabel}</p></div></div>
        <div className="flex items-center gap-3"><Users className="h-5 w-5 text-primary" /><div><p className="text-sm font-semibold">Age Range</p><p className="text-sm text-muted-foreground">{ageLabel}</p></div></div>
        {data.gender && <div className="flex items-center gap-3"><Heart className="h-5 w-5 text-primary" /><div><p className="text-sm font-semibold">Gender</p><p className="text-sm text-muted-foreground">{data.gender}</p></div></div>}
        <div className="flex items-center gap-3"><Globe className="h-5 w-5 text-primary" /><div><p className="text-sm font-semibold">Language</p><p className="text-sm text-muted-foreground">{data.language}</p></div></div>
        {data.country && <div className="flex items-center gap-3"><Globe className="h-5 w-5 text-primary" /><div><p className="text-sm font-semibold">Country</p><p className="text-sm text-muted-foreground">{COUNTRIES.find((c) => c.value === data.country)?.label || data.country}</p></div></div>}
        <div className="flex items-center gap-3"><MessageCircle className="h-5 w-5 text-primary" /><div><p className="text-sm font-semibold">Support Type</p><p className="text-sm text-muted-foreground">{supportLabel}</p></div></div>
        {data.interests && data.interests.length > 0 && (
          <div className="flex items-start gap-3"><Heart className="h-5 w-5 text-primary mt-0.5" /><div><p className="text-sm font-semibold">Interests</p><div className="flex flex-wrap gap-1.5 mt-1">{data.interests.map((i) => (<span key={i} className="inline-block rounded-full bg-primary/10 text-primary text-xs px-2.5 py-1">{i}</span>))}</div></div></div>
        )}
        <div className="flex items-center gap-3"><EyeOff className="h-5 w-5 text-primary" /><div><p className="text-sm font-semibold">Anonymous Mode</p><p className="text-sm text-muted-foreground">{data.anonymous ? "Yes - your identity will be protected" : "No - you're comfortable sharing your identity"}</p></div></div>
      </div>

      <div className="rounded-2xl bg-primary/5 border border-primary/20 p-4 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          A trained sibling coach will review your proposed match before it reaches you.
          You can pause or cancel the process at any time. No data is shared without your consent.
        </p>
      </div>

      <div className="flex gap-3 pt-2">
        {onBack && <Button variant="outline" onClick={onBack} className="rounded-full"><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>}
        <Button onClick={onSubmit} disabled={submitting} className="rounded-full ml-auto">
          {submitting ? <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Submitting...</> : <>Submit Request <Sparkles className="h-4 w-4 ml-1" /></>}
        </Button>
      </div>
    </div>
  );
}

export default function MatchForm() {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<Partial<MatchRequest>>({
    language: "English",
    anonymous: false,
    interests: [],
  });

  const update = (fields: Partial<MatchRequest>) => setData((prev) => ({ ...prev, ...fields }));

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Something went wrong");
        setSubmitting(false);
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  };

  const next = () => setStep((s) => Math.min(s + 1, 4));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  if (submitted) {
    return (
      <div className="text-center py-16 max-w-lg mx-auto">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-6">
          <Check className="h-8 w-8" />
        </span>
        <h3 className="text-2xl font-display font-bold mb-3">Request Received!</h3>
        <p className="text-muted-foreground mb-4">
          Your match request is saved. Now go to your account and click <strong>&quot;Find Matches&quot;</strong> to run our matching algorithm instantly.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href="/account/matches"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Find Matches Now <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="/match"
            className="inline-flex items-center gap-2 rounded-full border-2 border-primary/30 px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-primary/10 transition-colors"
          >
            Submit Another
          </a>
        </div>
        <p className="text-xs text-muted-foreground mt-6">
          Need help right now? Visit{" "}
          <a href="/crisis" className="text-primary underline">crisis support</a>.
        </p>
      </div>
    );
  }

  const steps = [
    <StepPillar key="pillar" data={data} update={update} onNext={next} />,
    <StepAbout key="about" data={data} update={update} onNext={next} onBack={back} />,
    <StepSupport key="support" data={data} update={update} onNext={next} onBack={back} />,
    <StepInterests key="interests" data={data} update={update} onNext={next} onBack={back} />,
    <StepReview key="review" data={data} update={update} onNext={next} onBack={back} onSubmit={handleSubmit} submitting={submitting} />,
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-center gap-1.5 mb-8">
        {[0, 1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-2 rounded-full transition-all duration-300 ${
              s <= step ? "bg-primary w-8" : "bg-border w-2"
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {steps[step]}
        </motion.div>
      </AnimatePresence>

      {error && (
        <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Takes about 3 minutes</span>
        <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Anonymous available</span>
        <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> Free, always</span>
      </div>
    </div>
  );
}
