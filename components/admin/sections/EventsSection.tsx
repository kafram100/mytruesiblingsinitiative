"use client";

import { useState, useEffect, type FormEvent } from "react";
import { Loader2, Plus, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EventItem {
  id: string;
  title: string;
  description: string | null;
  date: string;
  time: string | null;
  location: string | null;
  image_url: string | null;
  registration_url: string | null;
  is_featured: number;
  created_at: string;
}

export default function EventsSection() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", date: "", time: "", location: "", registrationUrl: "", isFeatured: false });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const res = await fetch("/api/admin/events");
      if (res.ok) setEvents(await res.json());
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    setDeleting(id);
    await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
    setDeleting(null);
    load();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description || null,
          date: form.date,
          time: form.time || null,
          location: form.location || null,
          registrationUrl: form.registrationUrl || null,
          isFeatured: form.isFeatured,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create");
      } else {
        setShowForm(false);
        setForm({ title: "", description: "", date: "", time: "", location: "", registrationUrl: "", isFeatured: false });
        load();
      }
    } catch {
      setError("Network error");
    }
    setSaving(false);
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Events</h1>
          <p className="text-sm text-muted-foreground mt-1">{events.length} events</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="rounded-full">
          <Plus className="h-4 w-4 mr-1" /> {showForm ? "Cancel" : "Add Event"}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-5 space-y-4">
          {error && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}
          <div>
            <label className="block text-sm font-semibold mb-1">Title *</label>
            <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className="w-full rounded-xl border-2 border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={3} className="w-full rounded-xl border-2 border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none resize-none" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Date *</label>
              <input type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} className="w-full rounded-xl border-2 border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Time</label>
              <input type="time" value={form.time} onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))} className="w-full rounded-xl border-2 border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Location</label>
              <input value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} className="w-full rounded-xl border-2 border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none" placeholder="Online / City, Country" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Registration URL</label>
              <input value={form.registrationUrl} onChange={(e) => setForm((p) => ({ ...p, registrationUrl: e.target.value }))} className="w-full rounded-xl border-2 border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none" placeholder="https://..." />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm((p) => ({ ...p, isFeatured: e.target.checked }))} className="h-4 w-4 rounded border-border text-primary focus:ring-primary" />
            <span className="text-sm font-medium">Featured event</span>
          </label>
          <Button type="submit" disabled={saving} className="rounded-full">
            {saving ? <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Saving...</> : "Add Event"}
          </Button>
        </form>
      )}

      <div className="space-y-3">
        {events.map((e) => (
          <div key={e.id} className="rounded-2xl border border-border bg-card p-5 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{e.title}</h3>
                {e.is_featured ? <span className="inline-flex rounded-full bg-primary/10 text-primary text-xs px-2 py-0.5 font-medium">Featured</span> : null}
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-1.5">
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(e.date)}{e.time ? ` at ${e.time}` : ""}</span>
                {e.location && <><span>&middot;</span><span>{e.location}</span></>}
              </div>
              {e.description && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{e.description}</p>}
              {e.registration_url && (
                <a href={e.registration_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline mt-2 inline-block">Registration link &rarr;</a>
              )}
            </div>
            <Button size="sm" variant="ghost" onClick={() => handleDelete(e.id)} disabled={deleting === e.id} className="text-red-600 hover:bg-red-50 shrink-0">
              {deleting === e.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
            </Button>
          </div>
        ))}
        {events.length === 0 && (
          <div className="text-center py-12 text-muted-foreground"><Calendar className="h-8 w-8 mx-auto mb-2 opacity-40" />No events yet</div>
        )}
      </div>
    </div>
  );
}
