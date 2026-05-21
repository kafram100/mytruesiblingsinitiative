"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { LifeBuoy, Loader2, Check, ArrowLeft, HandCoins, Heart, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SUPPORT_TYPES } from "@/lib/support";

export default function NewSupportRequestPage() {
  const router = useRouter();
  const [type, setType] = useState("general_support");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/support/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, subject: subject.trim(), description: description.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to submit request");
        setSubmitting(false);
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push("/account/support"), 2000);
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 mx-auto mb-4">
          <Check className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-display font-bold mb-2">Request Submitted</h2>
        <p className="text-sm text-muted-foreground">
          Your request has been received. An admin will review and respond shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <Button variant="ghost" onClick={() => router.back()} className="rounded-full mb-4">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back
      </Button>

      <div className="text-center mb-6">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3">
          <LifeBuoy className="h-7 w-7" />
        </span>
        <h1 className="text-2xl font-display font-bold">How Can We Help?</h1>
        <p className="text-muted-foreground text-sm mt-1">
          We are here to support you. Tell us what you need.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold mb-2">Type of Assistance</label>
          <div className="grid gap-2">
            {SUPPORT_TYPES.map((option) => {
              const icons: Record<string, typeof HandCoins> = {
                financial_assistance: HandCoins,
                general_support: Heart,
                other: HelpCircle,
              };
              const Icon = icons[option.value] || HelpCircle;
              const selected = type === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setType(option.value)}
                  className={`flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-all ${
                    selected
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-medium text-sm">{option.label}</p>
                  </div>
                  {selected && <Check className="h-4 w-4 ml-auto text-primary" />}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-semibold mb-1.5">Subject</label>
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full rounded-xl border-2 border-border bg-card px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
            placeholder="Brief summary of your request"
            required
            maxLength={200}
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold mb-1.5">Describe Your Situation</label>
          <p className="text-xs text-muted-foreground mb-2">
            Please provide as much detail as possible so we can best assist you.
          </p>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            className="w-full rounded-xl border-2 border-border bg-card px-4 py-2.5 text-sm focus:border-primary focus:outline-none resize-none"
            placeholder="Tell us what you need help with..."
            required
            maxLength={5000}
          />
        </div>

        <Button type="submit" disabled={submitting} className="w-full rounded-full">
          {submitting ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Submitting...</>
          ) : (
            <><LifeBuoy className="h-4 w-4 mr-2" /> Submit Request</>
          )}
        </Button>
      </form>
    </div>
  );
}
