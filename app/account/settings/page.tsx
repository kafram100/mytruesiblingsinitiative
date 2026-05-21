"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2, Eye, EyeOff, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Account deletion state
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!currentPassword || !newPassword) {
      setMessage({ type: "error", text: "All fields are required" });
      return;
    }
    if (newPassword.length < 8) {
      setMessage({ type: "error", text: "New password must be at least 8 characters" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/account/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const json = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: json.error || "Failed to change password" });
      } else {
        setMessage({ type: "success", text: "Password changed successfully!" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setMessage({ type: "error", text: "Network error" });
    }
    setSaving(false);
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setMessage({ type: "error", text: "Please enter your password to confirm deletion" });
      return;
    }
    if (!confirm("This action is permanent and cannot be undone. All your data will be deleted. Continue?")) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch("/api/account/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: deletePassword }),
      });
      const json = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: json.error || "Failed to delete account" });
        setDeleting(false);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setMessage({ type: "error", text: "Network error" });
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-display font-bold mb-1">Settings</h1>
      <p className="text-muted-foreground text-sm mb-8">
        Manage your account security and preferences.
      </p>

      {message && (
        <div className={`mb-6 p-3 rounded-xl text-sm ${
          message.type === "success"
            ? "bg-green-50 border border-green-200 text-green-700"
            : "bg-red-50 border border-red-200 text-red-700"
        }`}>
          {message.text}
        </div>
      )}

      {/* Change Password */}
      <div className="rounded-2xl border border-border bg-card p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display font-bold">Change Password</h2>
            <p className="text-xs text-muted-foreground">Update your account password.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="current-pw" className="block text-sm font-semibold mb-1.5">
              Current Password
            </label>
            <div className="relative">
              <input
                id="current-pw"
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-xl border-2 border-border bg-background px-4 py-2.5 pr-11 text-sm focus:border-primary focus:outline-none"
              />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-label={showCurrent ? "Hide" : "Show"}>
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="new-pw" className="block text-sm font-semibold mb-1.5">
              New Password
            </label>
            <div className="relative">
              <input
                id="new-pw"
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-xl border-2 border-border bg-background px-4 py-2.5 pr-11 text-sm focus:border-primary focus:outline-none"
              />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-label={showNew ? "Hide" : "Show"}>
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirm-pw" className="block text-sm font-semibold mb-1.5">
              Confirm New Password
            </label>
            <input
              id="confirm-pw"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl border-2 border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
            />
          </div>

          <Button type="submit" disabled={saving} className="rounded-full">
            {saving ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Updating...</>
            ) : (
              <><Lock className="h-4 w-4 mr-2" /> Change Password</>
            )}
          </Button>
        </form>
      </div>

      {/* Delete Account */}
      <div className="rounded-2xl border border-red-200 bg-red-50/50 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display font-bold text-red-600">Danger Zone</h2>
            <p className="text-xs text-red-600/70">Irreversible action. Proceed with caution.</p>
          </div>
        </div>

        {!showDeleteConfirm ? (
          <Button
            variant="ghost"
            onClick={() => setShowDeleteConfirm(true)}
            className="rounded-full border border-red-200 text-red-600 hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete My Account
          </Button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-red-600 font-medium">
              This will permanently delete your account and all associated data including messages, matches, and preferences. This cannot be undone.
            </p>
            <input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="Enter your password to confirm"
              className="w-full rounded-xl border-2 border-red-200 bg-background px-4 py-2.5 text-sm focus:border-red-500 focus:outline-none"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleDeleteAccount}
                disabled={deleting || !deletePassword}
                className="rounded-full bg-red-600 text-white hover:bg-red-700"
              >
                {deleting ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Deleting...</>
                ) : (
                  <><Trash2 className="h-4 w-4 mr-2" /> Permanently Delete</>
                )}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeletePassword("");
                }}
                disabled={deleting}
                className="rounded-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
