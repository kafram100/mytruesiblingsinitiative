"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Heart, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";

const STORAGE_KEY = "mtsi-welcome-dismissed-v3";

const firstTimeMessages = [
  { text: "Welcome to MyTrueSiblings.", emoji: "🫂", sub: "A safe space built for belonging." },
  { text: "You are not alone.", emoji: "💛", sub: "A whole community is here for you." },
  { text: "You belong here.", emoji: "🌟", sub: "Exactly as you are, right now." },
  { text: "Someone cares about you.", emoji: "💙", sub: "And always will." },
];

const returningMessages = [
  { text: "Welcome back, sibling.", emoji: "🤗", sub: "You were missed." },
  { text: "We are glad to see you again.", emoji: "✨", sub: "Your community is here." },
  { text: "Your community missed you.", emoji: "🫂", sub: "Hope you are doing well." },
  { text: "Welcome home.", emoji: "🏠", sub: "This is your safe space." },
];

const allMessages = [
  { text: "You belong here.", emoji: "💛", sub: "MyTrueSiblings" },
  { text: "You are never alone.", emoji: "🤗", sub: "We are all here for you." },
  { text: "One conversation can change a life.", emoji: "💬", sub: "Yours matters." },
  { text: "The world is gentler because of you.", emoji: "🌸", sub: "Never forget that." },
  { text: "Thank you for spreading hope.", emoji: "🕯️", sub: "It makes a difference." },
  { text: "Your kindness matters.", emoji: "💫", sub: "More than you know." },
  { text: "You are safe here.", emoji: "🛡️", sub: "Always." },
  { text: "Someone believes in you.", emoji: "💪", sub: "Keep going." },
  { text: "Together we heal.", emoji: "🩹", sub: "Connection changes lives." },
  { text: "You are part of this family.", emoji: "👨‍👩‍👧‍👦", sub: "And always will be." },
  { text: "Hope lives here.", emoji: "✨", sub: "Welcome." },
  { text: "You are seen, heard, and valued.", emoji: "💝", sub: "Never doubt your worth." },
  { text: "Take a deep breath.", emoji: "🌿", sub: "You are exactly where you need to be." },
  { text: "Your story matters.", emoji: "📖", sub: "And we are honored to be part of it." },
  { text: "You are enough.", emoji: "💖", sub: "Exactly as you are." },
];

export default function WelcomeModal() {
  const [open, setOpen] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [messageIndex, setMessageIndex] = useState(0);
  const [phase, setPhase] = useState<"initial" | "rotating" | "closed">("initial");
  const primaryRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "true") {
        setIsFirstVisit(false);
        return;
      }
    } catch { }
    setOpen(true);
    setIsFirstVisit(true);
  }, []);

  const dismiss = useCallback(() => {
    setPhase("closed");
    setOpen(false);
    try { localStorage.setItem(STORAGE_KEY, "true"); } catch { }
  }, []);

  const handleInitialDone = useCallback(() => {
    const idx = Math.floor(Math.random() * allMessages.length);
    setMessageIndex(idx);
    setPhase("rotating");
  }, []);

  useEffect(() => {
    if (phase !== "rotating") return;
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % allMessages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [phase]);

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

  const messages = isFirstVisit ? firstTimeMessages : returningMessages;
  const currentMsg = phase === "initial" ? messages[messageIndex] : allMessages[messageIndex];

  return (
    <div className="fixed inset-0 z-[9999]">
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[10px]" onClick={dismiss} />
      <div className="relative z-10 flex min-h-full items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="welcome-modal-title"
          className="relative w-full max-w-md rounded-[1.75rem] bg-gradient-to-br from-white via-brand-light to-white p-8 shadow-2xl md:rounded-[2rem] md:p-10"
          style={{ border: "1px solid rgba(0,159,175,0.15)" }}
        >
          <button
            type="button"
            onClick={dismiss}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          {phase === "initial" ? (
            <div className="flex flex-col items-center text-center">
              <div className="flex h-[4.25rem] w-[4.25rem] shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-teal to-brand-orange-hex shadow-md" aria-hidden>
                <Heart className="h-[1.85rem] w-[1.85rem] fill-white text-white stroke-[1.5]" aria-hidden />
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={messageIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="mt-6 text-center"
                >
                  <span className="text-4xl">{currentMsg?.emoji}</span>
                  <h2 id="welcome-modal-title" className="mt-4 font-display text-2xl font-bold leading-tight text-gray-900">
                    {currentMsg?.text}
                  </h2>
                  <p className="mt-2 text-sm text-gray-500">{currentMsg?.sub}</p>
                </motion.div>
              </AnimatePresence>
              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-brand-teal">
                MyTrueSiblings
              </p>
              <Button
                ref={primaryRef}
                variant="primary"
                size="lg"
                type="button"
                onClick={handleInitialDone}
                className="mt-8 h-auto min-h-[3.25rem] w-full gap-2 rounded-full bg-brand-teal px-6 py-3.5 text-base font-bold text-white shadow-xl shadow-brand-teal/30 hover:bg-brand-teal/90 hover:shadow-xl"
              >
                <Heart className="h-4 w-4 shrink-0 fill-current" aria-hidden />
                {isFirstVisit ? "I'm ready" : "I'm home"}
              </Button>
              {isFirstVisit && (
                <p className="mt-8 font-display text-sm italic leading-relaxed text-zinc-600">
                  &ldquo;Be the sibling someone never had.&rdquo;
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={messageIndex}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center"
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-teal/10 via-brand-pink-hex/10 to-brand-yellow-hex/10">
                    <span className="text-4xl">{currentMsg?.emoji}</span>
                  </div>
                  <h2 className="mt-5 font-display text-xl font-bold text-gray-900">
                    {currentMsg?.text}
                  </h2>
                  <p className="mt-2 text-sm text-gray-500">{currentMsg?.sub}</p>
                </motion.div>
              </AnimatePresence>
              <Button
                variant="primary"
                size="lg"
                type="button"
                onClick={dismiss}
                className="mt-8 h-auto min-h-[3.25rem] w-full gap-2 rounded-full bg-gradient-to-r from-brand-teal to-brand-pink-hex px-6 py-3.5 text-base font-bold text-white shadow-xl hover:shadow-2xl"
              >
                <Heart className="h-4 w-4 shrink-0 fill-current" aria-hidden />
                Enter MyTrueSiblings
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
