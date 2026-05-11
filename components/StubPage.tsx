import Link from "next/link";
import { ArrowLeft, Hammer } from "lucide-react";

import { Button } from "@/components/ui/button";

interface StubPageProps {
  eyebrow: string;
  title: string;
  description: string;
  /** Optional accent color class, e.g. "text-brand-pink" */
  accent?: string;
}

/**
 * Shared placeholder used by every route the landing page links to until we
 * build that route out. Keeps a consistent shell (eyebrow / h1 / blurb / back
 * link) so visitors who follow a CTA never hit a dead 404 while the site is
 * still being assembled.
 */
export default function StubPage({
  eyebrow,
  title,
  description,
  accent = "text-primary",
}: StubPageProps) {
  return (
    <section className="min-h-[70vh] py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4 max-w-2xl text-center">
        <p
          className={`${accent} font-semibold text-sm uppercase tracking-widest mb-3`}
        >
          {eyebrow}
        </p>
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-5 leading-tight">
          {title}
        </h1>
        <p className="text-muted-foreground leading-relaxed mb-8">
          {description}
        </p>
        <div className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-10">
          <Hammer className="h-4 w-4" aria-hidden />
          Page under construction
        </div>
        <div>
          <Button variant="secondary" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" aria-hidden /> Back to home
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
