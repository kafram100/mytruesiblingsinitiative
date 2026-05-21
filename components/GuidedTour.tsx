"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, User, Search, MessageCircle, Bell, History, CheckCircle, ArrowRight, ArrowLeft, X, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    icon: Sparkles,
    title: "Welcome to My True Siblings!",
    description:
      "You're now part of a global family. Let us show you around so you can find your sibling and start building meaningful connections.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: User,
    title: "Complete Your Profile",
    description:
      "Add a photo, write a short bio, and set a display name. A complete profile helps siblings get to know the real you and makes matches more meaningful.",
    action: "Go to My Profile",
    href: "/account/profile",
    detail: "You can also add your pronouns and location so others know who you are.",
  },
  {
    icon: Heart,
    title: "Tell Us What You're Looking For",
    description:
      "Fill out the match form at /match — choose your pillar (Sibling Connect, Adult Safe Place, or Inclusive Hub), your support type, and your interests.",
    action: "Go to Match Form",
    href: "/match",
    detail: "The more details you share, the better our algorithm can find your ideal sibling.",
  },
  {
    icon: Search,
    title: "Find Your Matches",
    description:
      "Once your match request is submitted, click 'Find Matches' on your Matches page. Our algorithm scores compatible siblings based on age, language, interests, and more.",
    action: "Go to My Matches",
    href: "/account/matches",
    detail: "Matches with a score of 30% or higher are presented to you. You can accept or decline each one.",
  },
  {
    icon: MessageCircle,
    title: "Chat With Your Sibling",
    description:
      "When you accept a match, a conversation is automatically created. You can message each other in real-time from the Messages page.",
    action: "Go to Messages",
    href: "/account/messages",
    detail: "Messages are private between you and your matched sibling. Unread messages show a badge on the sidebar.",
  },
  {
    icon: Bell,
    title: "Stay Updated",
    description:
      "The notification bell in the header keeps you informed about new matches, messages, and community updates. Never miss a connection.",
    action: "Go to Notifications",
    href: "/account/notifications",
    detail: "You can mark notifications as read or clear all at once. You'll also receive email alerts when someone accepts your match.",
  },
  {
    icon: History,
    title: "Track Your Journey",
    description:
      "The Activity page shows your complete history — when you submitted a match request, accepted a sibling, or updated your profile.",
    action: "Go to Activity",
    href: "/account/activity",
    detail: "This helps you look back on your journey and see how far you've come.",
  },
  {
    icon: CheckCircle,
    title: "You're All Set!",
    description:
      "You now know everything you need to find your sibling. Remember: every connection starts with a single step. Your sibling is out there waiting for you.",
    final: true,
  },
];

export default function GuidedTour() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Only show when explicitly enabled by a registration or first-login flow
    const enabled = localStorage.getItem("guided_tour_enabled");
    if (enabled !== "true") {
      setDismissed(true);
      return;
    }

    // Check if already completed
    const tourDone = localStorage.getItem("guided_tour_done");
    if (tourDone === "true") {
      setDismissed(true);
      return;
    }

    // Verify user is logged in
    fetch("/api/auth/sibling/me")
      .then((r) => {
        if (!r.ok) throw new Error("not logged in");
        return r.json();
      })
      .then(() => {
        setTimeout(() => setOpen(true), 800);
      })
      .catch(() => {
        // Not logged in, clear the flag
        localStorage.removeItem("guided_tour_enabled");
        setDismissed(true);
      });
  }, []);

  const handleClose = () => {
    setOpen(false);
    setDismissed(true);
    localStorage.setItem("guided_tour_done", "true");
    // Notify server
    fetch("/api/account/onboarding", { method: "POST" }).catch(() => {});
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleAction = (href?: string) => {
    if (href) {
      localStorage.setItem("guided_tour_done", "true");
      setOpen(false);
      router.push(href);
    } else {
      handleClose();
    }
  };

  if (dismissed || !open) return null;

  const current = STEPS[step];
  const isFirst = step === 0;
  const isLast = step === STEPS.length - 1;
  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="tour-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <motion.div
        key="tour-modal"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="fixed inset-0 z-[101] flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto w-full max-w-lg rounded-3xl border border-border bg-card shadow-2xl">
          {/* Progress bar */}
          <div className="h-1.5 w-full overflow-hidden rounded-t-3xl bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="p-6 md:p-8">
            {/* Step indicator */}
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Step {step + 1} of {STEPS.length}
              </span>
              <button
                onClick={handleClose}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted transition-colors"
                aria-label="Close tour"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Icon */}
            <div
              className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl ${current.color}`}
            >
              <current.icon className="h-8 w-8" />
            </div>

            {/* Content */}
            <div className="text-center">
              <h2 className="font-display text-xl font-bold mb-2">
                {current.title}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                {current.description}
              </p>
              {"detail" in current && current.detail && (
                <p className="text-xs text-muted-foreground/70 italic">
                  💡 {current.detail}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center justify-between gap-2">
              <div>
                {!isFirst && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBack}
                    className="rounded-full"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                )}
              </div>

              <div className="flex gap-2">
                {"action" in current && current.action ? (
                  <Button
                    size="sm"
                    className="rounded-full"
                    onClick={() => handleAction(current.href)}
                  >
                    {current.action} <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                ) : isLast ? (
                  <Button
                    size="sm"
                    className="rounded-full"
                    onClick={handleClose}
                  >
                    <Sparkles className="h-4 w-4 mr-1" />
                    Start My Journey!
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="rounded-full"
                    onClick={handleNext}
                  >
                    Next <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                )}

                {!isLast && !("action" in current) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                    className="rounded-full text-muted-foreground"
                  >
                    Skip
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
