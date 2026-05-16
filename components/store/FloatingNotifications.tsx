"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const messages = [
  { text: "You belong here.", emoji: "💛" },
  { text: "One conversation can change a life.", emoji: "💬" },
  { text: "Connection heals.", emoji: "🩹" },
  { text: "Someone cares about you.", emoji: "💙" },
  { text: "You are never alone.", emoji: "🤗" },
  { text: "Your story matters.", emoji: "📖" },
  { text: "Hope lives here.", emoji: "✨" },
  { text: "You are seen, heard, and valued.", emoji: "💫" },
  { text: "Belonging is your birthright.", emoji: "🌟" },
  { text: "We rise together.", emoji: "🌅" },
];

export default function FloatingNotifications() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % messages.length);
        setVisible(true);
      }, 600);
    }, 5000);
    return () => clearInterval(interval);
  }, [dismissed]);

  if (dismissed) return null;

  const msg = messages[current];

  return (
    <div className="fixed bottom-6 left-6 z-50 max-w-[280px]">
      <AnimatePresence mode="wait">
        {visible && (
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative rounded-2xl bg-white/95 p-4 shadow-2xl shadow-brand-teal/10 backdrop-blur-md"
          >
            <button
              onClick={() => setDismissed(true)}
              aria-label="Dismiss notification"
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-gray-500 transition-colors hover:bg-gray-300"
            >
              <X className="h-3 w-3" />
            </button>
            <div className="flex items-start gap-3">
              <span className="text-xl">{msg.emoji}</span>
              <div>
                <p className="text-sm font-medium text-gray-800">{msg.text}</p>
                <p className="mt-0.5 text-xs text-gray-400">
                  MyTrueSiblings
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
