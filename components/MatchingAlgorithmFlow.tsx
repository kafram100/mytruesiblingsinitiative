"use client";

import { motion } from "framer-motion";
import {
  UserCheck,
  ShieldAlert,
  AlertTriangle,
  UserCog,
  Filter,
  Calculator,
  ListOrdered,
  Send,
  MessageCircle,
  RefreshCw,
  Users,
  Sparkles,
  Lock,
  Heart,
  type LucideIcon,
} from "lucide-react";

interface StepDef {
  n: string;
  icon: LucideIcon;
  title: string;
  desc: string;
  color: string;
}

const stepsDef: StepDef[] = [
  {
    n: "01",
    icon: UserCheck,
    title: "Create Your Profile",
    desc: "Tell us about yourself, your needs, and what you are looking for in a sibling connection.",
    color: "bg-deep-teal",
  },
  {
    n: "02",
    icon: ShieldAlert,
    title: "Safety & Consent Check",
    desc: "We verify your identity and ensure you understand our safeguarding guidelines before matching.",
    color: "bg-brand-red",
  },
  {
    n: "03",
    icon: AlertTriangle,
    title: "Crisis Screen",
    desc: "A brief wellness check ensures you are in the right headspace for a supportive connection.",
    color: "bg-brand-orange",
  },
  {
    n: "04",
    icon: UserCog,
    title: "Set Your Preferences",
    desc: "Choose your preferred pillar, age range, language, and support type for the best match.",
    color: "bg-brand-pink",
  },
  {
    n: "05",
    icon: Filter,
    title: "Select Interests",
    desc: "Pick topics and activities you enjoy so we can find a sibling with common ground.",
    color: "bg-deep-teal",
  },
  {
    n: "06",
    icon: Calculator,
    title: "Compatibility Scoring",
    desc: "Our algorithm scores potential matches across needs, interests, values, and availability.",
    color: "bg-brand-yellow",
  },
  {
    n: "07",
    icon: ListOrdered,
    title: "Ranked Matches",
    desc: "You receive a ranked list of compatible siblings based on your unique scoring profile.",
    color: "bg-brand-orange",
  },
  {
    n: "08",
    icon: Send,
    title: "Connection Request",
    desc: "Send a connection request to a potential sibling. They can accept or decline privately.",
    color: "bg-brand-pink",
  },
  {
    n: "09",
    icon: MessageCircle,
    title: "Guided Introduction",
    desc: "Our guided chat prompts help break the ice and build a meaningful first conversation.",
    color: "bg-deep-teal",
  },
  {
    n: "10",
    icon: RefreshCw,
    title: "Ongoing Support",
    desc: "Matches can evolve into long-term sibling relationships with community check-ins and resources.",
    color: "bg-brand-red",
  },
];

const scoringFactorsDef: {
  icon: LucideIcon;
  label: string;
  weight: string;
}[] = [
  {
    icon: Heart,
    label: "Need Alignment",
    weight: "20%",
  },
  {
    icon: MessageCircle,
    label: "Language",
    weight: "10%",
  },
  {
    icon: Sparkles,
    label: "Life Stage",
    weight: "15%",
  },
  { icon: Users, label: "Shared Interests", weight: "10%" },
  {
    icon: UserCog,
    label: "Availability",
    weight: "10%",
  },
  {
    icon: Filter,
    label: "Location & Timezone",
    weight: "10%",
  },
  {
    icon: Heart,
    label: "Support Style",
    weight: "15%",
  },
  { icon: Lock, label: "Trust Score", weight: "10%" },
];

export default function MatchingAlgorithmFlow() {
  return (
    <section id="matching" className="scroll-mt-28 bg-background py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-deep-teal/10 px-4 py-1.5 text-sm font-medium text-deep-teal">
            <Sparkles className="h-4 w-4" aria-hidden /> Matching Algorithm
          </div>
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-5xl">
            How We Match You
          </h2>
          <p className="text-lg text-muted-foreground">
            Our intelligent matching system finds the perfect sibling based on your needs, interests, and values.
          </p>
        </motion.div>

        <div className="mb-16 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {stepsDef.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="relative rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-lg"
            >
              <div
                className={`${s.color} mb-3 flex h-11 w-11 items-center justify-center rounded-xl text-white`}
              >
                <s.icon className="h-5 w-5" aria-hidden />
              </div>
              <div className="mb-1 font-mono text-xs text-muted-foreground">
                {s.n}
              </div>
              <h3 className="mb-1.5 font-semibold leading-tight text-foreground">
                {s.title}
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl bg-primary p-8 text-primary-foreground md:p-12"
        >
          <div className="mb-8 text-center">
            <h3 className="mb-2 text-2xl font-bold md:text-3xl">
              Compatibility Score Breakdown
            </h3>
            <p className="text-primary-foreground/85">
              We weigh several dimensions to find your ideal sibling match.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {scoringFactorsDef.map((f, i) => (
              <motion.div
                key={`${f.label}-${i}`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-primary-foreground/15 bg-primary-foreground/10 p-4 text-center backdrop-blur"
              >
                <f.icon
                  className="mx-auto mb-2 h-6 w-6 text-brand-yellow"
                  aria-hidden
                />
                <div className="text-sm font-medium">{f.label}</div>
                <div className="mt-1 text-2xl font-bold text-brand-yellow">
                  {f.weight}
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mx-auto mt-8 max-w-2xl text-center text-sm text-primary-foreground/75">
            Scores are recalculated as new siblings join. You can update your preferences anytime to improve matches.
          </div>
        </motion.div>
      </div>
    </section>
  );
}
