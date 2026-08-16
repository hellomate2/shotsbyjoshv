"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function LoadBar() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(el, { opacity: 0, duration: 0.4, delay: 0.2 });
      },
    });
    tl.to(el, { width: "32%", duration: 0.45, ease: "power2.out" })
      .to(el, { width: "62%", duration: 0.6, ease: "power2.out" })
      .to(el, { width: "88%", duration: 0.7, ease: "power2.out" })
      .to(el, {
        width: "100%",
        duration: 0.5,
        ease: "expo.out",
        delay: 0.1,
      });
    return () => {
      tl.kill();
    };
  }, []);
  return <div ref={ref} className="load-bar" aria-hidden />;
}
