import LovableHome from "@/components/home/LovableHome";

/**
 * Home is composed from the Lovable “Index” layout (see `LovableHome.tsx`):
 * Hero video, pillars, program highlights, how it works, impact metrics,
 * testimonials, matching flow, and closing CTA, adapted for Next.js
 * (`next/link`, `next/image`, and static Tailwind classes for JIT).
 *
 * Section ids for header/footer anchors: #pillars, #how-it-works, #promises,
 * #testimonials, #matching (SafeMatchingSections inside LovableHome). Gifts:
 * `/save-a-sibling`, `/save-a-sibling#give`, `/save-a-sibling#monthly-sponsor`.
 */
export default function Home() {
  return <LovableHome />;
}
