"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Loader2 } from "lucide-react";

import ContactsManager from "@/components/admin/ContactsManager";

interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  read: boolean;
}

export default function ContactsSection() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/contacts")
      .then((r) => r.json())
      .then((data) => setContacts(data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-orange-100 p-2 text-orange-600">
          <MessageSquare className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Contacts</h1>
          <p className="text-sm text-muted-foreground">Contact form submissions from the website.</p>
        </div>
      </div>
      <ContactsManager contacts={contacts} />
    </div>
  );
}
