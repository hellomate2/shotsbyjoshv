"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ABOUT_IMAGE,
  ABOUT_IMAGE_FALLBACK,
  MEADOWBROOK_URL,
} from "@/lib/constants";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  // Use Josh's headshot if it's in /public/photos/about/josh.jpg, otherwise
  // fall back to the neutral stock image so we never render a broken tile.
  const [imgSrc, setImgSrc] = useState(ABOUT_IMAGE);

  useIsoLayoutEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current!.querySelector(".a-photo"),
        { x: -60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        }
      );
      gsap.fromTo(
        sectionRef.current!.querySelectorAll(".a-text > *"),
        { x: 40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1.0,
          stagger: 0.08,
          ease: "expo.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative bg-white py-24 md:py-36 px-5 md:px-10"
      aria-labelledby="about-heading"
    >
      <div className="max-w-[1320px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div className="a-photo opacity-0 relative aspect-[4/5] max-w-[520px] mx-auto w-full">
          <div className="absolute -left-3 -top-3 w-full h-full border border-gold/40 rounded-sm hidden md:block" />
          <div className="relative w-full h-full overflow-hidden rounded-sm img-lift">
            <Image
              src={imgSrc}
              alt="Josh, photographer"
              fill
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
              quality={85}
              onError={() => setImgSrc(ABOUT_IMAGE_FALLBACK)}
            />
          </div>
        </div>

        <div className="a-text">
          <p className="eyebrow text-ink/60 mb-5 opacity-0">
            <span className="inline-block w-8 h-px bg-ink/30 align-middle mr-3" />
            Behind the Lens
          </p>
          <h2
            id="about-heading"
            className="display text-ink text-[clamp(2.4rem,5vw,4.5rem)] leading-[1.02] mb-8 opacity-0"
          >
            About <em style={{ fontStyle: "italic", color: "#C9A96E" }}>Josh.</em>
          </h2>

          <p className="text-ink/75 leading-[1.85] text-[15.5px] md:text-[16.5px] mb-5 opacity-0">
            I&apos;m{" "}
            <strong className="text-ink font-medium">Joshua Velasquez</strong>,
            a freelance photographer based in{" "}
            <strong className="text-ink font-medium">Jericho, Long Island</strong>.
            I shoot portraits, sports, events, and cars. I&apos;m the official
            photographer for the Meadowbrook Country Polo Club, where I&apos;ve
            spent years learning to read fast-moving moments and slow them down
            into something you&apos;ll want to keep.
          </p>
          <p className="text-ink/75 leading-[1.85] text-[15.5px] md:text-[16.5px] mb-10 opacity-0">
            Every frame tells a story.{" "}
            <em className="text-ink" style={{ fontStyle: "italic" }}>
              Let me tell yours.
            </em>
          </p>

          {/* Meadowbrook badge */}
          <a
            href={MEADOWBROOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-0 inline-flex items-center gap-4 group p-4 pr-6 bg-bone hover:bg-white border border-ink/10 hover:border-gold/60 rounded-sm transition-all duration-500 ease-out-expo"
          >
            <span className="w-11 h-11 rounded-full bg-ink text-gold inline-flex items-center justify-center serif text-lg">
              M
            </span>
            <div className="flex flex-col">
              <span className="text-[0.6rem] tracking-[0.32em] uppercase text-ink/55 mb-0.5">
                Proud Photographer of
              </span>
              <span className="serif text-lg md:text-xl text-ink leading-none">
                Meadowbrook Country Polo Club{" "}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  className="inline-block ml-1 -mt-0.5 transition-transform duration-500 group-hover:translate-x-1"
                >
                  <path
                    d="M3 11 L11 3 M5 3 H11 V9"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    fill="none"
                  />
                </svg>
              </span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
