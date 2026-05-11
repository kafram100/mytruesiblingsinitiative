"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, Trash2, Loader2 } from "lucide-react";

import MarkReadOnOpen from "@/components/admin/MarkReadOnOpen";
import ReplyDialog from "@/components/admin/ReplyDialog";

interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  read: boolean;
}

interface ContactsManagerProps {
  contacts: Contact[];
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ContactsManager({ contacts }: ContactsManagerProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const allSelected = contacts.length > 0 && selected.size === contacts.length;

  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(contacts.map((c) => c.id)));
    }
  };

  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelected(next);
  };

  const deleteSingle = async (id: string) => {
    setDeleting((prev) => new Set(prev).add(id));
    try {
      const res = await fetch(`/api/contacts/${id}`, { method: "DELETE" });
      if (!res.ok) return;
      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      router.refresh();
    } catch {
      setDeleting((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const deleteBulk = async () => {
    if (selected.size === 0) return;
    const ids = Array.from(selected);
    setBulkDeleting(true);
    try {
      const res = await fetch("/api/contacts/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      if (!res.ok) return;
      setSelected(new Set());
      router.refresh();
    } catch {
      // silently fail
    } finally {
      setBulkDeleting(false);
    }
  };

  if (contacts.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-12 text-center">
        <MessageSquare className="mx-auto mb-3 h-8 w-8 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">No contact submissions yet.</p>
      </div>
    );
  }

  const visibleContacts = contacts.filter((c) => !deleting.has(c.id));

  return (
    <div className="space-y-4">
      {selected.size > 0 && (
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-3 shadow-sm">
          <span className="text-sm text-muted-foreground">
            {selected.size} selected
          </span>
          <button
            type="button"
            onClick={deleteBulk}
            disabled={bulkDeleting}
            className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            {bulkDeleting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
            Delete Selected
          </button>
          <button
            type="button"
            onClick={() => setSelected(new Set())}
            className="ml-auto text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
          >
            Clear selection
          </button>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="w-10 px-2 py-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    aria-label="Select all"
                  />
                </th>
                <th className="px-4 py-3 font-semibold text-foreground">Name</th>
                <th className="px-4 py-3 font-semibold text-foreground">Email</th>
                <th className="px-4 py-3 font-semibold text-foreground">Subject</th>
                <th className="px-4 py-3 font-semibold text-foreground">Date</th>
                <th className="px-4 py-3 font-semibold text-foreground">Read</th>
                <th className="w-14 px-2 py-3" />
              </tr>
            </thead>
            <tbody>
              {visibleContacts.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-border/50 transition-colors hover:bg-muted/30"
                >
                  <td className="px-2 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(c.id)}
                      onChange={() => toggle(c.id)}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                      aria-label={`Select ${c.name}`}
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">
                    {c.name}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <a
                      href={`mailto:${c.email}`}
                      className="underline underline-offset-2 hover:text-primary"
                    >
                      {c.email}
                    </a>
                  </td>
                  <td className="max-w-[200px] truncate px-4 py-3 text-muted-foreground">
                    {c.subject}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                    {formatDate(c.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        c.read
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {c.read ? "Read" : "New"}
                    </span>
                  </td>
                  <td className="px-2 py-3">
                    <button
                      type="button"
                      onClick={() => deleteSingle(c.id)}
                      className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600"
                      aria-label={`Delete ${c.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Messages</h2>
        {visibleContacts.map((c) => (
          <MarkReadOnOpen key={c.id} id={c.id} read={c.read}>
            <details className="group rounded-2xl border border-border bg-card shadow-sm">
              <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-sm font-medium text-foreground transition-colors hover:bg-muted/30">
                <div className="flex items-center gap-3 truncate">
                  <input
                    type="checkbox"
                    checked={selected.has(c.id)}
                    onChange={() => toggle(c.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="h-4 w-4 shrink-0 rounded border-border text-primary focus:ring-primary"
                    aria-label={`Select ${c.name}`}
                  />
                  <span className="truncate">
                    {c.name} &middot; {c.subject}
                  </span>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatDate(c.created_at)}
                </span>
              </summary>
              <div className="border-t border-border px-5 py-4">
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                  {c.message}
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <ReplyDialog
                    contactId={c.id}
                    name={c.name}
                    email={c.email}
                    subject={c.subject}
                  />
                  <a
                    href={`mailto:${c.email}`}
                    className="text-xs text-muted-foreground underline underline-offset-2 hover:text-primary"
                  >
                    {c.email}
                  </a>
                  <button
                    type="button"
                    onClick={() => deleteSingle(c.id)}
                    className="ml-auto rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600"
                    aria-label={`Delete ${c.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </details>
          </MarkReadOnOpen>
        ))}
      </div>
    </div>
  );
}
