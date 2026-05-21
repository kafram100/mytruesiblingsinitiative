"use client";

import { useEffect, useState } from "react";
import { Users, Trash2, Loader2 } from "lucide-react";

import { ProfileRow } from "@/lib/auth";
import { formatDate } from "@/lib/admin-utils";
import { Button } from "@/components/ui/button";

function DeleteUserButton({ userId, userEmail }: { userId: string; userEmail: string }) {
  const [deleting, setDeleting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleDelete = async () => {
    if (!confirmed) {
      setConfirmed(true);
      setTimeout(() => setConfirmed(false), 3000);
      return;
    }
    setDeleting(true);
    try {
      await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      window.location.reload();
    } catch {
      setDeleting(false);
      setConfirmed(false);
    }
  };

  return (
    <Button
      type="button"
      variant="tertiary"
      size="sm"
      onClick={handleDelete}
      disabled={deleting}
      className={`rounded-lg text-xs shadow-none ${
        confirmed
          ? "bg-red-100 text-red-600 hover:bg-red-200"
          : "text-muted-foreground hover:bg-red-50 hover:text-red-600"
      }`}
      aria-label={`Delete ${userEmail}`}
    >
      {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : confirmed ? "Confirm?" : <Trash2 className="h-3.5 w-3.5" />}
    </Button>
  );
}

export default function UsersSection() {
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((data) => setProfiles(data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-purple-100 p-2 text-purple-600">
          <Users className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Users</h1>
          <p className="text-sm text-muted-foreground">Registered user profiles on the platform.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : profiles.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <Users className="mx-auto mb-3 h-8 w-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No users registered yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 font-semibold text-foreground">Name</th>
                  <th className="px-4 py-3 font-semibold text-foreground">Email</th>
                  <th className="px-4 py-3 font-semibold text-foreground">Role</th>
                  <th className="px-4 py-3 font-semibold text-foreground">Joined</th>
                  <th className="w-14 px-2 py-3" />
                </tr>
              </thead>
              <tbody>
                {profiles.map((p) => (
                  <tr key={p.id} className="border-b border-border/50 transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium text-foreground">{p.full_name || "\u2014"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.email || "\u2014"}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${p.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-muted text-muted-foreground"}`}>
                        {p.role}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{formatDate(p.created_at)}</td>
                    <td className="px-2 py-3">
                      {p.role !== "admin" && <DeleteUserButton userId={p.id} userEmail={p.email || ""} />}
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
