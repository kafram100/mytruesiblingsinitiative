"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function VerifyEmailPage() {
  const params = useParams<{ token: string }>();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!params?.token) return;

    fetch(`/api/auth/verify-email?token=${encodeURIComponent(params.token)}`)
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully");
        } else {
          setStatus("error");
          setMessage(data.error || "Verification failed");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Failed to connect. Please try again.");
      });
  }, [params]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-lg text-center">
        {status === "loading" && (
          <div className="flex flex-col items-center gap-4 py-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Verifying your email...</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-4 py-4">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            <p className="text-sm font-medium text-foreground">{message}</p>
            <Link
              href="/login"
              className="inline-flex items-center gap-1 text-sm text-primary underline underline-offset-2 hover:text-primary/80"
            >
              Sign in to your account
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-4 py-4">
            <XCircle className="h-10 w-10 text-destructive" />
            <p className="text-sm text-muted-foreground">{message}</p>
            <Link
              href="/login"
              className="inline-flex items-center gap-1 text-sm text-primary underline underline-offset-2 hover:text-primary/80"
            >
              Go to sign in
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
