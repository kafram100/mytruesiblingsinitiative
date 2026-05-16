"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Eye, EyeOff, Loader2, Lock, ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentError, setCurrentError] = useState("");
  const [newError, setNewError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const validateRequired = (v: string) => v ? "" : "This field is required.";

  const validateNewPassword = (v: string) => {
    if (!v) return "New password is required.";
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

    const cErr = validateRequired(currentPassword);
    const nErr = validateNewPassword(newPassword);
    const cfErr = validateConfirm(confirmPassword, newPassword);
    setCurrentError(cErr);
    setNewError(nErr);
    setConfirmError(cfErr);
    if (cErr || nErr || cfErr) return;

    setLoading(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to change password");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Failed to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
              <ShieldAlert className="h-6 w-6 text-amber-600" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Change Your Password
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              You must change your password before continuing.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="current-password"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Current Password
              </label>
              <div className="relative">
                <input
                  id="current-password"
                  type={showCurrent ? "text" : "password"}
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(e) => { setCurrentPassword(e.target.value); if (currentError) setCurrentError(validateRequired(e.target.value)); }}
                  onBlur={(e) => setCurrentError(validateRequired(e.target.value))}
                  placeholder="Enter your current password"
                  className={`block w-full rounded-xl border px-4 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 bg-background ${
                    currentError ? "border-destructive/60 focus:border-destructive focus:ring-destructive/20" : "border-input focus:border-primary focus:ring-primary/20"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showCurrent ? "Hide password" : "Show password"}
                >
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {currentError && <p className="mt-1 text-xs text-destructive">{currentError}</p>}
            </div>

            <div>
              <label
                htmlFor="new-password"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showNew ? "text" : "password"}
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); if (newError) setNewError(validateNewPassword(e.target.value)); if (confirmPassword) setConfirmError(validateConfirm(confirmPassword, e.target.value)); }}
                  onBlur={(e) => { setNewError(validateNewPassword(e.target.value)); if (confirmPassword) setConfirmError(validateConfirm(confirmPassword, e.target.value)); }}
                  placeholder="At least 8 characters"
                  className={`block w-full rounded-xl border px-4 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 bg-background ${
                    newError ? "border-destructive/60 focus:border-destructive focus:ring-destructive/20" : "border-input focus:border-primary focus:ring-primary/20"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showNew ? "Hide password" : "Show password"}
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {newError && <p className="mt-1 text-xs text-destructive">{newError}</p>}
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Confirm New Password
              </label>
              <input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); if (confirmError) setConfirmError(validateConfirm(e.target.value, newPassword)); }}
                onBlur={(e) => setConfirmError(validateConfirm(e.target.value, newPassword))}
                placeholder="Reenter your new password"
                className={`block w-full rounded-xl border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 bg-background ${
                  confirmError ? "border-destructive/60 focus:border-destructive focus:ring-destructive/20" : "border-input focus:border-primary focus:ring-primary/20"
                }`}
              />
              {confirmError && <p className="mt-1 text-xs text-destructive">{confirmError}</p>}
            </div>

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
              {loading ? "Changing..." : "Change Password"}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-muted-foreground">
            <Link
              href="/admin/login"
              className="underline underline-offset-2 hover:text-primary"
            >
              &larr; Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
