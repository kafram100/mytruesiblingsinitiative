"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, User, ArrowRight, Check, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    icon: User,
    title: "Complete Your Profile",
    description: "Add a display name, bio, and photo so other siblings can get to know you.",
    action: "Go to Profile",
    href: "/account/profile",
  },
  {
    icon: Heart,
    title: "Find Your Sibling",
    description: "Tell us what you're looking for and we'll match you with a compatible sibling.",
    action: "Start Matching",
    href: "/match",
  },
];

export default function OnboardingWizard() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch("/api/auth/sibling/me")
      .then((r) => {
        if (!r.ok) throw new Error("not logged in");
        return fetch("/api/account/onboarding").then((r2) => r2.json());
      })
      .then((data) => {
        if (!data.onboardingComplete && !dismissed) {
          setOpen(true);
          setCompleted(data.completedSteps || []);
          if (data.completedSteps?.includes("profile") && !data.completedSteps?.includes("match")) {
            setCurrentStep(1);
          }
        }
      })
      .catch(() => {});
  }, [dismissed]);

  const handleDismiss = () => {
    setOpen(false);
    setDismissed(true);
  };

  const handleComplete = async () => {
    try {
      await fetch("/api/account/onboarding", { method: "POST" });
    } catch {}
    setOpen(false);
  };

  if (!open) return null;

  const step = STEPS[currentStep];
  const isLastStep = currentStep === STEPS.length - 1;
  const stepCompleted = completed.includes(currentStep === 0 ? "profile" : "match");

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] rounded-3xl border border-border bg-card shadow-2xl"
      >
        <div className="p-5">
          {/* Progress */}
          <div className="flex items-center gap-2 mb-4">
            {STEPS.map((s, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i <= currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>

          {/* Step content */}
          <div className="flex items-start gap-3 mb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              {stepCompleted ? (
                <Check className="h-5 w-5 text-green-500" />
              ) : (
                <step.icon className="h-5 w-5" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-base">{step.title}</h3>
                {stepCompleted && (
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                    Done
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {step.description}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="rounded-full"
              onClick={() => {
                setOpen(false);
                router.push(step.href);
              }}
            >
              {step.action} <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
            {isLastStep ? (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleComplete}
                className="rounded-full"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                Done
              </Button>
            ) : (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="rounded-full"
              >
                Skip
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDismiss}
              className="rounded-full ml-auto text-muted-foreground"
            >
              Dismiss
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
