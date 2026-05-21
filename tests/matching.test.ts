import { describe, it, expect } from "vitest";
import { calculateCompatibilityScore, getTopMatches, PILLARS, AGE_RANGES, SUPPORT_TYPES, INTERESTS } from "@/lib/matching";

describe("matching algorithm", () => {
  const baseRequest = {
    pillar: "sibling-connect",
    ageRange: "18-25",
    gender: "Female",
    language: "English",
    country: "US",
    timezone: "UTC-5",
    supportType: "mentorship",
    interests: ["Arts & Creativity", "Music", "Reading & Writing"],
    anonymous: false,
  };

  it("returns 100% for identical match", () => {
    const result = calculateCompatibilityScore(baseRequest, baseRequest);
    expect(result.score).toBe(100);
  });

  it("scores lower for mismatched pillar", () => {
    const diff = { ...baseRequest, pillar: "adult-safe-place" };
    const result = calculateCompatibilityScore(baseRequest, diff);
    expect(result.score).toBeLessThan(100);
    expect(result.breakdown.pillar).toBe(0);
  });

  it("scores lower for different language", () => {
    const diff = { ...baseRequest, language: "Spanish" };
    const result = calculateCompatibilityScore(baseRequest, diff);
    expect(result.score).toBeLessThan(100);
    expect(result.breakdown.language).toBeLessThan(15);
  });

  it("handles empty interests gracefully", () => {
    const request = { ...baseRequest, interests: [] };
    const candidate = { ...baseRequest, interests: ["Arts & Creativity"] };
    const result = calculateCompatibilityScore(request, candidate);
    expect(result.score).toBeGreaterThanOrEqual(0);
  });

  it("returns breakdown with all keys", () => {
    const result = calculateCompatibilityScore(baseRequest, baseRequest);
    const expectedKeys = ["pillar", "language", "ageRange", "supportType", "interests", "country"];
    for (const key of expectedKeys) {
      expect(result.breakdown).toHaveProperty(key);
    }
  });

  it("getTopMatches returns top N results", () => {
    const candidates = [
      { ...baseRequest, language: "Spanish" },
      { ...baseRequest, country: "NG" },
      { ...baseRequest, ageRange: "26-45" },
      { ...baseRequest, language: "French", country: "FR" },
      { ...baseRequest },
    ];
    const top = getTopMatches(baseRequest, candidates, 3);
    expect(top).toHaveLength(3);
    expect(top[0].score.score).toBeGreaterThanOrEqual(top[1].score.score);
    expect(top[0].score.score).toBeGreaterThanOrEqual(top[2].score.score);
  });

  it("best match is identical candidate", () => {
    const candidates = [
      { ...baseRequest, language: "Spanish" },
      { ...baseRequest, country: "NG" },
      { ...baseRequest },
    ];
    const top = getTopMatches(baseRequest, candidates, 3);
    const best = top[0];
    expect(best.score.score).toBe(100);
    expect(best.candidate.language).toBe("English");
    expect(best.candidate.country).toBe("US");
  });
});

describe("matching constants", () => {
  it("PILLARS has 3 entries", () => {
    expect(PILLARS).toHaveLength(3);
  });

  it("AGE_RANGES covers all life stages", () => {
    expect(AGE_RANGES.some((a) => a.value === "18-25")).toBe(true);
    expect(AGE_RANGES.some((a) => a.value === "60+")).toBe(true);
  });

  it("SUPPORT_TYPES includes mentorship", () => {
    expect(SUPPORT_TYPES.some((s) => s.value === "mentorship")).toBe(true);
  });

  it("INTERESTS has at least 10 entries", () => {
    expect(INTERESTS.length).toBeGreaterThanOrEqual(10);
  });
});
