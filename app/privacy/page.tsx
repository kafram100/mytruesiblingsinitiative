import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How My True Siblings Initiative collects, uses, and protects your personal information.",
};

const sections = [
  {
    title: "Information We Collect",
    content:
      "We collect only the information you voluntarily provide: name, email address, and any messages you send via our contact form. If you make a donation, we collect payment information through Stripe — we do not store credit card numbers on our servers. When you sign up for matching or mentorship, we collect the profile details you choose to share (interests, language, age range, and optional photo).",
  },
  {
    title: "How We Use Your Information",
    content:
      "Your information is used solely to operate the platform: facilitate sibling matching, process donations, respond to inquiries, and improve our programs. We never sell your data. We never share it with third parties for marketing purposes. We may share anonymized aggregate data with partners for impact reporting.",
  },
  {
    title: "Anonymous Usage",
    content:
      "You may use most of the platform without providing any personal information. The matching system supports pseudonyms, optional photos, and granular privacy controls. You decide what to share and with whom. We never require a legal name to participate.",
  },
  {
    title: "Data Storage & Security",
    content:
      "Your data is stored on secure servers with encryption in transit (TLS) and at rest. Access is restricted to trained staff and volunteers who need it to operate the platform. We implement industry-standard security measures including rate limiting, input validation, and regular audits.",
  },
  {
    title: "Cookies",
    content:
      "We use essential cookies for authentication and platform functionality. We do not use tracking cookies, advertising cookies, or third-party analytics cookies. You can disable cookies in your browser, though some platform features may not function correctly.",
  },
  {
    title: "Data Retention",
    content:
      "We retain your personal data only as long as necessary to provide the service. You may request deletion of your data at any time by contacting us. Donation records are retained for accounting purposes as required by law.",
  },
  {
    title: "Your Rights",
    content:
      "Depending on your jurisdiction, you may have the right to access, correct, delete, or port your data. You may also withdraw consent at any time. To exercise these rights, contact us at the email below. We will respond within 30 days.",
  },
  {
    title: "Third party services",
    content:
      "We use Stripe for payment processing, MySQL for data storage, and Vercel for hosting. Each service provider has its own privacy policy and data processing agreements. We only use services that commit to GDPR-compliant data handling.",
  },
  {
    title: "Children's Privacy (COPPA)",
    content:
      "We comply with the Children's Online Privacy Protection Act. For users under 13, we require verifiable parental consent before collecting any personal information. Parents may review, delete, or refuse further collection of their child's data at any time.",
  },
  {
    title: "Changes to This Policy",
    content:
      "We may update this policy as the platform grows. Material changes will be announced via email to registered users and posted on this page. The effective date at the top of this page reflects the latest revision.",
  },
  {
    title: "Contact",
    content:
      "For privacy questions, data requests, or concerns, contact us at privacy@my-true-siblings.org or through our contact form.",
  },
];

export default function PrivacyPage() {
  return (
    <article className="bg-background">
      <header className="bg-gradient-to-br from-primary/15 via-background to-brand-pink/10 py-16 md:py-24">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
            <Shield className="h-4 w-4" aria-hidden="true" />
            Privacy
          </p>
          <h1 className="mb-5 text-4xl font-display font-bold leading-tight md:text-5xl">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Last updated: May 2026
          </p>
        </div>
      </header>

      <div className="container mx-auto max-w-3xl px-4 py-12 md:py-16">
        <div className="prose prose-gray max-w-none space-y-8">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="mb-3 font-display text-xl font-bold text-primary md:text-2xl">
                {s.title}
              </h2>
              <p className="leading-relaxed text-muted-foreground">
                {s.content}
              </p>
            </section>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button variant="secondary" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to home
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
