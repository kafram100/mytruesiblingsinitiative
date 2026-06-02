"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
}

interface ConversationData {
  id: string;
  other_user_name: string;
  other_user_avatar: string | null;
}

export default function ConversationPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<ConversationData | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const [msgRes, meRes] = await Promise.all([
        fetch(`/api/account/conversations/${conversationId}/messages`),
        fetch("/api/auth/sibling/me"),
      ]);
      if (msgRes.ok) {
        const data = await msgRes.json();
        setMessages(data.messages || []);
      }
      if (meRes.ok) {
        const me = await meRes.json();
        if (me?.id) setCurrentUserId(me.id);
      }
    } catch {}
  };

  useEffect(() => {
    if (!conversationId) return;
    Promise.all([
      fetch(`/api/account/conversations/${conversationId}/messages`),
      fetch("/api/account/conversations"),
      fetch("/api/auth/sibling/me"),
    ]).then(async ([msgRes, convRes, meRes]) => {
      if (msgRes.ok) {
        const data = await msgRes.json();
        setMessages(data.messages || []);
      }
      if (convRes.ok) {
        const data = await convRes.json();
        const conv = (data.conversations || []).find((c: ConversationData) => c.id === conversationId);
        setConversation(conv || null);
      }
      if (meRes.ok) {
        const me = await meRes.json();
        if (me?.id) setCurrentUserId(me.id);
      }
      setLoading(false);
    });
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Poll for new messages
  useEffect(() => {
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [conversationId]);

  const handleSend = async () => {
    if (!newMessage.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch(`/api/account/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newMessage.trim() }),
      });
      if (res.ok) {
        setNewMessage("");
        await fetchMessages();
      }
    } catch {}
    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 86400000) return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100dvh-7rem)] flex-col rounded-2xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <button
          onClick={() => router.push("/account/messages")}
          className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-muted"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-muted">
          {conversation?.other_user_avatar ? (
            <img src={conversation.other_user_avatar} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-sm font-bold text-muted-foreground">
              {conversation?.other_user_name?.charAt(0) || "?"}
            </span>
          )}
        </div>
        <p className="font-semibold text-sm">{conversation?.other_user_name || "Conversation"}</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-muted-foreground text-center">
              No messages yet. Say hello!
            </p>
          </div>
        )}
        {messages.map((msg) => {
          const isMe = msg.sender_id === currentUserId;
          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                  isMe
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-muted text-foreground rounded-bl-md"
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                <p className={`text-[10px] mt-1 ${isMe ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                  {formatTime(msg.created_at)}
                  {isMe && msg.read_at && " · Read"}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border p-4">
        <div className="flex gap-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            rows={1}
            className="flex-1 resize-none rounded-xl border-2 border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
          />
          <Button
            onClick={handleSend}
            disabled={!newMessage.trim() || sending}
            size="icon"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
