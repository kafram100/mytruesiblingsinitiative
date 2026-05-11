import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Mail, MapPin, PhoneCall } from "lucide-react";

import ContactForm from "@/components/ContactForm";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the My Siblings team: support, partnerships, press, and joining as a sibling.",
};

type ContactDetail = {
  icon: typeof Mail;
  title: string;
  lines: string[];
  href?: string;
};

const CONTACT_HERO_IMAGE =
  "https://images.pexels.com/photos/35752214/pexels-photo-35752214.png?cs=srgb&dl=pexels-akoonie-35752214.jpg&fm=jpg";

const contactDetails: ContactDetail[] = [
  {
    icon: Mail,
    title: "Email",
    lines: ["info@mytruesiblingsinitiative.org"],
    href: "mailto:info@mytruesiblingsinitiative.org",
  },
  {
    icon: MapPin,
    title: "Location",
    lines: ["Lagos, Nigeria | Chicago, USA | Global", "Operations"],
  },
  {
    icon: PhoneCall,
    title: "Phone",
    lines: ["+234 805 713 0004"],
    href: "tel:+2348057130004",
  },
];

export default function ContactPage() {
  return (
    <article className="bg-background">
      <header className="relative isolate overflow-hidden border-b border-border/50 bg-[linear-gradient(90deg,hsl(188_36%_95%),hsl(46_92%_93%)_52%,hsl(0_0%_99%))]">
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <Image
            src={CONTACT_HERO_IMAGE}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-20"
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,hsl(188_25%_92%/0.88),hsl(46_80%_90%/0.82)_52%,hsl(0_0%_97%/0.88))]"
        />
        <div className="container relative mx-auto max-w-6xl px-4 py-20 text-center md:py-24">
          <h1 className="text-4xl font-display font-bold tracking-tight text-foreground md:text-6xl">
            Get In Touch
          </h1>
          <p className="mx-auto mt-6 max-w-4xl rounded-2xl bg-background/82 px-4 py-3 text-lg leading-relaxed text-foreground shadow-sm backdrop-blur-sm md:text-xl">
            Whether you want to volunteer, partner, or just learn more,
            we&apos;d love to hear from you.
          </p>
        </div>
      </header>

      <section className="py-16 md:py-20">
        <div className="container mx-auto grid max-w-6xl gap-12 px-4 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-16">
          <div className="min-w-0 space-y-10 lg:pt-2">
            {contactDetails.map((item) => {
              const content = (
                <>
                  <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center text-[#08a6c2]">
                    <item.icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-2xl font-semibold leading-none text-foreground">
                      {item.title}
                    </p>
                    <div className="mt-3 space-y-1 text-lg leading-relaxed text-muted-foreground">
                      {item.lines.map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </div>
                  </div>
                </>
              );

              return item.href ? (
                <a
                  key={item.title}
                  href={item.href}
                  className="flex gap-4 rounded-3xl p-2 transition-colors hover:text-primary"
                >
                  {content}
                </a>
              ) : (
                <div key={item.title} className="flex gap-4 rounded-3xl p-2">
                  {content}
                </div>
              );
            })}
          </div>

          <div className="min-w-0 lg:pt-1">
            <ContactForm />
          </div>
        </div>

        <div className="container mx-auto mt-12 max-w-6xl px-4">
          <Button variant="secondary" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to home
            </Link>
          </Button>
        </div>
      </section>
    </article>
  );
}
