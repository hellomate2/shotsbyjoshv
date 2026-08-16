/**
 * Reusable GSAP animation helpers. All functions assume gsap + ScrollTrigger
 * have been registered (see ClientWrapper).
 */
import { gsap } from "gsap";

/** Parse an ISO yyyy-mm-dd as a *local* date (avoids UTC midnight surprise). */
export function parseLocalDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function revealUp(
  el: gsap.TweenTarget,
  opts: { delay?: number; stagger?: number; trigger?: Element | null } = {}
) {
  return gsap.fromTo(
    el,
    { y: 36, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1.05,
      ease: "expo.out",
      stagger: opts.stagger ?? 0,
      delay: opts.delay ?? 0,
      scrollTrigger: opts.trigger
        ? {
            trigger: opts.trigger,
            start: "top 80%",
            toggleActions: "play none none reverse",
          }
        : undefined,
    }
  );
}

export function revealMask(
  el: HTMLElement,
  opts: { delay?: number; trigger?: Element | null } = {}
) {
  const inner = el.querySelector("span");
  if (!inner) return;
  return gsap.fromTo(
    inner,
    { yPercent: 110 },
    {
      yPercent: 0,
      duration: 1.1,
      ease: "expo.out",
      delay: opts.delay ?? 0,
      scrollTrigger: opts.trigger
        ? {
            trigger: opts.trigger,
            start: "top 80%",
            toggleActions: "play none none reverse",
          }
        : undefined,
    }
  );
}

export function smoothScrollTo(target: string | Element, offset = 0) {
  const el =
    typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return;
  const top =
    (el as HTMLElement).getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: "smooth" });
}
