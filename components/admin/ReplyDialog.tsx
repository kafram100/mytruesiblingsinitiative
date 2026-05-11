"use client";

import { useState, useRef, useEffect } from "react";
import { Reply, X, Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface ReplyDialogProps {
  contactId: string;
  name: string;
  email: string;
  subject: string;
}

type Status = "idle" | "sending" | "success" | "error";

export default function ReplyDialog({ contactId, name, email, subject }: ReplyDialogProps) {
  const [open, setOpen] = useState(false);
  const [replySubject, setReplySubject] = useState(`Re: ${subject}`);
  const [replyMessage, setReplyMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleEscape = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && status !== "sending") {
      setOpen(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replySubject.trim() || !replyMessage.trim()) return;

    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch(`/api/contacts/${contactId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: replySubject.trim(), message: replyMessage.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send reply");
      }

      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "Something went wrong");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setStatus("idle");
    setErrorMsg("");
    setReplyMessage("");
    setReplySubject(`Re: ${subject}`);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <Reply className="h-3.5 w-3.5" />
        Reply
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onKeyDown={handleEscape}
        >
          <div
            className="absolute inset-0 bg-black/55 backdrop-blur-[10px]"
            onClick={() => { if (status !== "sending") handleClose(); }}
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reply-dialog-title"
            className="relative z-10 mx-4 w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-lg"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 id="reply-dialog-title" className="text-lg font-semibold text-foreground">
                Reply to {name}
              </h2>
              <button
                type="button"
                onClick={handleClose}
                disabled={status === "sending"}
                className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mb-4 text-xs text-muted-foreground">
              Reply will be sent to <span className="font-medium text-foreground">{email}</span>
            </p>

            {status === "success" ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <CheckCircle className="h-10 w-10 text-emerald-500" />
                <p className="text-sm font-medium text-foreground">Reply sent successfully!</p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="reply-subject" className="mb-1.5 block text-xs font-medium text-foreground">
                    Subject
                  </label>
                  <input
                    id="reply-subject"
                    type="text"
                    value={replySubject}
                    onChange={(e) => setReplySubject(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="reply-message" className="mb-1.5 block text-xs font-medium text-foreground">
                    Message
                  </label>
                  <textarea
                    ref={textareaRef}
                    id="reply-message"
                    rows={6}
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your reply..."
                    className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>

                {status === "error" && (
                  <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-600">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {errorMsg}
                  </div>
                )}

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={status === "sending"}
                    className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={status === "sending" || !replySubject.trim() || !replyMessage.trim()}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                  >
                    {status === "sending" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Reply
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
