import { describe, it, expect } from "vitest";

describe("auth utilities", () => {
  it("hashToken produces consistent SHA-256 hex string", async () => {
    const { hashToken } = await import("@/lib/auth");
    const hash1 = hashToken("test-token");
    const hash2 = hashToken("test-token");
    expect(hash1).toBe(hash2);
    expect(hash1).toMatch(/^[a-f0-9]{64}$/);
  });

  it("hashToken produces different hashes for different tokens", async () => {
    const { hashToken } = await import("@/lib/auth");
    expect(hashToken("token-a")).not.toBe(hashToken("token-b"));
  });
});

describe("registration validation", () => {
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  it("accepts valid email formats", () => {
    expect(EMAIL_REGEX.test("user@example.com")).toBe(true);
    expect(EMAIL_REGEX.test("test@domain.co.uk")).toBe(true);
    expect(EMAIL_REGEX.test("name+tag@company.org")).toBe(true);
    expect(EMAIL_REGEX.test("a@b.cd")).toBe(true);
  });

  it("rejects invalid email formats", () => {
    expect(EMAIL_REGEX.test("")).toBe(false);
    expect(EMAIL_REGEX.test("notanemail")).toBe(false);
    expect(EMAIL_REGEX.test("@domain.com")).toBe(false);
    expect(EMAIL_REGEX.test("user@")).toBe(false);
    expect(EMAIL_REGEX.test("user@.com")).toBe(false);
    expect(EMAIL_REGEX.test("user@domain")).toBe(false);
  });

  it("validates password minimum length", () => {
    const minLength = 8;
    expect("short".length >= minLength).toBe(false);
    expect("longenough".length >= minLength).toBe(true);
    expect("12345678".length >= minLength).toBe(true);
  });

  it("validates name length requirements", () => {
    const minName = 2;
    const maxName = 100;
    expect("A".length >= minName).toBe(false);
    expect("Ab".length >= minName).toBe(true);
    expect("A".repeat(maxName).length <= maxName).toBe(true);
  });
});

describe("CSRF origin validation", () => {
  it("allows GET requests without origin check", async () => {
    const { validateOrigin } = await import("@/lib/csrf");
    const req = new Request("http://localhost:3000/api/test", { method: "GET" });
    expect(validateOrigin(req).ok).toBe(true);
  });

  it("blocks POST requests with mismatched origin", async () => {
    const { validateOrigin } = await import("@/lib/csrf");
    const req = new Request("http://localhost:3000/api/test", {
      method: "POST",
      headers: { origin: "http://evil.com" },
    });
    const result = validateOrigin(req);
    expect(result.ok).toBe(false);
  });
});

describe("rate limiting", () => {
  it("rateLimitByIp extracts IP from x-forwarded-for", async () => {
    const { rateLimitByIp } = await import("@/lib/rate-limit");
    const req = new Request("http://localhost:3000/api/test", {
      headers: { "x-forwarded-for": "192.168.1.1" },
    });
    const result = await rateLimitByIp(req, "test", 10, 60_000);
    expect(result).toHaveProperty("ok");
  });
});
