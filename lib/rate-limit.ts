import db from "@/lib/db";

interface RateLimitRow {
  count: number;
  reset_at: number;
}

export async function rateLimit(
  key: string,
  maxAttempts: number,
  windowMs: number
): Promise<{ ok: boolean; remaining: number; resetAt: number }> {

  const now = Date.now();

  try {
    const [rows] = await db.execute(
      "SELECT `count`, reset_at FROM rate_limits WHERE `key` = ?",
      [key]
    );
    const rateLimitRows = rows as RateLimitRow[];
    const entry = rateLimitRows[0];

    if (!entry || entry.reset_at <= now) {
      await db.execute(
        "INSERT INTO rate_limits (`key`, `count`, reset_at) VALUES (?, 1, ?) ON DUPLICATE KEY UPDATE `count` = 1, reset_at = VALUES(reset_at)",
        [key, now + windowMs]
      );
      return { ok: true, remaining: maxAttempts - 1, resetAt: now + windowMs };
    }

    if (entry.count >= maxAttempts) {
      return { ok: false, remaining: 0, resetAt: entry.reset_at };
    }

    await db.execute(
      "UPDATE rate_limits SET `count` = `count` + 1 WHERE `key` = ?",
      [key]
    );

    return { ok: true, remaining: maxAttempts - entry.count - 1, resetAt: entry.reset_at };
  } catch {
    return { ok: false, remaining: 0, resetAt: now + windowMs };
  }
}

export async function rateLimitByIp(
  request: Request,
  endpoint: string,
  maxAttempts: number,
  windowMs: number
) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";
  return rateLimit(`${endpoint}:${ip}`, maxAttempts, windowMs);
}
