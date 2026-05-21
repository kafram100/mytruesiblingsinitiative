"use client";

import { useState, useRef, type FormEvent } from "react";
import { Save, Loader2, Camera, X, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileData {
  fullName: string;
  email: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  pronouns: string | null;
  locationCity: string | null;
  dateOfBirth: string | null;
}

interface Props {
  user: ProfileData;
}

export default function ProfileForm({ user }: Props) {
  const [fullName, setFullName] = useState(user.fullName);
  const [displayName, setDisplayName] = useState(user.displayName || "");
  const [bio, setBio] = useState(user.bio || "");
  const [pronouns, setPronouns] = useState(user.pronouns || "");
  const [locationCity, setLocationCity] = useState(user.locationCity || "");
  const [dateOfBirth, setDateOfBirth] = useState(user.dateOfBirth || "");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user.avatarUrl);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!fullName.trim() || fullName.length < 2) {
      setMessage({ type: "error", text: "Name must be at least 2 characters" });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          displayName: displayName.trim() || null,
          bio: bio.trim() || null,
          pronouns: pronouns.trim() || null,
          locationCity: locationCity.trim() || null,
          dateOfBirth: dateOfBirth || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: json.error || "Failed to save" });
      } else {
        setMessage({ type: "success", text: "Profile updated successfully!" });
      }
    } catch {
      setMessage({ type: "error", text: "Network error" });
    }
    setSaving(false);
  };

  const handleAvatarUpload = async (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: "error", text: "File too large (max 2MB)" });
      return;
    }
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setMessage({ type: "error", text: "Invalid file type. Use JPEG, PNG, WebP or GIF." });
      return;
    }

    setUploading(true);
    setMessage(null);
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await fetch("/api/account/avatar", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: json.error || "Upload failed" });
      } else {
        setAvatarUrl(json.avatar_url);
        setMessage({ type: "success", text: "Photo updated!" });
      }
    } catch {
      setMessage({ type: "error", text: "Network error during upload" });
    }
    setUploading(false);
  };

  const handleRemoveAvatar = async () => {
    setUploading(true);
    try {
      const res = await fetch("/api/account/avatar", { method: "DELETE" });
      if (res.ok) {
        setAvatarUrl(null);
        setMessage({ type: "success", text: "Photo removed" });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to remove photo" });
    }
    setUploading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar */}
      <div>
        <label className="block text-sm font-semibold mb-2">Profile Photo</label>
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-border bg-muted">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                <UserIcon className="h-8 w-8" />
              </div>
            )}
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/60">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <Camera className="h-4 w-4" />
              {avatarUrl ? "Change" : "Upload"}
            </Button>
            {avatarUrl && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemoveAvatar}
                disabled={uploading}
                className="text-red-600 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
                Remove
              </Button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleAvatarUpload(f);
            }}
          />
        </div>
      </div>

      {/* Full Name */}
      <div>
        <label htmlFor="profile-name" className="block text-sm font-semibold mb-1.5">
          Full Name
        </label>
        <input
          id="profile-name"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full rounded-xl border-2 border-border bg-card px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
        />
      </div>

      {/* Display Name */}
      <div>
        <label htmlFor="profile-display-name" className="block text-sm font-semibold mb-1.5">
          Display Name
        </label>
        <input
          id="profile-display-name"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="How others see you (optional)"
          className="w-full rounded-xl border-2 border-border bg-card px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
        />
        <p className="text-xs text-muted-foreground mt-1">
          A pseudonym or nickname. Leave blank to use your full name.
        </p>
      </div>

      {/* Bio */}
      <div>
        <label htmlFor="profile-bio" className="block text-sm font-semibold mb-1.5">
          About Me
        </label>
        <textarea
          id="profile-bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Share a little about yourself, your journey, and what you're looking for in a sibling..."
          rows={4}
          className="w-full resize-none rounded-xl border-2 border-border bg-card px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
        />
        <p className="text-xs text-muted-foreground mt-1">{bio.length}/1000</p>
      </div>

      {/* Pronouns + Location + DOB in a row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="profile-pronouns" className="block text-sm font-semibold mb-1.5">
            Pronouns
          </label>
          <input
            id="profile-pronouns"
            type="text"
            value={pronouns}
            onChange={(e) => setPronouns(e.target.value)}
            placeholder="e.g. she/her, he/him, they/them"
            className="w-full rounded-xl border-2 border-border bg-card px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="profile-location" className="block text-sm font-semibold mb-1.5">
            Location
          </label>
          <input
            id="profile-location"
            type="text"
            value={locationCity}
            onChange={(e) => setLocationCity(e.target.value)}
            placeholder="City, Country"
            className="w-full rounded-xl border-2 border-border bg-card px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="profile-dob" className="block text-sm font-semibold mb-1.5">
            Date of Birth
          </label>
          <input
            id="profile-dob"
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            className="w-full rounded-xl border-2 border-border bg-card px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Shows your age to potential siblings.
          </p>
        </div>
      </div>

      {/* Email (read-only) */}
      <div>
        <label className="block text-sm font-semibold mb-1.5">Email Address</label>
        <input
          type="email"
          value={user.email}
          disabled
          className="w-full rounded-xl border-2 border-border bg-muted px-4 py-2.5 text-sm text-muted-foreground cursor-not-allowed"
        />
        <p className="text-xs text-muted-foreground mt-1">Email cannot be changed.</p>
      </div>

      {message && (
        <div className={`p-3 rounded-xl text-sm ${
          message.type === "success"
            ? "bg-green-50 border border-green-200 text-green-700"
            : "bg-red-50 border border-red-200 text-red-700"
        }`}>
          {message.text}
        </div>
      )}

      <Button type="submit" disabled={saving} className="rounded-full">
        {saving ? (
          <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</>
        ) : (
          <><Save className="h-4 w-4 mr-2" /> Save Changes</>
        )}
      </Button>
    </form>
  );
}
