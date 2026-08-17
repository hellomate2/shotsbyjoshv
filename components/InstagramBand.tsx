"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Instagram } from "lucide-react";
import { INSTAGRAM_URL } from "@/lib/constants";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// A tight, recognizable strip of recent posts that clicks through to
// Instagram. These live in /photos/insta/ — refresh them now and then so the
// strip matches what's actually on the feed.
const STRIP = [
  { src: "/photos/insta/ig-2026-08-16.jpg", alt: "Dachshund grinning at an outdoor event" },
  { src: "/photos/insta/ig-2026-06-17.jpg", alt: "Polo player mid-swing at Meadowbrook" },
  { src: "/photos/insta/ig-2026-07-18.jpg", alt: "Golden-hour portrait on the lawn" },
  { src: "/photos/insta/ig-2026-07-24b.jpg", alt: "Group portrait at a boutique event" },
];

export function InstagramBand() {
  const sectionRef = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current!.querySelectorAll(".ig-reveal"),
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.07,
          ease: "expo.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="ig-heading"
      className="relative bg-ink py-20 md:py-28 px-5 md:px-10 overflow-hidden"
    >
      <div className="max-w-[1320px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-10 md:mb-14">
          <div>
            <p className="eyebrow text-white/50 mb-4 ig-reveal opacity-0">
              <span className="inline-block w-8 h-px bg-gold/60 align-middle mr-3" />
              Instagram
            </p>
            <h2
              id="ig-heading"
              className="display text-white text-[clamp(2rem,4.5vw,3.6rem)] leading-[1.05] ig-reveal opacity-0"
            >
              Follow the{" "}
              <em style={{ fontStyle: "italic", color: "#C9A96E" }}>work.</em>
            </h2>
          </div>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ig-reveal opacity-0 inline-flex items-center gap-3 self-start md:self-auto px-6 py-3.5 border border-white/25 hover:border-gold text-white hover:text-gold rounded-sm transition-all duration-500 ease-out-expo group"
          >
            <Instagram size={17} strokeWidth={1.5} />
            <span className="text-[0.7rem] tracking-[0.26em] uppercase">
              @shotsbyjosh.v_llc
            </span>
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {STRIP.map((img) => (
            <a
              key={img.src}
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${img.alt} — view on Instagram`}
              className="ig-reveal opacity-0 group relative aspect-square overflow-hidden rounded-sm"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(min-width: 768px) 25vw, 50vw"
                quality={80}
                className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.06]"
              />
              <span className="absolute inset-0 bg-ink/0 group-hover:bg-ink/35 transition-colors duration-500 flex items-center justify-center">
                <Instagram
                  size={22}
                  strokeWidth={1.5}
                  className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
