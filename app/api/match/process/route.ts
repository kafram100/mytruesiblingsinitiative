import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSiblingSession } from "@/lib/sibling-auth";
import { calculateCompatibilityScore, type MatchRequest } from "@/lib/matching";
import { createNotification } from "@/lib/notifications";
import { logUserActivity } from "@/lib/user-activity";
import { sendMatchNotificationEmail } from "@/lib/mail";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const user = await getSiblingSession();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get the user's latest pending match request
    const [requests] = await db.execute(
      `SELECT id, pillar, age_range, gender, language, country, timezone, support_type, interests, anonymous
       FROM match_requests WHERE user_id = ? AND status = 'pending'
       ORDER BY created_at DESC LIMIT 1`,
      [user.id]
    );
    const userRequests = requests as Record<string, unknown>[];
    if (userRequests.length === 0) {
      return NextResponse.json({ error: "No pending match request found" }, { status: 404 });
    }

    const req = userRequests[0];
    const userRequest: MatchRequest = {
      pillar: req.pillar as string,
      ageRange: req.age_range as string,
      gender: (req.gender as string) || "",
      language: req.language as string,
      country: (req.country as string) || "",
      timezone: (req.timezone as string) || "",
      supportType: req.support_type as string,
      interests: typeof req.interests === "string" ? JSON.parse(req.interests as string) : (req.interests as string[]),
      anonymous: Boolean(req.anonymous),
    };

    // Get other pending match requests (exclude own)
    const [candidates] = await db.execute(
      `SELECT
        id as request_id, user_id, pillar, age_range, gender, language, country, timezone, support_type, interests, anonymous
       FROM match_requests
       WHERE user_id != ? AND status = 'pending'
       ORDER BY created_at DESC
       LIMIT 50`,
      [user.id]
    );
    const candidateRows = candidates as Record<string, unknown>[];

    if (candidateRows.length === 0) {
      return NextResponse.json({ message: "No potential matches found yet. We'll notify you when someone joins.", matches: [] });
    }

    // Score each candidate
    const scored = candidateRows.map((c) => {
      const candidateReq: Partial<MatchRequest> = {
        pillar: c.pillar as string,
        ageRange: c.age_range as string,
        gender: (c.gender as string) || "",
        language: c.language as string,
        country: (c.country as string) || "",
        supportType: c.support_type as string,
        interests: typeof c.interests === "string" ? JSON.parse(c.interests as string) : (c.interests as string[]),
      };
      const score = calculateCompatibilityScore(userRequest, candidateReq);
      return {
        candidateRequestId: c.request_id as string,
        candidateUserId: c.user_id as string,
        score: score.score,
        breakdown: score.breakdown,
      };
    });

    // Sort by score descending, take top 3
    scored.sort((a, b) => b.score - a.score);
    const topMatches = scored.slice(0, 3).filter((m) => m.score >= 30);

    if (topMatches.length === 0) {
      return NextResponse.json({ message: "No strong matches found yet.", matches: [] });
    }

    // Create match records
    for (const match of topMatches) {
      // Check if already matched
      const [existing] = await db.execute(
        `SELECT id FROM matches WHERE request_id = ? AND matched_user_id = ?`,
        [req.id, match.candidateUserId]
      );
      if ((existing as { id: string }[]).length > 0) continue;

      await db.execute(
        `INSERT INTO matches (id, request_id, matched_user_id, score, status)
         VALUES (gen_random_uuid(), ?, ?, ?, 'pending')`,
        [req.id, match.candidateUserId, match.score]
      );

      // Also create reverse match
      const [existingReverse] = await db.execute(
        `SELECT id FROM matches WHERE request_id = ? AND matched_user_id = ?`,
        [match.candidateRequestId, user.id]
      );
      if ((existingReverse as { id: string }[]).length === 0) {
        await db.execute(
          `INSERT INTO matches (id, request_id, matched_user_id, score, status)
           VALUES (gen_random_uuid(), ?, ?, ?, 'pending')`,
          [match.candidateRequestId, user.id, match.score]
        );
      }

      // Notify the candidate
      await createNotification(
        match.candidateUserId,
        "match",
        "New Match Found!",
        `You have been matched with a new sibling! Check your matches to accept or decline.`,
        "/account/matches"
      );

      // Send email notification asynchronously
      try {
        const [candidateRows] = await db.execute(
          "SELECT email, full_name FROM profiles WHERE id = ?",
          [match.candidateUserId]
        );
        const candidate = (candidateRows as { email: string; full_name: string }[])[0];
        if (candidate) {
          sendMatchNotificationEmail(candidate.email, candidate.full_name, "match_found", user.full_name);
        }
      } catch {}
    }

    // Update own request status
    await db.execute(
      `UPDATE match_requests SET status = 'matched' WHERE id = ?`,
      [req.id]
    );

    // Notify the user
    await createNotification(
      user.id,
      "match",
      "Matches Found!",
      `We found ${topMatches.length} potential sibling${topMatches.length > 1 ? "s" : ""} for you! Check your matches to accept or decline.`,
      "/account/matches"
    );

    await logUserActivity(user.id, "match_processed", `Found ${topMatches.length} potential matches`);

    return NextResponse.json({
      success: true,
      matches: topMatches.map((m) => ({
        score: m.score,
        breakdown: m.breakdown,
      })),
    });
  } catch (err) {
    console.error("Match processing error:", err);
    return NextResponse.json({ error: "Failed to process matches" }, { status: 500 });
  }
}
