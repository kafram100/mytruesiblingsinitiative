"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Heart, X } from "lucide-react";

import { Button } from "@/components/ui/button";

/** Bump when welcome copy/design changes so returning visitors see the new dialog once. */
const STORAGE_KEY = "mtsi-welcome-dismissed-v2";

/**
 * First visit to the site (any route): opens before first paint when possible.
 * Dismiss: primary button, ×, Escape, or backdrop. Persists via localStorage.
 */
export default function WelcomeModal() {
  const [open, setOpen] = useState(false);
  const primaryRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      /* private mode: still show dialog */
    }
    setOpen(true);
  }, []);

  const dismiss = useCallback(() => {
    setOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* quota / private mode */
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => primaryRef.current?.focus(), 80);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, dismiss]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999]" aria-busy={open}>
      <button
        type="button"
        aria-label="Close welcome message"
        className="absolute inset-0 bg-black/55 backdrop-blur-[10px]"
        onClick={dismiss}
      />
      <div className="relative z-[1] flex min-h-full items-center justify-center p-4 pointer-events-none">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="welcome-modal-title"
          aria-describedby="welcome-modal-desc"
          className="pointer-events-auto relative w-full max-w-md rounded-[1.75rem] border border-amber-100/90 bg-[linear-gradient(180deg,hsl(46_92%_95%)_0%,hsl(40_55%_99%)_45%,white_100%)] p-8 shadow-[0_24px_70px_-20px_rgba(15,23,42,0.35)] md:rounded-[2rem] md:p-10 md:shadow-[0_28px_80px_-22px_rgba(15,23,42,0.4)]"
        >
          <Button
            type="button"
            variant="tertiary"
            size="icon"
            onClick={dismiss}
            className="absolute right-4 top-4 text-zinc-600 shadow-none hover:bg-white/60 hover:text-zinc-900 hover:shadow-none motion-safe:hover:translate-y-0"
            aria-label="Close"
          >
            <X className="h-5 w-5" aria-hidden />
          </Button>

          <div className="flex flex-col items-center text-center">
            <div
              className="flex h-[4.25rem] w-[4.25rem] shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-brand-orange shadow-md"
              aria-hidden
            >
              <Heart className="h-[1.85rem] w-[1.85rem] fill-white text-white stroke-[1.5]" aria-hidden />
            </div>

            <p className="mt-7 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-primary md:text-[0.75rem]">
              ✨ A note from your siblings ✨
            </p>

            <h2
              id="welcome-modal-title"
              className="mt-4 font-display text-[1.85rem] font-bold leading-tight tracking-tight text-zinc-950 md:text-[2.35rem]"
            >
              You are enough.
            </h2>

            <p
              id="welcome-modal-desc"
              className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-zinc-600 md:text-base"
            >
              Exactly as you are, today. Your story is sacred and your heart is
              needed.
            </p>

            <Button
              ref={primaryRef}
              variant="primary"
              size="lg"
              type="button"
              onClick={dismiss}
              className="mt-8 h-auto min-h-[3.25rem] w-full gap-2 rounded-full px-6 py-3.5 text-base font-bold shadow-[0_12px_28px_-8px_hsl(175_70%_32%/0.55)] hover:shadow-xl"
            >
              <Heart className="h-4 w-4 shrink-0 fill-current" aria-hidden />
              Thank you, I&apos;m ready
            </Button>

            <p className="mt-8 font-display text-sm italic leading-relaxed text-zinc-600">
              &ldquo;Be the sibling someone never had.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
