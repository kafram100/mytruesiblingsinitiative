import type { Metadata } from "next";
import Link from "next/link";
import { GraduationCap, ArrowRight } from "lucide-react";
import RegisterForm from "./RegisterForm";

export const metadata: Metadata = {
  title: "Join My Siblings",
  description: "Create your free account and become part of a global community of belonging.",
};

export default function RegisterPage() {
  return (
    <main className="min-h-dvh bg-gradient-to-br from-primary/5 via-background to-brand-pink/5">
      <div className="container mx-auto px-4 py-16 md:py-24 max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
            Join the family
          </h1>
          <p className="text-muted-foreground">
            Free. Anonymous if you prefer. Always human.
          </p>
        </div>
        <RegisterForm />

        <div className="mt-8 rounded-2xl border-2 border-dashed border-primary/20 bg-primary/5 p-6 text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
            <GraduationCap className="h-6 w-6" />
          </span>
          <h2 className="font-display font-bold text-lg mb-1">Want to guide others?</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Become a mentor or coach. Share your experience and help siblings on their journey.
          </p>
          <Link
            href="/mentor-register"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Register as a Mentor <GraduationCap className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
