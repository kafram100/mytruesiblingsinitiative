export const PILLARS = [
  { value: "sibling-connect", label: "Sibling Connect", description: "Steady community, mentorship, and everyday belonging for youth and general members." },
  { value: "adult-safe-place", label: "Adult Safe Place (18+)", description: "Confidential, anonymous friendly emotional support for adults 18+." },
  { value: "inclusive-support-hub", label: "Inclusive Support Hub", description: "Disability led communities, accessible by design, with caregiver support." },
] as const;

export const AGE_RANGES = [
  { value: "0-6", label: "Early Childhood (0-6)" },
  { value: "7-11", label: "Primary Years (7-11)" },
  { value: "12-17", label: "Adolescence (12-17)" },
  { value: "18-25", label: "Young Adult (18-25)" },
  { value: "26-45", label: "Adult (26-45)" },
  { value: "46-60", label: "Mid-life (46-60)" },
  { value: "60+", label: "Elder (60+)" },
] as const;

export const SUPPORT_TYPES = [
  { value: "mentorship", label: "One-on-One Mentorship", description: "Regular check-ins with a trained mentor sibling." },
  { value: "peer-support", label: "Peer Support Group", description: "Join a circle of siblings with similar experiences." },
  { value: "crisis-companion", label: "Crisis Companion", description: "Short-term emotional support during difficult times." },
  { value: "community", label: "Community Connection", description: "General belonging and community activities." },
  { value: "caregiver", label: "Caregiver Support", description: "Support for those caring for others." },
] as const;

export const INTERESTS = [
  "Arts & Creativity", "Music", "Sports & Fitness", "Reading & Writing",
  "Technology", "Nature & Outdoors", "Cooking & Food", "Gaming",
  "Faith & Spirituality", "Mental Health Advocacy", "Disability Advocacy",
  "Education & Learning", "Career Development", "Cultural Exchange",
  "Volunteering", "Fashion & Style",
] as const;

export const LANGUAGES = [
  "English", "Spanish", "French", "Arabic", "Swahili", "Portuguese",
  "German", "Italian", "Dutch", "Turkish", "Hindi", "Bengali",
  "Urdu", "Mandarin Chinese", "Japanese", "Korean", "Filipino",
  "Vietnamese", "Thai", "Russian",
] as const;

export const COUNTRIES = [
  { value: "US", label: "United States" },
  { value: "CA", label: "Canada" },
  { value: "GB", label: "United Kingdom" },
  { value: "NG", label: "Nigeria" },
  { value: "GH", label: "Ghana" },
  { value: "KE", label: "Kenya" },
  { value: "ZA", label: "South Africa" },
  { value: "IN", label: "India" },
  { value: "AU", label: "Australia" },
  { value: "NZ", label: "New Zealand" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
  { value: "ES", label: "Spain" },
  { value: "BR", label: "Brazil" },
  { value: "MX", label: "Mexico" },
  { value: "JP", label: "Japan" },
  { value: "KR", label: "South Korea" },
  { value: "PH", label: "Philippines" },
  { value: "AE", label: "United Arab Emirates" },
  { value: "SA", label: "Saudi Arabia" },
  { value: "PK", label: "Pakistan" },
  { value: "BD", label: "Bangladesh" },
  { value: "IT", label: "Italy" },
  { value: "NL", label: "Netherlands" },
  { value: "SE", label: "Sweden" },
  { value: "NO", label: "Norway" },
  { value: "DK", label: "Denmark" },
] as const;

export interface MatchRequest {
  pillar: string;
  ageRange: string;
  gender: string;
  language: string;
  country: string;
  timezone: string;
  supportType: string;
  interests: string[];
  anonymous: boolean;
}

export interface MatchScore {
  requestId: string;
  candidateId: string;
  score: number;
  breakdown: Record<string, number>;
}

const SCORING_WEIGHTS = {
  language: 0.15,
  ageRange: 0.20,
  supportType: 0.25,
  interests: 0.15,
  country: 0.10,
  pillar: 0.15,
};

export function calculateCompatibilityScore(
  request: MatchRequest,
  candidate: Partial<MatchRequest>
): MatchScore {
  let totalScore = 0;
  const breakdown: Record<string, number> = {};

  const pillarScore = request.pillar === candidate.pillar ? 1 : 0;
  breakdown.pillar = pillarScore * SCORING_WEIGHTS.pillar;
  totalScore += breakdown.pillar;

  const languageScore = request.language === candidate.language ? 1 : 0.3;
  breakdown.language = languageScore * SCORING_WEIGHTS.language;
  totalScore += breakdown.language;

  const ageScore = request.ageRange === candidate.ageRange ? 1 : 0.5;
  breakdown.ageRange = ageScore * SCORING_WEIGHTS.ageRange;
  totalScore += breakdown.ageRange;

  const supportScore = request.supportType === candidate.supportType ? 1 : 0.4;
  breakdown.supportType = supportScore * SCORING_WEIGHTS.supportType;
  totalScore += breakdown.supportType;

  let interestOverlap = 0;
  if (request.interests.length > 0 && candidate.interests?.length) {
    const matches = request.interests.filter((i) => candidate.interests?.includes(i));
    interestOverlap = matches.length / Math.max(request.interests.length, candidate.interests.length);
  }
  breakdown.interests = interestOverlap * SCORING_WEIGHTS.interests;
  totalScore += breakdown.interests;

  const countryScore = request.country === candidate.country ? 1 : 0.3;
  breakdown.country = countryScore * SCORING_WEIGHTS.country;
  totalScore += breakdown.country;

  return {
    requestId: "",
    candidateId: "",
    score: Math.round(totalScore * 100),
    breakdown: Object.fromEntries(
      Object.entries(breakdown).map(([k, v]) => [k, Math.round(v * 100)])
    ),
  };
}

export function getTopMatches(
  request: MatchRequest,
  candidates: Partial<MatchRequest>[],
  topN = 3
): { candidate: Partial<MatchRequest>; score: MatchScore }[] {
  const scored = candidates.map((candidate) => ({
    candidate,
    score: calculateCompatibilityScore(request, candidate),
  }));
  scored.sort((a, b) => b.score.score - a.score.score);
  return scored.slice(0, topN);
}
