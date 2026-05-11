import type { Metadata } from "next";
import { MessageSquare } from "lucide-react";

import db from "@/lib/db";
import { ContactRow, ContactRowWithBool } from "@/lib/auth";
import ContactsManager from "@/components/admin/ContactsManager";

export const metadata: Metadata = {
  title: "Contacts",
};

export default async function AdminContactsPage() {
  const [rows] = await db.execute(
    "SELECT * FROM contacts ORDER BY created_at DESC LIMIT 100"
  );
  const contacts: ContactRowWithBool[] = (rows as ContactRow[]).map((c) => ({
    ...c,
    read: c.read === 1,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-orange-100 p-2 text-orange-600">
          <MessageSquare className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Contacts
          </h1>
          <p className="text-sm text-muted-foreground">
            Contact form submissions from the website.
          </p>
        </div>
      </div>

      <ContactsManager contacts={contacts} />
    </div>
  );
}
