"use client";

import { useCallback, useRef } from "react";
import { gsap } from "gsap";
import { smoothScrollTo } from "@/lib/animations";

interface LogoProps {
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  asLink?: boolean;
}

/**
 * The ShotsByJoshV wordmark. Clicking 5 times rapidly triggers a "shutter
 * flash" easter egg.
 */
export function Logo({
  variant = "dark",
  size = "md",
  className = "",
  asLink = true,
}: LogoProps) {
  const clicksRef = useRef<number[]>([]);

  const triggerShutter = useCallback(() => {
    const flash = document.createElement("div");
    flash.style.cssText = `
      position: fixed; inset: 0; background: #000; z-index: 9999;
      pointer-events: none; opacity: 0;
    `;
    document.body.appendChild(flash);
    const tl = gsap.timeline({
      onComplete: () => flash.remove(),
    });
    tl.to(flash, { opacity: 1, duration: 0.05, ease: "power2.in" })
      .to(flash, { opacity: 0, duration: 0.18, ease: "power2.out" })
      .to(flash, { opacity: 0.85, duration: 0.04, ease: "power2.in" })
      .to(flash, { opacity: 0, duration: 0.35, ease: "power3.out" });
  }, []);

  const onClick = useCallback(
    (e: React.MouseEvent) => {
      const now = Date.now();
      clicksRef.current = clicksRef.current.filter((t) => now - t < 1500);
      clicksRef.current.push(now);
      if (clicksRef.current.length >= 5) {
        clicksRef.current = [];
        triggerShutter();
        e.preventDefault();
        return;
      }
      if (asLink) {
        e.preventDefault();
        smoothScrollTo("#top");
      }
    },
    [asLink, triggerShutter]
  );

  const sizeClasses = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-3xl md:text-4xl",
    xl: "text-5xl md:text-7xl",
  }[size];

  const colorClass = variant === "light" ? "text-white" : "text-ink";

  const content = (
    <span
      className={`inline-flex items-baseline gap-[0.1em] serif ${sizeClasses} ${colorClass} tracking-tight ${className}`}
      style={{ fontWeight: 500 }}
    >
      <span>Shots</span>
      <span className="opacity-60" style={{ fontWeight: 300 }}>
        By
      </span>
      <span>JoshV</span>
      <span
        className="ml-0.5"
        style={{
          color: "#C9A96E",
          fontStyle: "italic",
          fontWeight: 400,
        }}
      >
        .
      </span>
    </span>
  );

  if (!asLink) return content;
  return (
    <a
      href="#top"
      onClick={onClick}
      aria-label="ShotsByJoshV, return to top"
      className="inline-block leading-none focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
    >
      {content}
    </a>
  );
}
