import type { Metadata } from "next";
import { Users } from "lucide-react";

import db from "@/lib/db";
import { ProfileRow } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Users",
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function AdminUsersPage() {
  const [rows] = await db.execute(
    "SELECT * FROM profiles ORDER BY created_at DESC LIMIT 100"
  );
  const profiles = rows as ProfileRow[];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-purple-100 p-2 text-purple-600">
          <Users className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Users
          </h1>
          <p className="text-sm text-muted-foreground">
            Registered user profiles on the platform.
          </p>
        </div>
      </div>

      {profiles.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <Users className="mx-auto mb-3 h-8 w-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            No users registered yet.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 font-semibold text-foreground">
                    Name
                  </th>
                  <th className="px-4 py-3 font-semibold text-foreground">
                    Email
                  </th>
                  <th className="px-4 py-3 font-semibold text-foreground">
                    Role
                  </th>
                  <th className="px-4 py-3 font-semibold text-foreground">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((p: ProfileRow) => (
                  <tr
                    key={p.id}
                    className="border-b border-border/50 transition-colors hover:bg-muted/30"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {p.full_name || "\u2014"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {p.email || "\u2014"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          p.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {p.role}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                      {formatDate(p.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
