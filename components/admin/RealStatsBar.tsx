"use client";

import { useEffect, useState } from "react";
import { Users, GraduationCap, HeartHandshake, Activity, BarChart3 } from "lucide-react";

interface Stats {
  totalSiblings: number;
  totalMentors: number;
  availableMentors: number;
  totalConnections: number;
  activeConnections: number;
  pendingConnections: number;
  totalMatchRequests: number;
  pendingMatchRequests: number;
  activeProducts: number;
  totalOrders: number;
}

export default function RealStatsBar() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => setStats(data))
      .catch(() => {});
  }, []);

  if (!stats) return null;

  const cards = [
    { label: "Siblings", value: stats.totalSiblings, icon: Users, color: "bg-blue-100 text-blue-700" },
    { label: "Mentors", value: stats.totalMentors, icon: GraduationCap, color: "bg-purple-100 text-purple-700" },
    { label: "Available Mentors", value: stats.availableMentors, icon: GraduationCap, color: "bg-teal-100 text-teal-700" },
    { label: "Active Connections", value: stats.activeConnections, icon: HeartHandshake, color: "bg-green-100 text-green-700" },
    { label: "Pending Requests", value: stats.pendingConnections + stats.pendingMatchRequests, icon: Activity, color: "bg-amber-100 text-amber-700" },
    { label: "Store Products", value: stats.activeProducts, icon: BarChart3, color: "bg-pink-100 text-pink-700" },
  ];

  return (
    <div className="mb-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Live Stats</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-xl border border-border bg-card p-3">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${card.color} mb-2`}>
                <Icon className="h-4 w-4" />
              </div>
              <p className="text-lg font-bold">{card.value}</p>
              <p className="text-[11px] text-muted-foreground">{card.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
