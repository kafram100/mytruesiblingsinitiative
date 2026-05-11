"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

const slides = [
  {
    src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
    alt: "Group of friends sitting together in connection",
  },
  {
    src: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=80",
    alt: "Two people in warm conversation",
  },
  {
    src: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=1200&q=80",
    alt: "Community of people supporting each other",
  },
  {
    src: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=1200&q=80",
    alt: "People in a circle sharing stories",
  },
];

export default function ImageCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [isPaused, next]);

  return (
    <section
      aria-labelledby="carousel-heading"
      className="py-16 md:py-24 bg-muted/30"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <p className="text-brand-yellow font-semibold text-sm uppercase tracking-widest mb-3">
            Real moments
          </p>
          <h2
            id="carousel-heading"
            className="text-3xl md:text-4xl font-display font-bold mb-3"
          >
            Connection happens here
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Every day, siblings across the world show up for each other. These
            are the moments that remind us why we do this.
          </p>
        </div>

        <div
          className="relative max-w-5xl mx-auto overflow-hidden rounded-3xl shadow-xl"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          role="region"
          aria-roledescription="carousel"
          aria-label="Sibling connection moments"
        >
          <div className="relative aspect-[16/9] bg-muted">
            {slides.map((slide, i) => (
              <div
                key={slide.src}
                role="group"
                aria-roledescription="slide"
                aria-label={`Slide ${i + 1} of ${slides.length}`}
                aria-hidden={i !== current}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  i === current ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  className="object-cover"
                  priority={i === 0}
                />
              </div>
            ))}
          </div>

          <Button
            variant="secondary"
            size="icon"
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 bg-background/85 text-foreground shadow-lg backdrop-blur hover:bg-background hover:shadow-xl"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={next}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 bg-background/85 text-foreground shadow-lg backdrop-blur hover:bg-background hover:shadow-xl"
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </Button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2.5 rounded-full motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:scale-125 motion-safe:active:scale-95 ${
                  i === current
                    ? "w-8 bg-primary"
                    : "w-2.5 bg-background/60 hover:bg-background/80"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
