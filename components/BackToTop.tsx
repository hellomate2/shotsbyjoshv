"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [scrolled, setScrolled] = useState(false);
  const [footerInView, setFooterInView] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.95);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const io = new IntersectionObserver(
      ([entry]) => setFooterInView(entry.isIntersecting),
      { rootMargin: "0px 0px -80px 0px" }
    );
    io.observe(footer);
    return () => io.disconnect();
  }, []);

  const show = scrolled && !footerInView;

  const goTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={goTop}
      aria-label="Back to top"
      className={`fixed left-5 md:left-7 bottom-5 md:bottom-7 z-[100] w-11 h-11 rounded-full bg-white border border-ink/15 text-ink shadow-md hover:bg-ink hover:text-white transition-all duration-500 ease-out-expo inline-flex items-center justify-center ${
        show
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-3 pointer-events-none"
      }`}
      style={{
        marginBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <ArrowUp size={16} strokeWidth={1.6} />
    </button>
  );
}
