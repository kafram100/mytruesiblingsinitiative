"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, Loader2, Check, ArrowLeft, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { INTERESTS } from "@/lib/matching";

const EXPERTISE_OPTIONS: string[] = [
  ...INTERESTS,
  "Trauma-Informed Care",
  "Grief & Loss",
  "Family Reconciliation",
  "Life Coaching",
  "Career Guidance",
  "Academic Support",
];

export default function MentorRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    expertiseAreas: [] as string[],
    experienceYears: "",
    mentorshipBio: "",
    occupation: "",
    organization: "",
  });

  const update = (fields: Partial<typeof form>) => setForm((prev) => ({ ...prev, ...fields }));

  const toggleExpertise = (area: string) => {
    setForm((prev) => ({
      ...prev,
      expertiseAreas: prev.expertiseAreas.includes(area)
        ? prev.expertiseAreas.filter((a) => a !== area)
        : [...prev.expertiseAreas, area],
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (form.expertiseAreas.length === 0) {
      setError("Select at least one expertise area");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/auth/mentor/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          expertiseAreas: form.expertiseAreas,
          experienceYears: parseInt(form.experienceYears) || 0,
          mentorshipBio: form.mentorshipBio || null,
          occupation: form.occupation || null,
          organization: form.organization || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        setSubmitting(false);
        return;
      }
      localStorage.setItem("guided_tour_enabled", "true");
      router.push("/account/mentor");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  };

  const canContinue = () => {
    if (step === 0) return form.fullName.length >= 2 && form.email.includes("@") && form.password.length >= 8 && form.password === form.confirmPassword;
    if (step === 1) return form.expertiseAreas.length > 0 && form.experienceYears !== "" && form.occupation.trim().length >= 2;
    return true;
  };

  return (
    <div className="min-h-dvh bg-gradient-to-b from-background to-muted/30 py-16 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
            <GraduationCap className="h-8 w-8" />
          </span>
          <h1 className="text-3xl font-display font-bold">Become a Mentor</h1>
          <p className="text-muted-foreground mt-2">
            Share your experience and guide a sibling on their journey.
          </p>
        </div>

        <div className="flex justify-center gap-1.5 mb-8">
          {[0, 1].map((s) => (
            <div key={s} className={`h-2 rounded-full transition-all duration-300 ${s <= step ? "bg-primary w-8" : "bg-border w-2"}`} />
          ))}
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); if (step === 0) { setStep(1); } else { handleSubmit(e); } }}>
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-1.5">Full Name *</label>
                <input type="text" value={form.fullName} onChange={(e) => update({ fullName: e.target.value })} className="w-full rounded-xl border-2 border-border bg-card px-4 py-2.5 text-sm focus:border-primary focus:outline-none" placeholder="Your full name" required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Email *</label>
                <input type="email" value={form.email} onChange={(e) => update({ email: e.target.value })} className="w-full rounded-xl border-2 border-border bg-card px-4 py-2.5 text-sm focus:border-primary focus:outline-none" placeholder="your@email.com" required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Password *</label>
                <input type="password" value={form.password} onChange={(e) => update({ password: e.target.value })} className="w-full rounded-xl border-2 border-border bg-card px-4 py-2.5 text-sm focus:border-primary focus:outline-none" placeholder="At least 8 characters" required minLength={8} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Confirm Password *</label>
                <input type="password" value={form.confirmPassword} onChange={(e) => update({ confirmPassword: e.target.value })} className="w-full rounded-xl border-2 border-border bg-card px-4 py-2.5 text-sm focus:border-primary focus:outline-none" placeholder="Repeat password" required />
              </div>
              <Button type="submit" disabled={!canContinue()} className="w-full rounded-full">
                Next <ArrowLeft className="h-4 w-4 ml-1 rotate-180" />
              </Button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-1.5">Occupation *</label>
                <input type="text" value={form.occupation} onChange={(e) => update({ occupation: e.target.value })} className="w-full rounded-xl border-2 border-border bg-card px-4 py-2.5 text-sm focus:border-primary focus:outline-none" placeholder="e.g. Social Worker, Therapist, Teacher" required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Organization (optional)</label>
                <input type="text" value={form.organization} onChange={(e) => update({ organization: e.target.value })} className="w-full rounded-xl border-2 border-border bg-card px-4 py-2.5 text-sm focus:border-primary focus:outline-none" placeholder="e.g. Nonprofit name, School, Agency" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Years of Experience *</label>
                <input type="number" min="0" max="70" value={form.experienceYears} onChange={(e) => update({ experienceYears: e.target.value })} className="w-full rounded-xl border-2 border-border bg-card px-4 py-2.5 text-sm focus:border-primary focus:outline-none" placeholder="e.g. 5" required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Areas of Expertise *</label>
                <p className="text-xs text-muted-foreground mb-3">Select all that apply. Siblings will see these when looking for a mentor.</p>
                <div className="flex flex-wrap gap-2">
                  {EXPERTISE_OPTIONS.map((area) => (
                    <button key={area} type="button" onClick={() => toggleExpertise(area)} className={`px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all ${form.expertiseAreas.includes(area) ? "border-primary bg-primary/10 text-primary shadow-sm" : "border-border bg-card hover:border-primary/50"}`}>
                      {area}
                      {form.expertiseAreas.includes(area) && <Check className="h-3 w-3 inline ml-1" />}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Your Mentorship Bio</label>
                <p className="text-xs text-muted-foreground mb-2">Tell siblings what you can offer as a mentor.</p>
                <textarea value={form.mentorshipBio} onChange={(e) => update({ mentorshipBio: e.target.value })} rows={4} className="w-full rounded-xl border-2 border-border bg-card px-4 py-2.5 text-sm focus:border-primary focus:outline-none resize-none" placeholder="Share your story, experience, and what drives you to mentor..." />
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setStep(0)} className="rounded-full">
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Button>
                <Button type="submit" disabled={submitting} className="rounded-full ml-auto">
                  {submitting ? <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Creating Account...</> : <>Complete Registration <Heart className="h-4 w-4 ml-1" /></>}
                </Button>
              </div>
            </div>
          )}
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-primary underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
