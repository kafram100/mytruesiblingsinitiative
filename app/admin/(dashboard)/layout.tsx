import { redirect } from "next/navigation";

import { getSessionUser } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const user = await getSessionUser();

    if (!user || user.role !== "admin") {
      redirect("/admin/login");
    }

    return (
      <AdminShell
        user={{
          email: user.email || "",
        }}
      >
        {children}
      </AdminShell>
    );
  } catch {
    redirect("/admin/login");
  }
}
