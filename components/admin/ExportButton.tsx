"use client";

import { useRef, useState, useEffect } from "react";
import {
  Download,
  Loader2,
  Calendar,
  ChevronDown,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface ExportButtonProps {
  type: "contacts" | "donations";
  label?: string;
}

interface PeriodOption {
  value: string;
  label: string;
  description: string;
}

const periods: PeriodOption[] = [
  { value: "today", label: "Today", description: "Records created today" },
  { value: "this_week", label: "This Week", description: "Since Monday this week" },
  { value: "this_month", label: "This Month", description: "Since the 1st of this month" },
  { value: "this_year", label: "This Year", description: "Since January 1st" },
  { value: "all", label: "All Time", description: "Every record" },
];

export default function ExportButton({ type, label }: ExportButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleExport = async (period: string) => {
    setLoading(period);
    setOpen(false);
    try {
      const res = await fetch(`/api/admin/export?type=${type}&period=${period}`);
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${type}-export-${period}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      setLoading(null);
    }
  };

  const selectedLabel = periods.find((p) => p.value === loading);
  const buttonLabel = label || `Export ${type}`;

  return (
    <div ref={dropdownRef} className="relative">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setOpen(!open)}
            disabled={loading !== null}
            className="gap-2 rounded-xl px-4 py-2 shadow-sm"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {selectedLabel?.label}
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                {buttonLabel}
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Download {type} as CSV</TooltipContent>
      </Tooltip>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 animate-in fade-in-0 zoom-in-95">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
            <div className="border-b border-border px-4 py-2.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Select period
              </p>
            </div>
            <div className="p-1.5">
              {periods.map((p) => (
                <Button
                  key={p.value}
                  type="button"
                  variant="tertiary"
                  onClick={() => handleExport(p.value)}
                  disabled={loading !== null}
                  className="h-auto w-full justify-start gap-3 rounded-xl px-3 py-2.5 text-left font-normal shadow-none hover:bg-muted motion-safe:hover:translate-y-0"
                >
                  <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground">{p.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.description}
                    </p>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
