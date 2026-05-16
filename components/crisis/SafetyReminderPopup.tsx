"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, X } from "lucide-react";

import { cn } from "@/lib/utils";

const STORAGE_KEY = "mtsi-safety-reminder-shown";

export default function SafetyReminderPopup() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return;
    } catch {}

    const timer = setTimeout(() => {
      setVisible(true);
    }, 8000 + Math.random() * 4000);

    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setVisible(false);
    setDismissed(true);
    try {
      sessionStorage.setItem(STORAGE_KEY, "true");
    } catch {}
  };

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={dismiss}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 260 }}
            className="relative z-10 w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl md:p-8"
          >
            <button
              onClick={dismiss}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-red-hex/10">
                <Shield className="h-7 w-7 text-brand-red-hex" />
              </div>
              <h2 className="mt-4 font-display text-xl font-bold text-gray-900">
                Your Safety Matters
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                If you or someone you know feels unsafe or in crisis, help is
                available now. Quick exit is available on the Crisis Support page.
              </p>
              <div className="mt-6 flex w-full flex-col gap-3">
                <Link
                  href="/crisis"
                  onClick={dismiss}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-red-hex px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-brand-red-hex/90"
                >
                  <Shield className="h-4 w-4" />
                  Go to Crisis Support
                </Link>
                <button
                  onClick={dismiss}
                  className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-700"
                >
                  I&apos;m okay
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
