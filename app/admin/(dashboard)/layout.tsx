import { redirect } from "next/navigation";

import { getSessionUser } from "@/lib/auth";
import AdminDashboard from "@/components/admin/AdminDashboard";

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
      <AdminDashboard
        user={{
          email: user.email || "",
        }}
      >
        {children}
      </AdminDashboard>
    );
  } catch {
    redirect("/admin/login");
  }
}
