"use client";

import Image from "next/image";
import { ArrowRight, Heart } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function StoreHero() {
  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden">
      <Image
        src="https://images.pexels.com/photos/6969660/pexels-photo-6969660.jpeg?auto=compress&cs=tinysrgb&w=1920"
        alt="Black African woman shopping online with credit card and laptop"
        fill
        className="object-cover"
        priority
        sizes="100vw"
        style={{ filter: "brightness(0.7)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

      <div className="container relative z-10 mx-auto px-4 py-20 md:py-32">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm text-white backdrop-blur-sm">
            <Heart className="h-4 w-4 fill-brand-pink-hex text-brand-pink-hex" />
            <span>MyTrueSiblings Community Store</span>
          </div>

          <h1 className="font-display text-5xl font-bold leading-tight text-white md:text-7xl lg:text-8xl">
            Where Strangers
            <br />
            <span className="bg-gradient-to-r from-brand-yellow-hex via-brand-orange-hex to-brand-pink-hex bg-clip-text text-transparent">
              Become Siblings
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-200 md:text-xl">
            A global safe space for belonging, support, healing, mentorship, and
            human connection. Every purchase fuels the movement.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button
              asChild
              variant="primary"
              size="lg"
              className="rounded-full bg-brand-orange-hex px-8 py-6 text-base text-primary-foreground shadow-xl shadow-brand-orange-hex/30 hover:bg-brand-orange-hex/90 hover:shadow-2xl hover:shadow-brand-orange-hex/40"
            >
              <Link href="#collections">
                Shop The Movement
                <ArrowRight className="ml-1 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="rounded-full border-2 border-white/30 bg-white/10 px-8 py-6 text-base text-white backdrop-blur-sm hover:bg-white/20"
            >
              <Link href="/store/donate">
                <Heart className="h-5 w-5 fill-brand-pink-hex text-brand-pink-hex" />
                Support A Sibling
              </Link>
            </Button>
          </div>

          <div className="mt-12 flex items-center gap-8 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[
                  "https://images.pexels.com/photos/29037349/pexels-photo-29037349.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop",
                  "https://images.pexels.com/photos/12759725/pexels-photo-12759725.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop",
                  "https://images.pexels.com/photos/31666893/pexels-photo-31666893.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop",
                  "https://images.pexels.com/photos/17059392/pexels-photo-17059392.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop",
                ].map((url, i) => (
                  <Image
                    key={i}
                    src={url}
                    alt="African youth"
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full border-2 border-white/30 object-cover"
                  />
                ))}
              </div>
              <span>
                Join <strong className="text-white">12,000+</strong> siblings
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
