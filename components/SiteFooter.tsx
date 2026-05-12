import Image from "next/image";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  Twitter,
  Youtube,
  type LucideIcon,
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FOOTER_LOGO } from "@/lib/footer-logo";

/** Footer logo stays readable without stretching the cleaned mark full-width. */
const FOOTER_LOGO_CLASS =
  "h-auto w-auto max-w-full max-h-24 object-contain object-left sm:max-h-28 md:max-h-32 lg:max-h-36 xl:max-h-36";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

const navigation = [
  { label: "Home", href: "/" },
  { label: "About MTSI", href: "/about" },
  { label: "Programs", href: "/programs" },
  { label: "Match A Sibling", href: "/match" },
  { label: "Volunteer", href: "/volunteer" },
  { label: "Save A Sibling", href: "/save-a-sibling" },
  { label: "Donate", href: "/save-a-sibling" },
  { label: "Impact & Reports", href: "/corporate-partnership" },
  { label: "Stories", href: "/#testimonials" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

const programLinks = [
  { label: "School Outreach", href: "/programs#school-outreach" },
  { label: "Religious Outreach", href: "/programs#religious-outreach" },
  { label: "Age Stage Support", href: "/programs#age-stage-support" },
  { label: "Emotional Healing", href: "/programs#emotional-healing" },
  { label: "Adopt A Sibling", href: "/save-a-sibling" },
  { label: "Sponsor A Sibling", href: "/save-a-sibling#monthly-sponsor" },
  { label: "Sibling Connect", href: "/sibling-connect" },
  { label: "Adult Safe Place (18+)", href: "/adult-safe-place" },
  { label: "Inclusive Support Hub", href: "/inclusive-support-hub" },
  { label: "SDG Framework", href: "/contact" },
  { label: "Membership", href: "/match" },
  { label: "Corporate Partnership", href: "/corporate-partnership" },
];

const socialPlatforms: {
  label: string;
  href: string;
  Icon: LucideIcon | typeof TikTokIcon;
}[] = [
  { label: "Facebook", href: "https://www.facebook.com/mytruesiblings", Icon: Facebook },
  { label: "Instagram", href: "https://www.instagram.com/mytruesiblings", Icon: Instagram },
  { label: "X (Twitter)", href: "https://x.com/mytruesiblings", Icon: Twitter },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/mytruesiblings", Icon: Linkedin },
  { label: "YouTube", href: "https://www.youtube.com/@mytruesiblings", Icon: Youtube },
  { label: "TikTok", href: "https://www.tiktok.com/@mytruesiblings", Icon: TikTokIcon },
  { label: "WhatsApp", href: "/contact", Icon: MessageCircle },
  {
    label: "Telegram",
    href: "https://t.me/mytruesiblings",
    Icon: Send,
  },
];

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#1a1d20] text-zinc-100">
      <div className="container mx-auto px-4 py-14 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {/* Column 1: logo links home; copy below is not interactive */}
          <div className="min-w-0 max-w-sm md:max-w-lg lg:max-w-xl xl:max-w-none">
            <Link
              href="/"
              className="block w-full max-w-full rounded-none p-0 text-inherit shadow-none ring-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow/75 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1d20]"
            >
              <Image
                src={FOOTER_LOGO.src}
                alt="My True Siblings logo, linking to home"
                width={FOOTER_LOGO.width}
                height={FOOTER_LOGO.height}
                sizes="(max-width: 640px) 180px, (max-width: 1024px) 220px, 260px"
                className={`${FOOTER_LOGO_CLASS} block`}
              />
            </Link>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-zinc-300">
              Turning loneliness into belonging. A global mentorship and
              emotional healing network connecting vulnerable individuals with
              trained volunteer siblings.
            </p>
            <p className="mt-6 max-w-xl text-sm italic leading-relaxed text-zinc-200/95">
              &ldquo;No child, no teen, no adult should grow up without
              guidance, love, or someone to call a sibling.&rdquo;
            </p>
          </div>

          {/* Column 2: navigation */}
          <nav aria-label="Footer navigation" className="min-w-0">
            <h2 className="font-display text-xs font-bold uppercase tracking-[0.28em] text-white">
              Navigation
            </h2>
            <ul className="mt-5 flex flex-col gap-2.5 text-sm text-zinc-300">
              {navigation.map((item, idx) => (
                <li key={`footer-nav:${idx}:${item.label}`}>
                  <Link
                    href={item.href}
                    className="transition hover:text-white focus-visible:outline-none focus-visible:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 3: programs */}
          <nav aria-label="Programs" className="min-w-0">
            <h2 className="font-display text-xs font-bold uppercase tracking-[0.28em] text-white">
              Programs
            </h2>
            <ul className="mt-5 flex flex-col gap-2.5 text-sm text-zinc-300">
              {programLinks.map((item, idx) => (
                <li key={`footer-programs:${idx}:${item.label}`}>
                  <Link
                    href={item.href}
                    className="transition hover:text-white focus-visible:outline-none focus-visible:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 4: contact & legal & social */}
          <div className="min-w-0">
            <h2 className="font-display text-xs font-bold uppercase tracking-[0.28em] text-white">
              Contact &amp; legal
            </h2>
            <div className="mt-5 space-y-4 text-sm">
              <a
                href="mailto:info@mytruesiblingsinitiative.org"
                className="flex items-start gap-2.5 text-brand-yellow/90 transition hover:text-brand-yellow"
              >
                <Mail className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <span>info@mytruesiblingsinitiative.org</span>
              </a>
              <p className="flex items-start gap-2.5 text-brand-yellow/90">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <span>Lagos, Nigeria · Chicago, USA | Global</span>
              </p>
            </div>
            <ul className="mt-6 flex flex-col gap-2 text-sm text-zinc-400">
              <li>
                <Link
                  href="/about#safeguarding"
                  className="transition hover:text-white focus-visible:outline-none focus-visible:underline"
                >
                  Safeguarding policy
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="transition hover:text-white focus-visible:outline-none focus-visible:underline"
                >
                  Privacy policy
                </Link>
              </li>
            </ul>

            <h3 className="mt-8 font-display text-xs font-bold uppercase tracking-[0.28em] text-white">
              Connect with us
            </h3>
            <div className="mt-4 flex max-w-[220px] flex-wrap gap-2.5">
              {socialPlatforms.map(({ label, href, Icon }, idx) => {
                const isExternal = href.startsWith("http");
                const className =
                  "flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow/70";
                const iconClass = "h-[18px] w-[18px]";
                const link = isExternal ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={className}
                  >
                    <Icon className={iconClass} aria-hidden />
                  </a>
                ) : (
                  <Link
                    href={href}
                    aria-label={label}
                    className={className}
                  >
                    <Icon className={iconClass} aria-hidden />
                  </Link>
                );
                return (
                  <Tooltip key={`social:${idx}:${label}`}>
                    <TooltipTrigger asChild>{link}</TooltipTrigger>
                    <TooltipContent>{label}</TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-10 text-center">
          <h3 className="font-display text-lg font-bold text-white">
            Get the MyTrueSiblings App
          </h3>
          <p className="mt-2 text-sm text-zinc-300">
            Carry your safe space in your pocket. Available on iOS and Android.
          </p>
          <div className="mt-5 flex items-center justify-center gap-4">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download on the App Store"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              App Store
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Get it on Google Play"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 0 1 0 1.732l-2.807 1.626L15.206 12l2.492-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/>
              </svg>
              Google Play
            </a>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-8 text-center text-xs text-zinc-500">
          <p>
            &copy; {year} My True Siblings Initiative. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
