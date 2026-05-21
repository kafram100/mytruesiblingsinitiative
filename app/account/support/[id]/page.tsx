"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Clock, Send, User, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SupportRequest, SupportReply } from "@/lib/support";

const STATUS_BADGES: Record<string, { label: string; class: string }> = {
  pending: { label: "Pending", class: "bg-amber-100 text-amber-700" },
  in_review: { label: "In Review", class: "bg-blue-100 text-blue-700" },
  resolved: { label: "Resolved", class: "bg-green-100 text-green-700" },
  closed: { label: "Closed", class: "bg-gray-100 text-gray-500" },
};

const TYPE_LABELS: Record<string, string> = {
  financial_assistance: "Financial Assistance",
  general_support: "General Support",
  other: "Other",
};

export default function SupportRequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [request, setRequest] = useState<SupportRequest | null>(null);
  const [replies, setReplies] = useState<SupportReply[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch(`/api/support/requests/${params.id}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data) {
          setRequest(data.request);
          setReplies(data.replies || []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  const handleReply = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSending(true);
    try {
      const res = await fetch(`/api/support/requests/${params.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.trim() }),
      });
      if (res.ok) {
        setMessage("");
        const data = await fetch(`/api/support/requests/${params.id}`).then((r) => r.json());
        setReplies(data?.replies || []);
      }
    } catch {}
    setSending(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Request not found.</p>
        <Button variant="ghost" onClick={() => router.push("/account/support")} className="rounded-full mt-2">
          Back to Support
        </Button>
      </div>
    );
  }

  const badge = STATUS_BADGES[request.status] || STATUS_BADGES.pending;
  const isClosed = request.status === "resolved" || request.status === "closed";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => router.push("/account/support")} className="rounded-full">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Support
      </Button>

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.class}`}>
            {badge.label}
          </span>
          <span className="text-xs text-muted-foreground">
            {TYPE_LABELS[request.type] || request.type}
          </span>
        </div>
        <h1 className="text-xl font-display font-bold mb-2">{request.subject}</h1>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{request.description}</p>
        <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {new Date(request.created_at).toLocaleDateString("en-US", {
            month: "long", day: "numeric", year: "numeric",
          })}
        </div>
      </div>

      {replies.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-display font-bold">Conversation</h2>
          {replies.map((reply) => {
            const isAdmin = reply.user_role === "admin";
            return (
              <div
                key={reply.id}
                className={`rounded-2xl border p-4 ${isAdmin ? "border-primary/20 bg-primary/5" : "border-border bg-card"}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`flex h-7 w-7 items-center justify-center rounded-full ${isAdmin ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {isAdmin ? <ShieldCheck className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                  </span>
                  <span className="text-sm font-medium">{isAdmin ? "Admin" : "You"}</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {new Date(reply.created_at).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{reply.message}</p>
              </div>
            );
          })}
        </div>
      )}

      {!isClosed && (
        <form onSubmit={handleReply} className="rounded-2xl border border-border bg-card p-4">
          <label className="block text-sm font-semibold mb-2">Add a Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="w-full rounded-xl border-2 border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none resize-none"
            placeholder="Type your message..."
          />
          <div className="flex justify-end mt-3">
            <Button type="submit" disabled={sending || !message.trim()} className="rounded-full">
              {sending ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-1" />
              )}
              Send
            </Button>
          </div>
        </form>
      )}

      {isClosed && (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-center text-sm text-muted-foreground">
          This request has been {request.status}. No further messages can be sent.
        </div>
      )}
    </div>
  );
}
