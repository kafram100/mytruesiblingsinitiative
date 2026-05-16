"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  CreditCard,
  Eye,
  EyeOff,
  Key,
  Mail,
  Settings2,
  Server,
  Webhook,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SettingsFormProps {
  initial: Record<string, string>;
}

export default function SettingsForm({ initial }: SettingsFormProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [form, setForm] = useState({
    notification_email: initial.notification_email || "",
    smtp_host: initial.smtp_host || "",
    smtp_port: initial.smtp_port || "587",
    smtp_user: initial.smtp_user || "",
    smtp_pass: initial.smtp_pass || "",
    smtp_from: initial.smtp_from || "",
    stripe_publishable_key: initial.stripe_publishable_key || "",
    stripe_secret_key: initial.stripe_secret_key || "",
    stripe_webhook_secret: initial.stripe_webhook_secret || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (key: string, value: string): string => {
    if (key === "notification_email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email.";
    if (key === "smtp_from" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email.";
    if (key === "smtp_port" && value && !/^\d+$/.test(value)) return "Port must be a number.";
    return "";
  };

  const handleFieldChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      const err = validateField(key, value);
      setErrors((prev) => ({ ...prev, [key]: err }));
    }
  };

  const handleFieldBlur = (key: string, value: string) => {
    const err = validateField(key, value);
    setErrors((prev) => ({ ...prev, [key]: err }));
  };

  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [showWebhookSecret, setShowWebhookSecret] = useState(false);
  const [testResult, setTestResult] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Settings saved successfully." });
      } else {
        setMessage({ type: "error", text: "Failed to save settings." });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to save settings." });
    } finally {
      setSaving(false);
    }
  };

  const handleTestEmail = async () => {
    const to = form.notification_email;
    if (!to) {
      setTestResult({
        type: "error",
        text: "Enter a notification email first.",
      });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "test-email", to }),
      });
      const data = await res.json();

      if (data.success) {
        setTestResult({
          type: "success",
          text: "Test email sent successfully!",
        });
      } else {
        setTestResult({
          type: "error",
          text: data.error || "Failed to send test email.",
        });
      }
    } catch {
      setTestResult({
        type: "error",
        text: "Failed to send test email.",
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-xl bg-orange-100 p-2 text-orange-600">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Email Notifications
            </h2>
            <p className="text-sm text-muted-foreground">
              Where to send contact form submissions.
            </p>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Notification Email
          </label>
          <input
            type="email"
            value={form.notification_email}
            onChange={(e) => handleFieldChange("notification_email", e.target.value)}
            onBlur={(e) => handleFieldBlur("notification_email", e.target.value)}
            placeholder="admin@example.com"
            className={`block w-full rounded-xl border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 ${
              errors.notification_email ? "border-destructive/60 focus:border-destructive focus:ring-destructive/20" : "border-input focus:border-primary focus:ring-primary/20"
            }`}
          />
          {errors.notification_email && <p className="mt-1 text-xs text-destructive">{errors.notification_email}</p>}
          <p className="mt-1 text-xs text-muted-foreground">
            New contact form submissions will be emailed here.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-xl bg-blue-100 p-2 text-blue-600">
            <Server className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              SMTP Settings
            </h2>
            <p className="text-sm text-muted-foreground">
              Configure your email server to send notifications.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              SMTP Host
            </label>
            <input
              type="text"
              value={form.smtp_host}
              onChange={(e) => handleFieldChange("smtp_host", e.target.value)}
              onBlur={(e) => handleFieldBlur("smtp_host", e.target.value)}
              placeholder="smtp.gmail.com"
              className="block w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              SMTP Port
            </label>
            <input
              type="text"
              value={form.smtp_port}
              onChange={(e) => handleFieldChange("smtp_port", e.target.value)}
              onBlur={(e) => handleFieldBlur("smtp_port", e.target.value)}
              placeholder="587"
              className={`block w-full rounded-xl border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 ${
                errors.smtp_port ? "border-destructive/60 focus:border-destructive focus:ring-destructive/20" : "border-input focus:border-primary focus:ring-primary/20"
              }`}
            />
            {errors.smtp_port && <p className="mt-1 text-xs text-destructive">{errors.smtp_port}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              SMTP User
            </label>
            <input
              type="text"
              value={form.smtp_user}
              onChange={(e) => handleFieldChange("smtp_user", e.target.value)}
              onBlur={(e) => handleFieldBlur("smtp_user", e.target.value)}
              placeholder="your@email.com"
              className="block w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              SMTP Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={form.smtp_pass}
                onChange={(e) => handleFieldChange("smtp_pass", e.target.value)}
                onBlur={(e) => handleFieldBlur("smtp_pass", e.target.value)}
                placeholder="App password"
                className="block w-full rounded-xl border border-input bg-background px-4 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <Button
                type="button"
                variant="tertiary"
                size="icon"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 text-muted-foreground shadow-none hover:bg-muted/50 hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              From Address
            </label>
            <input
              type="email"
              value={form.smtp_from}
              onChange={(e) => handleFieldChange("smtp_from", e.target.value)}
              onBlur={(e) => handleFieldBlur("smtp_from", e.target.value)}
              placeholder="noreply@yourdomain.com"
              className={`block w-full rounded-xl border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 ${
                errors.smtp_from ? "border-destructive/60 focus:border-destructive focus:ring-destructive/20" : "border-input focus:border-primary focus:ring-primary/20"
              }`}
            />
            {errors.smtp_from && <p className="mt-1 text-xs text-destructive">{errors.smtp_from}</p>}
            <p className="mt-1 text-xs text-muted-foreground">
              Optional. Defaults to SMTP user if left empty.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-xl bg-purple-100 p-2 text-purple-600">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Payment Gateway
            </h2>
            <p className="text-sm text-muted-foreground">
              Configure Stripe to accept donations globally.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-foreground">
              <Key className="h-4 w-4 text-muted-foreground" />
              Stripe Publishable Key
            </label>
            <input
              type="text"
              value={form.stripe_publishable_key}
              onChange={(e) => handleFieldChange("stripe_publishable_key", e.target.value)}
              onBlur={(e) => handleFieldBlur("stripe_publishable_key", e.target.value)}
              placeholder="pk_live_..."
              className="block w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-foreground">
              <Key className="h-4 w-4 text-muted-foreground" />
              Stripe Secret Key
            </label>
            <div className="relative">
              <input
                type={showSecretKey ? "text" : "password"}
                value={form.stripe_secret_key}
                onChange={(e) => handleFieldChange("stripe_secret_key", e.target.value)}
                onBlur={(e) => handleFieldBlur("stripe_secret_key", e.target.value)}
                placeholder="sk_live_..."
                className="block w-full rounded-xl border border-input bg-background px-4 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <Button
                type="button"
                variant="tertiary"
                size="icon"
                onClick={() => setShowSecretKey(!showSecretKey)}
                className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 text-muted-foreground shadow-none hover:bg-muted/50 hover:text-foreground"
                aria-label={showSecretKey ? "Hide secret key" : "Show secret key"}
                tabIndex={-1}
              >
                {showSecretKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-foreground">
              <Webhook className="h-4 w-4 text-muted-foreground" />
              Stripe Webhook Secret
            </label>
            <div className="relative">
              <input
                type={showWebhookSecret ? "text" : "password"}
                value={form.stripe_webhook_secret}
                onChange={(e) => handleFieldChange("stripe_webhook_secret", e.target.value)}
                onBlur={(e) => handleFieldBlur("stripe_webhook_secret", e.target.value)}
                placeholder="whsec_..."
                className="block w-full rounded-xl border border-input bg-background px-4 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <Button
                type="button"
                variant="tertiary"
                size="icon"
                onClick={() => setShowWebhookSecret(!showWebhookSecret)}
                className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 text-muted-foreground shadow-none hover:bg-muted/50 hover:text-foreground"
                aria-label={showWebhookSecret ? "Hide webhook secret" : "Show webhook secret"}
                tabIndex={-1}
              >
                {showWebhookSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-border/50 bg-muted/30 p-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Server className="h-4 w-4 text-muted-foreground" />
                Webhook Endpoint URL
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-default text-xs text-muted-foreground">
                    {mounted
                      ? `${window.location.origin}/api/stripe/webhook`
                      : "..."}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  Add this URL in your Stripe dashboard → Developers → Webhooks
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Get these keys from{" "}
            <a
              href="https://dashboard.stripe.com/apikeys"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-primary"
            >
              Stripe Dashboard → API Keys
            </a>
            . Add the webhook endpoint URL above in{" "}
            <a
              href="https://dashboard.stripe.com/webhooks"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-primary"
            >
              Stripe Dashboard → Webhooks
            </a>
            . The donate page at{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              /save-a-sibling
            </code>{" "}
            uses Stripe Checkout for payments.
          </p>
        </div>
      </section>

      {message && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            message.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-destructive/20 bg-destructive/5 text-destructive"
          }`}
        >
          {message.type === "success" ? (
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              {message.text}
            </span>
          ) : (
            message.text
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" variant="primary" disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {saving ? "Saving..." : "Save Settings"}
        </Button>

        <Button
          type="button"
          variant="secondary"
          disabled={testing}
          onClick={handleTestEmail}
        >
          {testing && <Loader2 className="h-4 w-4 animate-spin" />}
          {testing ? "Sending..." : "Send Test Email"}
        </Button>
      </div>

      {testResult && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            testResult.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-destructive/20 bg-destructive/5 text-destructive"
          }`}
        >
          {testResult.type === "success" ? (
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              {testResult.text}
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              {testResult.text}
            </span>
          )}
        </div>
      )}
    </form>
  );
}
