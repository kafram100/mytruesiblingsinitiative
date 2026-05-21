"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check, ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { INTERESTS } from "@/lib/matching";

const EXPERTISE_OPTIONS: string[] = [
  ...INTERESTS,
  "Trauma-Informed Care",
  "Grief & Loss",
  "Family Reconciliation",
  "Life Coaching",
  "Career Guidance",
  "Academic Support",
];

export default function MentorProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    expertiseAreas: [] as string[],
    experienceYears: "",
    mentorshipBio: "",
    certification: "",
    maxMentees: "5",
    isAvailable: true,
    occupation: "",
    organization: "",
  });

  useEffect(() => {
    fetch("/api/mentors/dashboard")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.mentorProfile) {
          const mp = data.mentorProfile;
          setForm({
            expertiseAreas: mp.expertiseAreas || [],
            experienceYears: String(mp.experienceYears || 0),
            mentorshipBio: mp.mentorshipBio || "",
            certification: mp.certification || "",
            maxMentees: String(mp.maxMentees || 5),
            isAvailable: mp.isAvailable,
            occupation: mp.occupation || "",
            organization: mp.organization || "",
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const toggleExpertise = (area: string) => {
    setForm((prev) => ({
      ...prev,
      expertiseAreas: prev.expertiseAreas.includes(area)
        ? prev.expertiseAreas.filter((a) => a !== area)
        : [...prev.expertiseAreas, area],
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/mentors/dashboard", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expertiseAreas: form.expertiseAreas,
          experienceYears: parseInt(form.experienceYears) || 0,
          mentorshipBio: form.mentorshipBio || null,
          certification: form.certification || null,
          maxMentees: parseInt(form.maxMentees) || 5,
          isAvailable: form.isAvailable,
          occupation: form.occupation || null,
          organization: form.organization || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save");
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch {
      setError("Network error");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <Button variant="ghost" onClick={() => router.back()} className="rounded-full mb-4">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back
      </Button>

      <h1 className="text-2xl font-display font-bold mb-1">Mentor Profile</h1>
      <p className="text-muted-foreground text-sm mb-8">
        Update your mentorship details. These are shown to siblings looking for guidance.
      </p>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
      )}

      {success && (
        <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2">
          <Check className="h-4 w-4" /> Profile saved successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-1.5">Occupation *</label>
          <input
            type="text"
            value={form.occupation}
            onChange={(e) => setForm((prev) => ({ ...prev, occupation: e.target.value }))}
            className="w-full rounded-xl border-2 border-border bg-card px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
            placeholder="e.g. Social Worker, Therapist, Teacher"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5">Organization (optional)</label>
          <input
            type="text"
            value={form.organization}
            onChange={(e) => setForm((prev) => ({ ...prev, organization: e.target.value }))}
            className="w-full rounded-xl border-2 border-border bg-card px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
            placeholder="e.g. Nonprofit name, School, Agency"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5">Years of Experience *</label>
          <input
            type="number" min="0" max="70"
            value={form.experienceYears}
            onChange={(e) => setForm((prev) => ({ ...prev, experienceYears: e.target.value }))}
            className="w-full rounded-xl border-2 border-border bg-card px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5">Areas of Expertise *</label>
          <div className="flex flex-wrap gap-2">
            {EXPERTISE_OPTIONS.map((area) => (
              <button
                key={area} type="button"
                onClick={() => toggleExpertise(area)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all ${
                  form.expertiseAreas.includes(area)
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                {area}
                {form.expertiseAreas.includes(area) && <Check className="h-3 w-3 inline ml-1" />}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5">Mentorship Bio</label>
          <textarea
            value={form.mentorshipBio}
            onChange={(e) => setForm((prev) => ({ ...prev, mentorshipBio: e.target.value }))}
            rows={4}
            className="w-full rounded-xl border-2 border-border bg-card px-4 py-2.5 text-sm focus:border-primary focus:outline-none resize-none"
            placeholder="Share your story and what you can offer as a mentor..."
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5">Certification (optional)</label>
          <input
            type="text"
            value={form.certification}
            onChange={(e) => setForm((prev) => ({ ...prev, certification: e.target.value }))}
            className="w-full rounded-xl border-2 border-border bg-card px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
            placeholder="e.g. Certified Life Coach, Trauma-Informed Specialist"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5">Maximum Mentees</label>
          <input
            type="number" min="1" max="50"
            value={form.maxMentees}
            onChange={(e) => setForm((prev) => ({ ...prev, maxMentees: e.target.value }))}
            className="w-full rounded-xl border-2 border-border bg-card px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={form.isAvailable}
              onChange={(e) => setForm((prev) => ({ ...prev, isAvailable: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-border rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:start-[3px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
          </label>
          <span className="text-sm font-medium">Available for new mentees</span>
        </div>

        <Button type="submit" disabled={saving} className="rounded-full">
          {saving ? <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Saving...</> : <><Save className="h-4 w-4 mr-1" /> Save Changes</>}
        </Button>
      </form>
    </div>
  );
}
