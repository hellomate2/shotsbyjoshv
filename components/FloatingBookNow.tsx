"use client";

import { useEffect, useRef, useState } from "react";
import { Camera } from "lucide-react";
import { gsap } from "gsap";
import { useBooking } from "./BookingContext";

export function FloatingBookNow() {
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const [footerInView, setFooterInView] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const { open: modalOpen, openModal } = useBooking();

  // Show after scrolling past the hero.
  useEffect(() => {
    const onScroll = () => {
      setScrolledPastHero(window.scrollY > window.innerHeight * 0.85);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hide when the footer enters the viewport so the button never overlaps
  // copyright / contact text. Also hide when the booking modal is open.
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const io = new IntersectionObserver(
      ([entry]) => setFooterInView(entry.isIntersecting),
      // Trigger a little before the footer is fully in view.
      { rootMargin: "0px 0px -80px 0px" }
    );
    io.observe(footer);
    return () => io.disconnect();
  }, []);

  const show = scrolledPastHero && !footerInView && !modalOpen;

  // Magnetic — only when visible, to avoid wasting RAF cycles.
  useEffect(() => {
    if (!show) return;
    const btn = btnRef.current;
    if (!btn) return;
    const onMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < 130) {
        gsap.to(btn, {
          x: dx * 0.22,
          y: dy * 0.22,
          duration: 0.5,
          ease: "expo.out",
        });
      } else {
        gsap.to(btn, { x: 0, y: 0, duration: 0.55, ease: "expo.out" });
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      gsap.to(btn, { x: 0, y: 0, duration: 0.3, ease: "expo.out" });
    };
  }, [show]);

  return (
    <div
      className={`fixed bottom-5 right-5 md:bottom-7 md:right-7 z-[100] transition-all duration-500 ease-out-expo ${
        show
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-3 pointer-events-none"
      }`}
      style={{
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <button
        ref={btnRef}
        onClick={() => openModal()}
        aria-label="Book a session"
        className="fab-pulse relative inline-flex items-center gap-2.5 pl-5 pr-6 py-4 rounded-full bg-ink text-white hover:bg-charcoalHover hover:shadow-[0_18px_50px_-18px_rgba(201,169,110,0.7)] transition-all duration-500 ease-out-expo group"
        style={{ fontWeight: 500 }}
      >
        <span className="w-9 h-9 rounded-full bg-white/8 inline-flex items-center justify-center transition-transform duration-500 group-hover:rotate-[-10deg]">
          <Camera size={16} strokeWidth={1.6} className="text-gold" />
        </span>
        <span className="text-[0.74rem] tracking-[0.24em] uppercase">
          Book Now
        </span>
      </button>
    </div>
  );
}
