"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { HERO_IMAGES } from "@/lib/constants";
import { ChevronDown } from "lucide-react";
import { smoothScrollTo } from "@/lib/animations";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function Hero() {
  const slidesRef = useRef<HTMLDivElement[]>([]);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);

  useIsoLayoutEffect(() => {
    if (!slidesRef.current.length) return;
    const slides = slidesRef.current;

    // Reduced motion: show first slide, no rotation, no Ken Burns.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    slides.forEach((s, i) => {
      gsap.set(s, { autoAlpha: i === 0 ? 1 : 0, scale: 1 });
    });
    if (reduced) return;

    let current = 0;
    let kbTween: gsap.core.Tween | null = null;
    const startKenBurns = (i: number) => {
      kbTween?.kill();
      gsap.set(slides[i], { scale: 1, x: 0, y: 0 });
      kbTween = gsap.to(slides[i], {
        scale: 1.12,
        x: -8,
        y: -6,
        duration: 8,
        ease: "none",
      });
    };
    startKenBurns(0);

    let interval: number | null = null;
    const start = () => {
      if (interval) return;
      interval = window.setInterval(() => {
        const next = (current + 1) % slides.length;
        gsap.to(slides[current], { autoAlpha: 0, duration: 1.2, ease: "expo.inOut" });
        gsap.to(slides[next], { autoAlpha: 1, duration: 1.2, ease: "expo.inOut" });
        startKenBurns(next);
        current = next;
      }, 4000);
    };
    const stop = () => {
      if (interval) {
        window.clearInterval(interval);
        interval = null;
      }
    };
    start();
    // Don't waste CPU when the tab is in the background.
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stop();
      kbTween?.kill();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  // Tagline reveal (headline uses CSS via .hero-reveal class)
  useEffect(() => {
    if (!taglineRef.current) return;
    const t = gsap.fromTo(
      taglineRef.current,
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.0, delay: 1.1, ease: "expo.out" }
    );
    return () => {
      t.kill();
    };
  }, []);

  return (
    <section
      id="top"
      className="relative w-full h-[100svh] min-h-[640px] overflow-hidden bg-ink"
      aria-label="ShotsByJoshV photography"
    >
      {/* Slides */}
      <div className="absolute inset-0">
        {HERO_IMAGES.map((img, i) => (
          <div
            key={img.src}
            ref={(el) => {
              if (el) slidesRef.current[i] = el;
            }}
            className="absolute inset-0 will-change-transform"
            style={{ opacity: 0 }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
              quality={85}
            />
          </div>
        ))}
        {/* gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-white text-center px-6">
        <div
          className="mb-6 md:mb-8 reveal-fade opacity-0 flex flex-col items-center gap-2.5 md:gap-3"
          style={{
            fontSize: "0.7rem",
            letterSpacing: "0.45em",
            textTransform: "uppercase",
            animation: "fadeIn 1.2s 0.2s forwards",
          }}
        >
          <span className="inline-flex items-center">
            <span className="inline-block w-10 h-px bg-gold mr-3 align-middle" />
            ShotsByJoshV
            <span className="inline-block w-10 h-px bg-gold ml-3 align-middle" />
          </span>
          <span className="inline-flex items-center">
            <span className="inline-block w-10 h-px bg-gold mr-3 align-middle" />
            Jericho, Long Island NY
            <span className="inline-block w-10 h-px bg-gold ml-3 align-middle" />
          </span>
        </div>

        <h1
          ref={headlineRef}
          className="hero-reveal display text-white text-[clamp(2.6rem,9vw,7.5rem)] leading-[0.95] max-w-[14ch] m-0 font-normal"
        >
          <span className="reveal-mask">
            <span style={{ ["--rev-i" as string]: 0 }}>Capturing moments</span>
          </span>
          <br />
          <span className="reveal-mask italic" style={{ color: "#C9A96E" }}>
            <span style={{ ["--rev-i" as string]: 1 }}>that last forever.</span>
          </span>
        </h1>

        <p
          ref={taglineRef}
          className="mt-8 md:mt-10 max-w-md text-white/75 text-sm md:text-base leading-relaxed"
          style={{ opacity: 0 }}
        >
          Portraits, sports, events, and cars. Refined by years behind the lens
          of the moments that matter most.
        </p>
      </div>

      {/* Scroll indicator */}
      <button
        type="button"
        onClick={() => smoothScrollTo("#services", 60)}
        aria-label="Scroll to services"
        className="absolute left-1/2 bottom-7 md:bottom-10 -translate-x-1/2 z-10 text-white/80 hover:text-white transition-colors group"
      >
        <span
          className="block text-[0.62rem] tracking-[0.4em] uppercase mb-2"
          style={{ color: "rgba(255,255,255,0.7)" }}
        >
          Scroll
        </span>
        <ChevronDown
          size={22}
          strokeWidth={1.4}
          className="mx-auto animate-chevronBounce"
        />
      </button>

      <style jsx>{`
        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
}
