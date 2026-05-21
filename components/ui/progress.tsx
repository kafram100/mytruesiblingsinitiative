"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  className?: string;
}

function Progress({ value, className }: ProgressProps) {
  return (
    <div
      className={cn("h-2 w-full overflow-hidden rounded-full bg-muted", className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-[#009FAF] to-[#E93D8F] transition-all duration-700 ease-out"
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  );
}

export { Progress };
