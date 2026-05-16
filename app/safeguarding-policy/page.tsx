import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Safeguarding Policy",
  description:
    "My True Siblings Initiative's commitment to safeguarding, child protection, and creating a safe environment for all participants.",
};

const sections = [
  {
    title: "Our Commitment",
    content:
      "My True Siblings Initiative is committed to the safety and wellbeing of every person who interacts with our platform. We have zero tolerance for abuse, harassment, exploitation, or neglect. This policy applies to all staff, volunteers, mentors, partners, and participants.",
  },
  {
    title: "Mandatory Background Checks",
    content:
      "Every mentor, staff member, and volunteer who works with minors or vulnerable adults must pass a criminal background check before assuming their role. Checks are renewed every 12 months. Anyone who refuses a background check is ineligible to serve in a trusted role.",
  },
  {
    title: "No Private Physical Contact",
    content:
      "Mentors and siblings are prohibited from meeting in private physical settings. All interactions occur through the platform's built in communication tools, which are logged and subject to moderation. In person group events require prior approval and must take place in public, supervised spaces.",
  },
  {
    title: "Trauma Informed Moderation",
    content:
      "All moderators receive training in trauma informed communication, de escalation techniques, and mandatory reporting procedures. Moderators are trained to recognize signs of abuse, self harm, or exploitation and to escalate immediately through established protocols.",
  },
  {
    title: "Reporting Concerns",
    content:
      "Any participant may report a safeguarding concern through the platform's reporting tools, by emailing safeguarding@my-true-siblings.org, or by contacting any staff member. Reports are reviewed within 24 hours by the Safeguarding Lead. Emergency concerns are escalated immediately to relevant authorities.",
  },
  {
    title: "Confidentiality",
    content:
      "Safeguarding reports are handled with strict confidentiality on a need to know basis. Information is shared only with those directly involved in investigation and resolution, and with statutory authorities as required by law.",
  },
  {
    title: "Whistleblower Protection",
    content:
      "Anyone who reports a safeguarding concern in good faith is protected from retaliation. We maintain a zero-tolerance policy for any form of retaliation against reporters.",
  },
  {
    title: "Online Safety",
    content:
      "Our platform implements robust safety measures: all messages are logged, suspicious activity is flagged automatically, users can block and report others, and anonymous participation is supported to protect vulnerable users. We use rate limiting, input validation, and security headers to protect against online abuse.",
  },
  {
    title: "Data Protection (GDPR & COPPA)",
    content:
      "We comply with GDPR and COPPA requirements for data protection. Personal data is encrypted, access-controlled, and retained only as long as necessary. For users under 13, verifiable parental consent is required. Users may request access to, deletion of, or portability of their data at any time.",
  },
  {
    title: "Training & Awareness",
    content:
      "All staff and volunteers complete annual safeguarding training. Training covers recognizing abuse, reporting procedures, online safety, cultural competence, and trauma informed practice. Training records are maintained by the Safeguarding Lead.",
  },
  {
    title: "Review & Improvement",
    content:
      "This policy is reviewed annually by the Board of Trustees. Incidents are analyzed to identify systemic improvements. Policy updates are communicated to all stakeholders.",
  },
  {
    title: "Contact the Safeguarding Team",
    content:
      "To report a concern or request more information, contact our Safeguarding Lead at safeguarding@my-true-siblings.org or through our contact form. In an emergency, contact local authorities immediately.",
  },
];

export default function SafeguardingPolicyPage() {
  return (
    <article className="bg-background">
      <header className="bg-gradient-to-br from-brand-red/10 via-background to-brand-pink/10 py-16 md:py-24">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-red/20 bg-brand-red/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-red">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Safeguarding
          </p>
          <h1 className="mb-5 text-4xl font-display font-bold leading-tight md:text-5xl">
            Safeguarding Policy
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
              <h2 className="mb-3 font-display text-xl font-bold text-brand-red md:text-2xl">
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
