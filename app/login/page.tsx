import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign In | My Siblings",
  description: "Sign in to your My Siblings account.",
};

export default function LoginPage() {
  return (
    <main className="min-h-dvh bg-gradient-to-br from-primary/5 via-background to-brand-pink/5">
      <div className="container mx-auto px-4 py-16 md:py-24 max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
            Welcome back
          </h1>
          <p className="text-muted-foreground">
            Sign in to your My Siblings account.
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
