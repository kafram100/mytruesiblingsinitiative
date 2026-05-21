"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MessageCircle, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Conversation {
  id: string;
  other_user_name: string;
  other_user_avatar: string | null;
  last_message: string | null;
  last_message_time: string | null;
  unread_count: number;
  last_message_at: string;
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/account/conversations")
      .then((r) => r.json())
      .then((data) => {
        setConversations(data.conversations || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 86400000) return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    if (diff < 604800000) return d.toLocaleDateString("en-US", { weekday: "short" });
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-display font-bold mb-1">Messages</h1>
      <p className="text-muted-foreground text-sm mb-8">
        Chat with your matched siblings.
      </p>

      {conversations.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border bg-card/50 p-12 text-center">
          <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground/40 mb-4" />
          <h2 className="text-xl font-display font-bold mb-2">No conversations yet</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
            Once you accept a match, you can start chatting with your sibling here.
          </p>
          <Button asChild className="rounded-full">
            <Link href="/account/matches">
              View Matches <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map((conv) => (
            <Link
              key={conv.id}
              href={`/account/messages/${conv.id}`}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-muted/50"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
                {conv.other_user_avatar ? (
                  <img src={conv.other_user_avatar} alt="" className="h-full w-full object-cover" />
                ) : (
                  <MessageCircle className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className={`font-semibold text-sm truncate ${conv.unread_count > 0 ? "text-foreground" : "text-muted-foreground"}`}>
                    {conv.other_user_name}
                  </p>
                  {conv.last_message_time && (
                    <p className="text-xs text-muted-foreground shrink-0">
                      {formatTime(conv.last_message_time)}
                    </p>
                  )}
                </div>
                <p className={`text-sm truncate mt-0.5 ${conv.unread_count > 0 ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                  {conv.last_message || "No messages yet"}
                </p>
              </div>
              {conv.unread_count > 0 && (
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground shrink-0">
                  {conv.unread_count > 9 ? "9+" : conv.unread_count}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
