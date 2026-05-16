"use client";

import { useState } from "react";
import { ChevronDown, Heart, Search, Shield, Users, Globe, ShoppingBag, Gift, Accessibility, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";

interface FAQItem {
  q: string;
  a: string;
}

interface FAQSection {
  icon: typeof Heart;
  title: string;
  color: string;
  bg: string;
  items: FAQItem[];
}

const sections: FAQSection[] = [
  {
    icon: HelpCircle,
    title: "General",
    color: "text-brand-teal",
    bg: "bg-brand-teal/10",
    items: [
      {
        q: "What is MyTrueSiblings?",
        a: "MyTrueSiblings is a global nonprofit safe space platform where strangers become siblings. We provide emotional support, mentorship, safe conversations, community connection, disability inclusion, and belonging programs to anyone who needs them — completely free of charge.",
      },
      {
        q: "Is MyTrueSiblings free?",
        a: "Yes. All support services — including mentorship, safe conversations, support circles, and community access — are completely free for anyone seeking help. We are a mission-driven nonprofit, not a paid service.",
      },
      {
        q: "Who can join MyTrueSiblings?",
        a: "Anyone. Regardless of age, gender, nationality, ability, religion, sexual orientation, or background. MyTrueSiblings is built on the belief that everyone deserves belonging. Youth, adults, seniors, families, and individuals of all abilities are welcome.",
      },
      {
        q: "Is MyTrueSiblings a registered nonprofit?",
        a: "Yes. MyTrueSiblings is a mission-driven nonprofit initiative focused on creating safe spaces, support systems, emotional connection, inclusion, mentorship, and community outreach worldwide. Our operations are funded through purchases, donations, memberships, partnerships, and sponsorships.",
      },
      {
        q: "Can adults join?",
        a: "Absolutely. MyTrueSiblings has dedicated programs for all life stages, including our Adult Safe Place (18+) program which provides emotional support, safe conversations, mentorship opportunities, and community connection for adults.",
      },
      {
        q: "Can people living with disabilities join?",
        a: "Yes. Inclusion is at the heart of everything we do. Our Inclusive Support Hub is specifically designed for individuals with disabilities, offering adaptive programming, accessible communication tools, and a welcoming community. We continuously work to improve accessibility across all our programs and platforms.",
      },
      {
        q: "Is MyTrueSiblings available globally?",
        a: "Yes. MyTrueSiblings serves a global community across 40+ countries. Our programs are designed to be culturally sensitive and accessible worldwide. Our online platform allows anyone with internet access to connect with siblings from around the world.",
      },
    ],
  },
  {
    icon: Shield,
    title: "Support & Safety",
    color: "text-brand-orange-hex",
    bg: "bg-brand-orange-hex/10",
    items: [
      {
        q: "Is the platform moderated?",
        a: "Yes. All conversations, support circles, and community spaces are moderated by trained volunteers and staff. We maintain strict safeguarding protocols to ensure every interaction is safe, respectful, and supportive. Our moderation team works 24/7 to maintain a secure environment.",
      },
      {
        q: "How does emotional support work?",
        a: "Emotional support is provided through trained volunteer siblings who are matched based on shared experiences, interests, and needs. Support can take place through private conversations, group support circles, or community forums. All supporters complete comprehensive training in trauma informed care, active listening, and emotional safety.",
      },
      {
        q: "Are conversations confidential?",
        a: "Yes. All conversations within MyTrueSiblings are confidential. We take your privacy seriously. The only exception is if someone is at immediate risk of harm — in which case our safeguarding protocol requires us to involve appropriate authorities to ensure everyone's safety.",
      },
      {
        q: "How are members protected?",
        a: "Members are protected through multiple layers of safety: identity verification for volunteers, comprehensive background checks, real time conversation monitoring, AI powered safety alerts, clear community guidelines, reporting systems, and dedicated safeguarding teams. We maintain zero tolerance for harassment, abuse, or harmful behavior.",
      },
      {
        q: "Can I report harmful behavior?",
        a: "Yes. Every page and conversation includes reporting tools. Reports are reviewed by our safeguarding team within 24 hours (often much sooner). You can also email our safeguarding team directly at safeguarding@mytruesiblingsinitiative.org. All reports are treated with urgency, dignity, and confidentiality.",
      },
    ],
  },
  {
    icon: Users,
    title: "Matching & Community",
    color: "text-brand-pink-hex",
    bg: "bg-brand-pink-hex/10",
    items: [
      {
        q: "How does sibling matching work?",
        a: "Our matching process considers shared interests, life experiences, emotional needs, communication preferences, age, and location. After signing up, you complete a detailed profile, and our matching algorithm pairs you with compatible siblings. You can also browse and request connections with specific community members.",
      },
      {
        q: "Can I choose my interests?",
        a: "Yes. During registration, you select the areas that matter most to you — whether that's emotional support, mentorship, friendship, disability inclusion, creative collaboration, career guidance, or simply community connection. Your profile reflects what you're looking for and what you can offer.",
      },
      {
        q: "Can I join support circles?",
        a: "Absolutely. Support circles are moderated group conversations around specific topics — grief, anxiety, neurodivergence, caregiving, identity, career challenges, and more. Circles meet regularly and provide a safe space to share, listen, and connect with multiple siblings at once.",
      },
      {
        q: "Can families join?",
        a: "Yes. MyTrueSiblings welcomes families. We offer family support programs, parent support circles, sibling connections for children and teens, and resources for families navigating challenges together. Every family member can create their own profile and find their own path to belonging.",
      },
      {
        q: "Can mentors volunteer?",
        a: "Yes! Mentors are the backbone of MyTrueSiblings. If you have life experience, professional skills, or simply a willingness to listen and support others, you can become a trained volunteer sibling. All mentors complete our comprehensive training program, background checks, and receive ongoing support from our team.",
      },
    ],
  },
  {
    icon: ShoppingBag,
    title: "Shop",
    color: "text-brand-yellow-hex",
    bg: "bg-brand-yellow-hex/10",
    items: [
      {
        q: "Where do products ship from?",
        a: "Our products are made on demand through Printify's global network of print providers. This means items ship from the facility closest to your location, reducing delivery times and carbon emissions. You'll receive a tracking number once your order is fulfilled.",
      },
      {
        q: "How does the store support MyTrueSiblings?",
        a: "Every purchase from the MyTrueSiblings store directly funds our mission. Proceeds support safe spaces, youth mentorship programs, community outreach, emotional wellness initiatives, disability inclusion programs, and operational costs that keep our platform free for everyone who needs support.",
      },
      {
        q: "Are products made on demand?",
        a: "Yes. We use Printify's print on demand dropshipping model. This means products are created only when you order, reducing waste and allowing us to offer a wide variety of items without holding inventory. Each item is made fresh just for you.",
      },
      {
        q: "Do you ship internationally?",
        a: "Yes! We ship to most countries worldwide. Shipping costs and delivery times vary by location. During checkout, you'll see available shipping options and estimated delivery dates for your specific destination.",
      },
      {
        q: "What is your return policy?",
        a: "We want you to love what you ordered. If something isn't right, contact us within 30 days of delivery. We handle damaged items, printing errors, and incorrect sizes on a case-by-case basis. Because each item is made on demand, we typically offer replacements rather than refunds for quality issues.",
      },
      {
        q: "Can I become an ambassador?",
        a: "Yes! Our ambassador program is for community members who want to spread the message of belonging. Ambassadors receive exclusive discounts, early access to new products, affiliate commissions, and special community recognition. Apply through our contact page or email ambassador@mytruesiblingsinitiative.org.",
      },
    ],
  },
  {
    icon: Gift,
    title: "Donations",
    color: "text-brand-red-hex",
    bg: "bg-brand-red-hex/10",
    items: [
      {
        q: "How are donations used?",
        a: "100% of donations go directly to funding our programs. This includes safe spaces operation, youth mentorship matching, adult emotional support, disability inclusion resources, community outreach initiatives, volunteer training, and platform safety technology. We publish annual impact reports with full financial transparency.",
      },
      {
        q: "Are donations refundable?",
        a: "Donations are generally not refundable, as they are immediately deployed to fund programs and support services. If an error occurred during processing, please contact us within 14 days and we will work to resolve it. We are committed to responsible stewardship of every contribution.",
      },
      {
        q: "Can I sponsor someone anonymously?",
        a: "Yes. Anonymous sponsorship is absolutely supported. You can designate your donation to support a specific program or general outreach without your name being shared. Many donors choose to sponsor anonymously, and we honor that preference completely.",
      },
      {
        q: "Are donations tax deductible?",
        a: "Tax deductibility depends on your country of residence and our nonprofit registration status in your jurisdiction. We provide detailed donation receipts for all contributions. Please consult a tax professional regarding deductibility in your specific location.",
      },
    ],
  },
  {
    icon: Heart,
    title: "Membership",
    color: "text-brand-pink-hex",
    bg: "bg-brand-pink-hex/10",
    items: [
      {
        q: "What membership options exist?",
        a: "MyTrueSiblings offers several membership tiers: Free Community Access (always free), Supporter Membership (monthly/annual with impact badges and perks), Ambassador Membership (for active community builders), and Corporate Memberships (for organizational partners). Each tier helps sustain our mission while offering meaningful benefits.",
      },
      {
        q: "Is support still free without membership?",
        a: "Absolutely. All emotional support, mentorship, safe conversations, and community access remain completely free regardless of membership status. Memberships are optional and exist for those who want to deepen their engagement and support our mission financially. No one will ever be denied support for not having a membership.",
      },
    ],
  },
  {
    icon: Accessibility,
    title: "Accessibility",
    color: "text-brand-teal",
    bg: "bg-brand-teal/10",
    items: [
      {
        q: "Is the platform accessible for disabilities?",
        a: "We are committed to WCAG 2.1 AA standards and continuously improving accessibility. Our platform supports screen readers, keyboard navigation, high contrast modes, and resizable text. We welcome feedback on how to make our platform more accessible for all users.",
      },
      {
        q: "Do you support neurodivergent users?",
        a: "Yes. We celebrate neurodiversity. Our platform is designed with neurodivergent users in mind — offering clear navigation, reduced visual clutter, option to customize communication styles, sensory-friendly modes, and community spaces specifically for neurodivergent siblings and their supporters.",
      },
      {
        q: "Will there be voice and visual accessibility support?",
        a: "Yes, these features are in active development. We are building voice-to-text communication options, sign language interpretation for support circles, visual storytelling alternatives, and customizable interface options. Our Inclusive Support Hub team is dedicated to making belonging accessible to everyone, regardless of how they communicate or interact.",
      },
    ],
  },
];

function AccordionItem({ item, isOpen, onClick }: { item: FAQItem; isOpen: boolean; onClick: () => void }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/50 bg-white transition-all hover:shadow-sm">
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-brand-light/50 md:px-6"
      >
        <span className="text-sm font-medium text-gray-800 md:text-base">{item.q}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-gray-400 transition-transform duration-300",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="border-t border-border/30 px-5 py-4 text-sm leading-relaxed text-gray-600 md:px-6 md:text-base">
              {item.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqContent() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState(sections[0]?.title || "");

  const toggleItem = (sectionIdx: number, itemIdx: number) => {
    const key = `${sectionIdx}-${itemIdx}`;
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isOpen = (sectionIdx: number, itemIdx: number) =>
    !!openSections[`${sectionIdx}-${itemIdx}`];

  const activeSection = sections.find((s) => s.title === activeTab) || sections[0];

  return (
    <>
      <section className="relative bg-gradient-to-br from-brand-teal/5 via-white to-brand-pink-hex/5 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-teal/10 px-4 py-1.5 text-sm font-medium text-brand-teal">
              <HelpCircle className="h-3.5 w-3.5" />
              Got Questions?
            </div>
            <h1 className="font-display text-4xl font-bold text-gray-900 md:text-5xl lg:text-6xl">
              Frequently Asked Questions
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Everything you need to know about MyTrueSiblings, our programs, shop, and how you can be part of the belonging movement.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="mb-10 flex flex-wrap gap-2">
              {sections.map((section) => {
                const Icon = section.icon;
                const active = activeTab === section.title;
                return (
                  <button
                    key={section.title}
                    onClick={() => setActiveTab(section.title)}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all",
                      active
                        ? "bg-brand-teal text-white shadow-md"
                        : "bg-brand-light text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {section.title}
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6 flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${activeSection.bg}`}>
                    <activeSection.icon className={`h-5 w-5 ${activeSection.color}`} />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-gray-900">
                    {activeSection.title}
                  </h2>
                </div>

                <div className="space-y-3">
                  {activeSection.items.map((item, idx) => (
                    <AccordionItem
                      key={idx}
                      item={item}
                      isOpen={isOpen(sections.indexOf(activeSection), idx)}
                      onClick={() => toggleItem(sections.indexOf(activeSection), idx)}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-16 rounded-3xl bg-gradient-to-br from-brand-teal/5 to-brand-pink-hex/5 p-8 text-center md:p-12">
              <Search className="mx-auto h-8 w-8 text-brand-teal" />
              <h3 className="mt-4 font-display text-xl font-bold text-gray-900">
                Still have questions?
              </h3>
              <p className="mt-2 text-gray-600">
                We are here to help. Reach out to our support team anytime.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-brand-teal px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-teal/90 hover:shadow-lg"
                >
                  Contact Us
                </a>
                <a
                  href="mailto:info@mytruesiblingsinitiative.org"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-border/50 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-all hover:border-brand-teal/30 hover:shadow-md"
                >
                  Email Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
