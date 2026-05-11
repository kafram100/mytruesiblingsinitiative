"use client";

import { useRef } from "react";

interface MarkReadOnOpenProps {
  id: string;
  read: boolean;
  children: React.ReactNode;
}

export default function MarkReadOnOpen({ id, read, children }: MarkReadOnOpenProps) {
  const marked = useRef(read);

  const handleToggle = async (e: React.SyntheticEvent<HTMLDetailsElement>) => {
    const details = e.currentTarget;
    if (details.open && !marked.current) {
      marked.current = true;
      try {
        await fetch(`/api/contacts/${id}/read`, { method: "PUT" });
      } catch {
        // silently fail
      }
    }
  };

  return (
    <details key={id} onToggle={handleToggle}>
      {children}
    </details>
  );
}
