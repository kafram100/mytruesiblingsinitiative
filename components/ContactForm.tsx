"use client";

import { useId, useState } from "react";
import { CheckCircle2, Heart, Loader2, Send } from "lucide-react";

import { Button } from "@/components/ui/button";

type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const LETTERS_ONLY = /^[A-Za-z\s]*$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateField(name: keyof FormData, value: string): string | undefined {
  switch (name) {
    case "name":
      if (!value.trim()) return "Name is required";
      if (!LETTERS_ONLY.test(value)) return "Name can only contain letters";
      return undefined;
    case "email":
      if (!value.trim()) return "Email is required";
      if (!EMAIL_REGEX.test(value)) return "Enter a valid email address";
      return undefined;
    case "subject":
      if (!value.trim()) return "Subject is required";
      if (!LETTERS_ONLY.test(value)) return "Subject can only contain letters";
      if (value.trim().length < 3) return "Subject must be at least 3 characters";
      return undefined;
    case "message":
      if (!value.trim()) return "Message is required";
      if (value.trim().length < 10) return "Message must be at least 10 characters";
      return undefined;
  }
}

export default function ContactForm() {
  const formId = useId();
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    const key = name as keyof FormData;

    if ((key === "name" || key === "subject") && value !== "" && !LETTERS_ONLY.test(value)) return;

    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: validateField(key, value) }));
  };

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};
    for (const key of Object.keys(form) as (keyof FormData)[]) {
      const err = validateField(key, form[key]);
      if (err) nextErrors[key] = err;
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send message");
      }
      setSubmitted(true);
    } catch (err) {
      setErrors({ message: err instanceof Error ? err.message : "Something went wrong" });
    } finally {
      setSending(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-[2rem] border border-border/80 bg-card p-8 text-center shadow-sm">
        <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-green-50 text-green-600 shadow-inner">
          <CheckCircle2 className="h-8 w-8" aria-hidden />
        </span>
        <h3 className="font-display text-2xl font-bold text-foreground">
          Message sent!
        </h3>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Thank you for reaching out. We&apos;ll review your message and respond
          within two working days.
        </p>
        <p className="mt-6 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Heart className="h-3.5 w-3.5 fill-current" aria-hidden />
          You are not alone.
        </p>
        <div className="mt-8">
          <Button
            variant="secondary"
            className="rounded-full"
            onClick={() => {
              setSubmitted(false);
              setForm({ name: "", email: "", subject: "", message: "" });
            }}
          >
            Send another message
          </Button>
        </div>
      </div>
    );
  }

  const inputBase =
    "w-full rounded-2xl border border-border bg-background px-4 py-3.5 text-base text-foreground outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-muted-foreground/80 focus:border-primary/45 focus:ring-4 focus:ring-primary/10";
  const errorClass = "border-brand-red/60 focus:border-brand-red/60 focus:ring-brand-red/15";

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor={`${formId}-name`} className="sr-only">
            Your name
          </label>
          <input
            id={`${formId}-name`}
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            className={`${inputBase} ${errors.name ? errorClass : ""}`}
            placeholder="Your Name"
          />
          {errors.name && (
            <p className="mt-1.5 text-xs text-brand-red">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor={`${formId}-email`} className="sr-only">
            Email address
          </label>
          <input
            id={`${formId}-email`}
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className={`${inputBase} ${errors.email ? errorClass : ""}`}
            placeholder="Email Address"
          />
          {errors.email && (
            <p className="mt-1.5 text-xs text-brand-red">{errors.email}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor={`${formId}-subject`} className="sr-only">
          Subject
        </label>
        <input
          id={`${formId}-subject`}
          name="subject"
          type="text"
          value={form.subject}
          onChange={handleChange}
          className={`${inputBase} ${errors.subject ? errorClass : ""}`}
          placeholder="Subject"
        />
        {errors.subject && (
          <p className="mt-1.5 text-xs text-brand-red">{errors.subject}</p>
        )}
      </div>

      <div>
        <label htmlFor={`${formId}-message`} className="sr-only">
          Your message
        </label>
        <textarea
          id={`${formId}-message`}
          name="message"
          rows={6}
          value={form.message}
          onChange={handleChange}
          className={`${inputBase} min-h-[9rem] resize-y py-4 ${errors.message ? errorClass : ""}`}
          placeholder="Your Message"
        />
        {errors.message && (
          <p className="mt-1.5 text-xs text-brand-red">{errors.message}</p>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full rounded-2xl px-6 py-3.5 shadow-lg shadow-primary/15 sm:w-auto"
        disabled={sending}
      >
        {sending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Sending...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" aria-hidden />
            Send Message
          </>
        )}
      </Button>
    </form>
  );
}
