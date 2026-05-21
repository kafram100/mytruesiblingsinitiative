"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, Loader2, Check, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RegisterForm() {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "success" | "error">("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    agreeToTerms: false,
  });

  const update = (fields: Partial<typeof form>) => setForm((p) => ({ ...p, ...fields }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.fullName.trim() || form.fullName.length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (!form.agreeToTerms) {
      setError("You must agree to the terms and privacy policy");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Registration failed");
        setLoading(false);
        return;
      }

      const loginRes = await fetch("/api/auth/sibling/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }),
      });

      if (loginRes.ok) {
        localStorage.setItem("guided_tour_enabled", "true");
      }

      router.push("/account");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  if (step === "success") {
    return (
      <div className="text-center py-12">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-6">
          <Check className="h-8 w-8" />
        </span>
        <h2 className="text-2xl font-display font-bold mb-3">Welcome to the family!</h2>
        <p className="text-muted-foreground mb-6">
          Your account has been created. You can now use the matching system and
          track your journey with us.
        </p>
        <div className="flex flex-col gap-3">
          <Button className="rounded-full" asChild>
            <Link href="/match">Find a sibling match</Link>
          </Button>
          <Button variant="outline" className="rounded-full" asChild>
            <Link href="/">Go to home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="fullName" className="block text-sm font-semibold mb-1.5">
          Full Name
        </label>
        <input
          id="fullName"
          type="text"
          value={form.fullName}
          onChange={(e) => update({ fullName: e.target.value })}
          placeholder="Enter your name"
          className="w-full rounded-xl border-2 border-border bg-card px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold mb-1.5">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => update({ email: e.target.value })}
          placeholder="you@example.com"
          className="w-full rounded-xl border-2 border-border bg-card px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-semibold mb-1.5">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={(e) => update({ password: e.target.value })}
            placeholder="At least 8 characters"
            className="w-full rounded-xl border-2 border-border bg-card px-4 py-2.5 pr-11 text-sm focus:border-primary focus:outline-none"
            required
            minLength={8}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={form.agreeToTerms}
          onChange={(e) => update({ agreeToTerms: e.target.checked })}
          className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
        />
        <span className="text-sm text-muted-foreground">
          I agree to the{" "}
          <Link href="/privacy" className="text-primary underline">Privacy Policy</Link>{" "}
          and{" "}
          <Link href="/safeguarding-policy" className="text-primary underline">Terms of Service</Link>.
          I understand this is a peer support community, not a crisis counseling service.
        </span>
      </label>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full rounded-full py-3"
      >
        {loading ? (
          <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creating account...</>
        ) : (
          <><Heart className="h-4 w-4 mr-2" fill="currentColor" /> Join My Siblings</>
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary underline">Sign in</Link>
      </p>
    </form>
  );
}
