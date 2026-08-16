"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const HOVER_SELECTOR =
  'a, button, [role="button"], input, textarea, select, .gallery-tile, .service-card';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth < 1024) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current;
    if (!dot) return;

    const move = (e: MouseEvent) => {
      gsap.to(dot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.25,
        ease: "power3.out",
      });
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as Element | null;
      if (t && t.closest(HOVER_SELECTOR)) {
        dot.classList.add("hover");
      } else {
        dot.classList.remove("hover");
      }
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", onOver);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", onOver);
    };
  }, []);

  return <div ref={dotRef} className="custom-cursor" aria-hidden />;
}
