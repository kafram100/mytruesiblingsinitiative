"use client";

import { Heart, Shield } from "lucide-react";

export default function EmotionalTrustBanner() {
  return (
    <div className="bg-gradient-to-r from-brand-teal/5 via-brand-pink-hex/5 to-brand-orange-hex/5 border-b border-border/30">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col items-center justify-center gap-2 text-center text-xs text-gray-500 sm:flex-row sm:gap-4 sm:text-sm">
          <span className="flex items-center gap-1.5">
            <Heart className="h-3.5 w-3.5 text-brand-pink-hex" />
            MyTrueSiblings is a mission-driven nonprofit
          </span>
          <span className="hidden text-gray-300 sm:inline">·</span>
          <span className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-brand-teal" />
            Support is always free — purchases fund our mission
          </span>
          <span className="hidden text-gray-300 sm:inline">·</span>
          <span className="flex items-center gap-1.5">
            <Heart className="h-3.5 w-3.5 text-brand-orange-hex" />
            100% of proceeds fuel belonging programs
          </span>
        </div>
      </div>
    </div>
  );
}
