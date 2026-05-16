"use client";

import { useState } from "react";
import { Heart, Loader2, Send } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [sending, setSending] = useState(false);
  const [apiError, setApiError] = useState("");

  const validateEmail = (v: string) => {
    if (!v.trim()) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) return "Please enter a valid email.";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const eErr = validateEmail(email);
    setEmailError(eErr);
    if (eErr) return;

    setSending(true);
    setApiError("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to subscribe");
      }
      setSubmitted(true);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-teal to-brand-teal/80 py-20 md:py-28">
      <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-brand-yellow-hex/10 blur-3xl" />

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
            <Heart className="h-3.5 w-3.5 fill-brand-pink-hex text-brand-pink-hex" />
            Stay Connected
          </div>

          <h2 className="font-display text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            Join The Belonging Movement
          </h2>
          <p className="mt-4 text-lg text-white/80">
            Get updates on new collections, impact stories, and ways to connect
            with siblings worldwide.
          </p>

          {submitted ? (
            <div className="mt-8 rounded-2xl bg-white/15 p-6 text-white backdrop-blur-sm">
              <div className="text-2xl">🎉</div>
              <p className="mt-2 font-semibold">You are now part of the movement!</p>
              <p className="mt-1 text-sm text-white/70">
                Welcome to the family. Check your inbox for a warm welcome.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-8 flex max-w-md gap-3"
            >
              <div className="relative flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(validateEmail(e.target.value)); }}
                  onBlur={(e) => setEmailError(validateEmail(e.target.value))}
                  placeholder="Enter your email"
                  className={`w-full rounded-full border-0 px-5 py-3.5 text-white placeholder-white/50 backdrop-blur-sm outline-none transition-all focus:ring-2 bg-white/15 ring-1 ${
                    emailError ? "ring-brand-red-hex/60 focus:ring-brand-red-hex" : "ring-white/20 focus:ring-brand-yellow-hex"
                  }`}
                />
                {emailError && <p className="mt-1 text-xs text-brand-red-hex">{emailError}</p>}
                {apiError && <p className="mt-1 text-xs text-brand-red-hex">{apiError}</p>}
              </div>
              <Button
                type="submit"
                variant="primary"
                className="rounded-full bg-brand-orange-hex px-6 text-primary-foreground hover:bg-brand-orange-hex/90"
                disabled={sending}
              >
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {sending ? "Joining..." : "Join"}
              </Button>
            </form>
          )}

          <p className="mt-4 text-sm text-white/60">
            No spam. Just belonging. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
