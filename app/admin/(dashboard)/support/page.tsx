"use client";

import { useState, useEffect } from "react";
import { LifeBuoy, Loader2, Search, MessageCircle, Check, X, Clock, User, ShieldCheck, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SupportRequest, SupportReply } from "@/lib/support-types";

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

export default function AdminSupportPage() {
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(null);
  const [replies, setReplies] = useState<SupportReply[]>([]);
  const [replyMessage, setReplyMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const loadRequests = async () => {
    try {
      const res = await fetch("/api/admin/support");
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests || []);
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => { loadRequests(); }, []);

  const loadRequestDetail = async (req: SupportRequest) => {
    setSelectedRequest(req);
    setReplies([]);
    setReplyMessage("");
    try {
      const res = await fetch(`/api/admin/support/${req.id}`);
      if (res.ok) {
        const data = await res.json();
        setReplies(data.replies || []);
      }
    } catch {}
  };

  const handleStatusChange = async (id: string, status: string) => {
    await fetch(`/api/admin/support/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    loadRequests();
    if (selectedRequest?.id === id) {
      setSelectedRequest((prev) => prev ? { ...prev, status } : null);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedRequest) return;
    setSending(true);
    await fetch(`/api/admin/support/${selectedRequest.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: replyMessage.trim() }),
    });
    setReplyMessage("");
    setSending(false);
    loadRequests();
    loadRequestDetail(selectedRequest);
  };

  const filtered = requests.filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return r.subject.toLowerCase().includes(q) || (r.user_name || "").toLowerCase().includes(q);
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <LifeBuoy className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Support Requests</h1>
          <p className="text-sm text-muted-foreground">Review and respond to support requests from siblings.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        {["all", "pending", "in_review", "resolved", "closed"].map((filter) => (
          <button
            key={filter}
            onClick={() => setStatusFilter(filter)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              statusFilter === filter
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {filter === "all" ? "All" : STATUS_BADGES[filter]?.label || filter}
          </button>
        ))}
        <div className="relative ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="rounded-full border border-border bg-card pl-9 pr-4 py-1.5 text-sm focus:border-primary focus:outline-none w-48"
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-2 max-h-[70vh] overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No support requests found.</p>
          ) : (
            filtered.map((req) => {
              const badge = STATUS_BADGES[req.status] || STATUS_BADGES.pending;
              const isSelected = selectedRequest?.id === req.id;
              return (
                <button
                  key={req.id}
                  onClick={() => loadRequestDetail(req)}
                  className={`w-full text-left rounded-2xl border p-4 transition-colors ${
                    isSelected ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${badge.class}`}>
                      {badge.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{TYPE_LABELS[req.type] || req.type}</span>
                  </div>
                  <p className="font-medium text-sm truncate">{req.subject}</p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {req.user_name} &middot; {new Date(req.created_at).toLocaleDateString()}
                  </p>
                  {req.reply_count && req.reply_count > 0 && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <MessageCircle className="h-3 w-3" /> {req.reply_count} replies
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card min-h-[400px]">
          {selectedRequest ? (
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS_BADGES[selectedRequest.status]?.class}`}>
                    {STATUS_BADGES[selectedRequest.status]?.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {TYPE_LABELS[selectedRequest.type] || selectedRequest.type}
                  </span>
                </div>
                <h3 className="font-semibold">{selectedRequest.subject}</h3>
                <p className="text-xs text-muted-foreground">
                  From: {selectedRequest.user_name} ({selectedRequest.user_email})
                </p>
                <p className="text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 inline mr-1" />
                  {new Date(selectedRequest.created_at).toLocaleString()}
                </p>
              </div>

              <div className="p-4 border-b border-border">
                <p className="text-sm whitespace-pre-wrap text-muted-foreground bg-muted rounded-xl p-3">
                  {selectedRequest.description}
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[300px]">
                {replies.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No replies yet.</p>
                )}
                {replies.map((reply) => {
                  const isAdmin = reply.user_role === "admin";
                  return (
                    <div key={reply.id} className={`rounded-xl border p-3 ${isAdmin ? "border-primary/20 bg-primary/5 ml-4" : "border-border bg-card mr-4"}`}>
                      <div className="flex items-center gap-1.5 mb-1">
                        {isAdmin ? <ShieldCheck className="h-3 w-3 text-primary" /> : <User className="h-3 w-3 text-muted-foreground" />}
                        <span className="text-xs font-medium">{isAdmin ? "You" : reply.user_name || "User"}</span>
                        <span className="text-[10px] text-muted-foreground ml-auto">
                          {new Date(reply.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{reply.message}</p>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 border-t border-border">
                {selectedRequest.status !== "closed" ? (
                  <form onSubmit={handleReply} className="space-y-2">
                    <textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      rows={2}
                      className="w-full rounded-xl border-2 border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none resize-none"
                      placeholder="Type your reply..."
                    />
                    <div className="flex gap-2">
                      <Button type="submit" disabled={sending || !replyMessage.trim()} size="sm" className="rounded-full">
                        {sending ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Send className="h-3 w-3 mr-1" />}
                        Reply
                      </Button>
                      {selectedRequest.status === "pending" && (
                        <Button type="button" size="sm" variant="outline" onClick={() => handleStatusChange(selectedRequest.id, "in_review")} className="rounded-full">
                          Mark In Review
                        </Button>
                      )}
                      {selectedRequest.status !== "resolved" && selectedRequest.status !== "closed" && (
                        <Button type="button" size="sm" variant="outline" onClick={() => handleStatusChange(selectedRequest.id, "resolved")} className="rounded-full text-green-600">
                          <Check className="h-3 w-3 mr-1" /> Resolve
                        </Button>
                      )}
                      {selectedRequest.status !== "closed" && (
                        <Button type="button" size="sm" variant="ghost" onClick={() => handleStatusChange(selectedRequest.id, "closed")} className="rounded-full text-gray-500">
                          <X className="h-3 w-3 mr-1" /> Close
                        </Button>
                      )}
                    </div>
                  </form>
                ) : (
                  <p className="text-sm text-muted-foreground text-center">This request is closed.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm py-20">
              Select a request to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
