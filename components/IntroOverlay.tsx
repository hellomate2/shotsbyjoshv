"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Logo } from "./Logo";

const SESSION_KEY = "sbjv-intro-played";

export function IntroOverlay() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const [skip, setSkip] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const played = sessionStorage.getItem(SESSION_KEY);
    // Skip the intro entirely for users with reduced-motion preference.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setSkip(played === "1" || reduced);
  }, []);

  useEffect(() => {
    if (skip === null) return;
    if (skip) return;
    if (!overlayRef.current || !logoRef.current || !ringRef.current) return;

    document.body.style.overflow = "hidden";
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        sessionStorage.setItem(SESSION_KEY, "1");
        if (overlayRef.current) overlayRef.current.style.pointerEvents = "none";
      },
    });

    // Preloader: ring draws, logo reveals briefly, then dissolves.
    // Total runtime ~2.4s — fast enough to feel premium, not so long
    // a first-time visitor on a slow connection bounces.
    tl.set(logoRef.current, { opacity: 0, scale: 0.92 })
      .to(ringRef.current, {
        strokeDashoffset: 0,
        duration: 0.7,
        ease: "power2.inOut",
      })
      .to(
        ringRef.current,
        { opacity: 0, scale: 1.4, duration: 0.4, ease: "power2.out" },
        "-=0.05"
      )
      .to(
        logoRef.current,
        { opacity: 1, scale: 1, duration: 0.6, ease: "expo.out" },
        "-=0.3"
      )
      .to(logoRef.current, {
        scale: 1.05,
        opacity: 0,
        duration: 0.7,
        ease: "expo.inOut",
        delay: 0.5,
      })
      .to(
        overlayRef.current,
        {
          opacity: 0,
          duration: 0.55,
          ease: "expo.inOut",
          onComplete: () => {
            if (overlayRef.current)
              overlayRef.current.style.display = "none";
          },
        },
        "-=0.3"
      );

    return () => {
      tl.kill();
      document.body.style.overflow = "";
    };
  }, [skip]);

  // Failsafe: if the animation engine stalls (throttled background tabs,
  // very slow devices), never leave the visitor trapped behind a black
  // overlay with scroll locked. Hard-dismiss shortly after the timeline's
  // expected ~2.4s runtime.
  useEffect(() => {
    if (skip !== false) return;
    const failsafe = window.setTimeout(() => {
      document.body.style.overflow = "";
      sessionStorage.setItem(SESSION_KEY, "1");
      if (overlayRef.current) overlayRef.current.style.display = "none";
    }, 4500);
    return () => window.clearTimeout(failsafe);
  }, [skip]);

  if (skip === null) {
    // SSR/initial — render the overlay invisible-but-present so flash is avoided
    return (
      <div
        aria-hidden
        className="fixed inset-0 z-[300] bg-ink"
        style={{ pointerEvents: "none" }}
      />
    );
  }
  if (skip) return null;

  return (
    <div
      ref={overlayRef}
      aria-hidden
      className="fixed inset-0 z-[300] flex items-center justify-center bg-ink"
    >
      {/* preloader ring */}
      <svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        className="absolute"
        style={{ overflow: "visible" }}
      >
        <circle
          ref={ringRef}
          cx="32"
          cy="32"
          r="28"
          fill="none"
          stroke="#C9A96E"
          strokeWidth="1.4"
          strokeDasharray="176"
          strokeDashoffset="176"
          strokeLinecap="round"
          transform="rotate(-90 32 32)"
        />
      </svg>
      <div ref={logoRef} className="relative">
        <Logo variant="light" size="xl" asLink={false} />
        <div className="mt-4 h-px w-16 mx-auto bg-gold/70" />
        <p
          className="mt-3 text-center text-white/55"
          style={{
            fontSize: "0.66rem",
            letterSpacing: "0.45em",
            textTransform: "uppercase",
          }}
        >
          Photography
        </p>
      </div>
    </div>
  );
}
