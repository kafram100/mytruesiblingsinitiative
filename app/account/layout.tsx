import { redirect } from "next/navigation";
import { getSiblingSession } from "@/lib/sibling-auth";
import AccountShell from "./AccountShell";

export const dynamic = "force-dynamic";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user;
  try {
    user = await getSiblingSession();
  } catch {
    redirect("/login");
  }

  if (!user) {
    redirect("/login");
  }

  return <AccountShell user={user} isPendingMentor={!!user.isPendingMentor}>{children}</AccountShell>;
}
