"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { ArrowLeft, Eye, EyeOff, Loader2, Lock, CheckCircle2, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

function ResetForm() {
  const searchParams = useSearchParams();
  const [session, setSession] = useState<string | null>(null);

  useEffect(() => {
    const s = searchParams.get("session");
    setSession(s);
    if (s && typeof window !== "undefined") {
      window.history.replaceState(null, "", "/admin/reset-password");
    }
  }, [searchParams]);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const validatePassword = (v: string) => {
    if (!v) return "Password is required.";
    if (v.length < 8) return "Password must be at least 8 characters.";
    return "";
  };

  const validateConfirm = (v: string, pw: string) => {
    if (!v) return "Please confirm your password.";
    if (v !== pw) return "Passwords do not match.";
    return "";
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!session) {
      setError("Missing reset session. Use the link from your email.");
      return;
    }

    const pErr = validatePassword(password);
    const cErr = validateConfirm(confirmPassword, password);
    setPasswordError(pErr);
    setConfirmError(cErr);
    if (pErr || cErr) return;

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to reset password");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Failed to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!session && !success) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <p className="text-sm text-muted-foreground">
          Invalid reset link. Use the link from your email.
        </p>
        <Button variant="secondary" asChild>
          <Link href="/admin/forgot-password">
            Request a new link
          </Link>
        </Button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <CheckCircle2 className="h-10 w-10 text-emerald-500" />
        <p className="text-sm font-medium text-foreground">
          Password reset successfully!
        </p>
        <Button variant="primary" asChild>
          <Link href="/admin/login">
            <ArrowLeft className="h-4 w-4" />
            Sign in
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-sm font-medium text-foreground"
        >
          New Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); if (passwordError) setPasswordError(validatePassword(e.target.value)); if (confirmPassword) setConfirmError(validateConfirm(confirmPassword, e.target.value)); }}
            onBlur={(e) => { setPasswordError(validatePassword(e.target.value)); if (confirmPassword) setConfirmError(validateConfirm(confirmPassword, e.target.value)); }}
            placeholder="At least 8 characters"
            className={`block w-full rounded-xl border px-4 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 bg-background ${
              passwordError ? "border-destructive/60 focus:border-destructive focus:ring-destructive/20" : "border-input focus:border-primary focus:ring-primary/20"
            }`}
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

      <div>
        <label
          htmlFor="confirm-password"
          className="mb-1.5 block text-sm font-medium text-foreground"
        >
          Confirm Password
        </label>
        <input
          id="confirm-password"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => { setConfirmPassword(e.target.value); if (confirmError) setConfirmError(validateConfirm(e.target.value, password)); }}
          onBlur={(e) => setConfirmError(validateConfirm(e.target.value, password))}
          placeholder="Reenter your new password"
          className={`block w-full rounded-xl border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 bg-background ${
            confirmError ? "border-destructive/60 focus:border-destructive focus:ring-destructive/20" : "border-input focus:border-primary focus:ring-primary/20"
          }`}
        />
        {confirmError && <p className="mt-1 text-xs text-destructive">{confirmError}</p>}
      </div>

      {passwordError && <p className="mt-1 text-xs text-destructive">{passwordError}</p>}

      {error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        disabled={loading}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {loading ? "Resetting..." : "Reset Password"}
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Reset Password
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter your new password
            </p>
          </div>

          <Suspense fallback={null}>
            <ResetForm />
          </Suspense>

          <div className="mt-6 text-center text-xs text-muted-foreground">
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1 underline underline-offset-2 hover:text-primary"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
