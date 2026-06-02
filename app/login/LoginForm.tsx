"use client";

import { useState, type FormEvent, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Heart, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (searchParams.get("registered") === "mentor") {
      setSuccess("Your mentor account has been created and is pending admin approval. You'll be notified once approved.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/sibling/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Login failed");
        setLoading(false);
        return;
      }
      router.push("/account");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="email" className="block text-sm font-semibold mb-1.5">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full rounded-xl border-2 border-border bg-card px-4 py-2.5 pr-11 text-sm focus:border-primary focus:outline-none"
            required
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

      <div className="text-right text-xs">
        <Link href="/forgot-password" className="text-primary underline hover:text-primary/80">
          Forgot password?
        </Link>
      </div>

      {success && (
        <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
          {success}
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <Button type="submit" disabled={loading} className="w-full rounded-full py-3">
        {loading ? (
          <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Signing in...</>
        ) : (
          <><Heart className="h-4 w-4 mr-2" fill="currentColor" /> Sign In</>
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-primary underline">Create one</Link>
      </p>
    </form>
  );
}
