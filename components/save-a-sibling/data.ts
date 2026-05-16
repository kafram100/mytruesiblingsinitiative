export const IMPACT_AMOUNT_PRESETS = [
  { id: "5", amountUsd: 5, title: "A Meal of Hope", detail: "A warm meal and a kind word\u2014a small gesture that tells someone they are seen." },
  { id: "10", amountUsd: 10, title: "A Check-In That Matters", detail: "Funds a caring follow-up call so no one slips through silence alone." },
  { id: "25", amountUsd: 25, title: "A Seat at the Circle", detail: "Reserves a place in a safe support circle where real connection begins." },
  { id: "50", amountUsd: 50, title: "Access for All", detail: "Provides accessibility tools so every sibling can fully belong." },
  { id: "100", amountUsd: 100, title: "Welcome One Sibling", detail: "Covers matching, safeguarding, and a dignified welcome into the community." },
  { id: "250", amountUsd: 250, title: "Strengthen a Circle", detail: "Funds facilitator training and materials for local safe-space programs." },
  { id: "500", amountUsd: 500, title: "Full Outreach Activation", detail: "Powers mentorship, school outreach, and trauma-aware care for an entire cohort." },
] as const;

export const DONATION_PURPOSES = [
  "General Outreach Fund",
  "Save A Sibling Emergency Support",
  "Youth Mentorship",
  "Adult Safe Place",
  "Inclusive Disability Support",
  "Caregiver Support",
  "School Outreach",
  "Community Safe Circles",
  "Technology and Platform Support",
  "Sponsor A Sibling Monthly",
] as const;

export const PAYMENT_BADGES = [
  "Stripe", "Visa", "Mastercard", "American Express", "Google Pay", "Apple Pay",
  "PayPal", "Paystack", "Flutterwave", "Moniepoint", "Opay", "M Pesa",
  "Airtel Money", "MTN Mobile Money", "Bank Transfer", "USSD",
  "Klarna", "Amazon Pay", "Link", "Local mobile money options",
];

export const TRANSPARENCY = [
  { label: "Safe Space Programs", pct: 22 },
  { label: "Youth Mentorship", pct: 18 },
  { label: "Adult Emotional Support", pct: 15 },
  { label: "Disability Inclusion", pct: 15 },
  { label: "Emergency Outreach", pct: 10 },
  { label: "Technology and Platform Safety", pct: 12 },
  { label: "Volunteer Training", pct: 8 },
] as const;

export const SPONSOR_TIERS = [
  { id: "hope", title: "Hope Sponsor", amountUsd: 10, blurb: "Covers introductory care messages, safeguarding tips, and first-week warmth for someone new." },
  { id: "care", title: "Care Sponsor", amountUsd: 25, blurb: "Sustains moderated check-ins and light mentoring touchpoints throughout the month." },
  { id: "circle", title: "Circle Sponsor", amountUsd: 50, blurb: "Funds materials, facilitator stipends, and accessibility buffers for sibling circles." },
  { id: "outreach", title: "Outreach Sponsor", amountUsd: 100, blurb: "Amplifies boots-on-ground outreach, bilingual resources, and school corridor presence." },
  { id: "legacy", title: "Legacy Sponsor", amountUsd: 250, blurb: "Anchors safe programs across cities, caregiver relief, emergency pools, and platform safety upgrades." },
] as const;

export const STORIES = [
  {
    title: "A young person who needed mentorship",
    quote: "I thought I had to pretend I was okay. My sibling listened without fixing me. They walked beside me until the storm passed.",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80",
    alt: "Young friends laughing together outdoors in warm sunlight",
  },
  {
    title: "An adult who needed a safe place",
    quote: "At 34, I realized I wasn't failing. I was unheard. Anonymous support gave my heart room to exhale.",
    image: "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=900&q=80",
    alt: "Two adults sitting together in calm conversation indoors",
  },
  {
    title: "Someone who needed inclusion and support",
    quote: "Being disabled shouldn't erase belonging. Accessible circles meant I showed up exactly as I am and stayed.",
    image: "https://images.unsplash.com/photo-1732194438700-c7eb8cc16cb6?auto=format&fit=crop&w=900&q=80",
    alt: "Group of friends in wheelchairs sitting around a table in community",
  },
] as const;
