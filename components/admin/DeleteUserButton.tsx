"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

interface DeleteUserButtonProps {
  userId: string;
  userEmail: string;
}

export default function DeleteUserButton({ userId, userEmail }: DeleteUserButtonProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleDelete = async () => {
    if (!confirmed) {
      setConfirmed(true);
      setTimeout(() => setConfirmed(false), 3000);
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      }
    } catch {
      // silently fail
    } finally {
      setDeleting(false);
      setConfirmed(false);
    }
  };

  return (
    <Button
      type="button"
      variant="tertiary"
      size="sm"
      onClick={handleDelete}
      disabled={deleting}
      className={`rounded-lg text-xs shadow-none ${
        confirmed
          ? "bg-red-100 text-red-600 hover:bg-red-200"
          : "text-muted-foreground hover:bg-red-50 hover:text-red-600"
      }`}
      aria-label={`Delete ${userEmail}`}
    >
      {deleting ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : confirmed ? (
        "Confirm?"
      ) : (
        <Trash2 className="h-3.5 w-3.5" />
      )}
    </Button>
  );
}
