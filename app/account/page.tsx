import { redirect } from "next/navigation";
import { getSiblingSession } from "@/lib/sibling-auth";
import db from "@/lib/db";
import Link from "next/link";
import { Heart, Calendar, MessageCircle, Bell, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AccountOverview() {
  const user = await getSiblingSession();
  if (!user) return null;
  if (user.role === "sibling_coach") redirect("/account/mentor");

  let matchRequests: { id: string; pillar: string; status: string; created_at: string }[] = [];
  let unreadCount = 0;
  let notificationCount = 0;
  let activityCount = 0;
  let incomingMatches: { id: string; other_user_name: string }[] = [];
  let outgoingMatchCount = 0;

  try {
    const [reqRows] = await db.execute(
      "SELECT id, pillar, status, created_at FROM match_requests WHERE user_id = ? ORDER BY created_at DESC LIMIT 5",
      [user.id]
    );
    matchRequests = reqRows as typeof matchRequests;

    const [notifRows] = await db.execute(
      "SELECT COUNT(*) as c FROM notifications WHERE user_id = ? AND read_at IS NULL",
      [user.id]
    );
    notificationCount = Number((notifRows as { c: number }[])[0]?.c || 0);

    const [msgRows] = await db.execute(
      `SELECT COUNT(*) as c FROM messages m
       JOIN conversations c ON c.id = m.conversation_id
       WHERE (c.user1_id = ? OR c.user2_id = ?) AND m.sender_id != ? AND m.read_at IS NULL`,
      [user.id, user.id, user.id]
    );
    unreadCount = Number((msgRows as { c: number }[])[0]?.c || 0);

    const [actRows] = await db.execute(
      "SELECT COUNT(*) as c FROM user_activity WHERE user_id = ?",
      [user.id]
    );
    activityCount = Number((actRows as { c: number }[])[0]?.c || 0);

    const [incomingRows] = await db.execute(
      `SELECT m.id, p.full_name as other_user_name
       FROM matches m
       JOIN match_requests mr ON mr.id = m.request_id
       JOIN profiles p ON p.id = mr.user_id
       WHERE m.matched_user_id = ? AND m.status = 'pending'
       LIMIT 5`,
      [user.id]
    );
    incomingMatches = incomingRows as typeof incomingMatches;

    const [outgoingRows] = await db.execute(
      `SELECT COUNT(*) as c FROM matches m
       JOIN match_requests mr ON mr.id = m.request_id
       WHERE mr.user_id = ? AND m.status = 'pending'`,
      [user.id]
    );
    outgoingMatchCount = Number((outgoingRows as { c: number }[])[0]?.c || 0);
  } catch {}

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const displayName = (user.display_name || user.full_name).split(" ")[0];

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-amber-100 text-amber-700",
      matched: "bg-green-100 text-green-700",
      completed: "bg-blue-100 text-blue-700",
      cancelled: "bg-gray-100 text-gray-500",
    };
    return (
      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-600"}`}>
        {status}
      </span>
    );
  };

  const onboardingComplete = matchRequests.length > 0 && (user.bio || user.display_name);
  const pendingMatches = matchRequests.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-8">
      {/* Welcome + Onboarding prompt */}
      <div>
        <h1 className="text-2xl font-display font-bold">
          Welcome back{displayName ? `, ${displayName}` : ""} {!onboardingComplete && <Sparkles className="h-5 w-5 inline text-brand-yellow" />}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Here&apos;s what&apos;s happening with your account.
        </p>
      </div>

      {!onboardingComplete && (
        <div className="rounded-2xl border border-brand-yellow/30 bg-gradient-to-br from-brand-yellow/5 to-brand-orange/5 p-5">
          <div className="flex items-start gap-3">
            <Sparkles className="h-6 w-6 text-brand-yellow shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h2 className="font-display font-bold text-base">Complete your setup</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Add a profile bio and submit a match request to get the most out of My True Siblings.
              </p>
              <div className="flex gap-2 mt-3">
                {!user.bio && !user.display_name && (
                  <Button size="sm" variant="secondary" asChild className="rounded-full">
                    <Link href="/account/profile">Complete Profile</Link>
                  </Button>
                )}
                {matchRequests.length === 0 && (
                  <Button size="sm" variant="primary" asChild className="rounded-full">
                    <Link href="/match">Find a Sibling</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
        <Link href="/account/matches" className="rounded-2xl border border-border bg-card p-5 transition-colors hover:bg-muted/50">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
            <Heart className="h-5 w-5" />
          </div>
          <p className="text-2xl font-bold">{incomingMatches.length + outgoingMatchCount}</p>
          <p className="text-sm text-muted-foreground">Pending Matches</p>
        </Link>
        <Link href="/account/messages" className="rounded-2xl border border-border bg-card p-5 transition-colors hover:bg-muted/50 relative">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-pink/10 text-brand-pink mb-3">
            <MessageCircle className="h-5 w-5" />
          </div>
          <p className="text-2xl font-bold">{unreadCount}</p>
          <p className="text-sm text-muted-foreground">Unread Messages</p>
          {unreadCount > 0 && (
            <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-brand-pink" />
          )}
        </Link>
        <Link href="/account/notifications" className="rounded-2xl border border-border bg-card p-5 transition-colors hover:bg-muted/50 relative">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange mb-3">
            <Bell className="h-5 w-5" />
          </div>
          <p className="text-2xl font-bold">{notificationCount}</p>
          <p className="text-sm text-muted-foreground">Notifications</p>
          {notificationCount > 0 && (
            <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-brand-orange" />
          )}
        </Link>
        <Link href="/account/activity" className="rounded-2xl border border-border bg-card p-5 transition-colors hover:bg-muted/50">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700 mb-3">
            <Calendar className="h-5 w-5" />
          </div>
          <p className="text-2xl font-bold">{user?.created_at ? formatDate(user.created_at) : "\u2014"}</p>
          <p className="text-sm text-muted-foreground">Member Since</p>
        </Link>
      </div>

      {/* Incoming matches */}
      {incomingMatches.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-display font-bold">
              Incoming Matches ({incomingMatches.length})
            </h2>
            <Link href="/account/matches" className="text-sm text-primary font-medium hover:underline">
              Review <ArrowRight className="h-3.5 w-3.5 inline" />
            </Link>
          </div>
          <div className="space-y-2">
            {incomingMatches.map((m) => (
              <div key={m.id} className="rounded-xl border border-brand-yellow/30 bg-brand-yellow/5 p-4 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-brand-yellow/20 flex items-center justify-center text-sm font-bold text-brand-yellow">
                  {m.other_user_name?.charAt(0) || "?"}
                </div>
                <p className="text-sm font-medium flex-1">{m.other_user_name} wants to connect!</p>
                <Link href="/account/matches" className="text-xs font-medium text-primary hover:underline">
                  Respond
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Match Requests */}
      {matchRequests.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-display font-bold">Your Match Requests</h2>
            <Link href="/account/matches" className="text-sm text-primary font-medium hover:underline">
              View all <ArrowRight className="h-3.5 w-3.5 inline" />
            </Link>
          </div>
          <div className="space-y-2">
            {matchRequests.slice(0, 3).map((req) => (
              <div key={req.id} className="rounded-xl border border-border bg-card p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm capitalize">{req.pillar?.replace(/-/g, " ")}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{formatDate(req.created_at)}</p>
                </div>
                {statusBadge(req.status)}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {matchRequests.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-border bg-card/50 p-10 text-center">
          <Heart className="mx-auto h-10 w-10 text-muted-foreground/40 mb-4" />
          <h2 className="text-lg font-display font-bold mb-2">Find your sibling</h2>
          <p className="text-sm text-muted-foreground mb-5 max-w-sm mx-auto">
            You haven&apos;t submitted any match requests yet. Start by telling us what you&apos;re looking for.
          </p>
          <Button asChild className="rounded-full">
            <Link href="/match">
              Start Matching <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
