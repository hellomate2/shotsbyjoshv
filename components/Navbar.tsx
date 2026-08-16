"use client";

import { useEffect, useRef, useState } from "react";
import { Instagram, Menu, X } from "lucide-react";
import { gsap } from "gsap";
import { Logo } from "./Logo";
import { useBooking } from "./BookingContext";
import { INSTAGRAM_URL } from "@/lib/constants";
import { smoothScrollTo } from "@/lib/animations";

const NAV_LINKS = [
  { label: "Home", href: "#top" },
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "About", href: "#about" },
];

export function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openModal } = useBooking();
  const bookBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const heroH = window.innerHeight * 0.85;
      setScrolled(window.scrollY > heroH);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Magnetic effect on Book Now button — disabled when modal is open or mobile drawer is open
  const { open: modalOpen } = useBooking();
  useEffect(() => {
    if (modalOpen || mobileOpen) return;
    const btn = bookBtnRef.current;
    if (!btn) return;
    const onMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < 110) {
        gsap.to(btn, {
          x: dx * 0.25,
          y: dy * 0.25,
          duration: 0.45,
          ease: "expo.out",
        });
      } else {
        gsap.to(btn, { x: 0, y: 0, duration: 0.55, ease: "expo.out" });
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [modalOpen, mobileOpen]);

  // Lock body when mobile drawer open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleNav = (href: string) => {
    setMobileOpen(false);
    if (href === "#top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      smoothScrollTo(href, 80);
    }
  };

  return (
    <>
      <header
        ref={navRef}
        className={`fixed top-0 inset-x-0 z-[120] transition-all duration-500 ease-out-expo ${
          scrolled ? "glass" : "bg-transparent"
        }`}
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="max-w-[1480px] mx-auto px-5 md:px-10 h-[68px] md:h-[80px] flex items-center justify-between">
          <div className={scrolled ? "text-ink" : "text-white"}>
            <Logo variant={scrolled ? "dark" : "light"} size="md" />
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-10">
            {NAV_LINKS.map((l) => (
              <button
                key={l.href}
                onClick={() => handleNav(l.href)}
                className={`link-underline text-[0.78rem] tracking-[0.22em] uppercase transition-colors duration-500 ${
                  scrolled ? "text-ink hover:text-charcoal" : "text-white/90 hover:text-white"
                }`}
              >
                {l.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3 md:gap-5">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram, @shotsbyjosh.v_llc"
              className={`hidden sm:inline-flex transition-colors duration-500 ${
                scrolled ? "text-ink hover:text-gold" : "text-white hover:text-gold"
              }`}
            >
              <Instagram size={20} strokeWidth={1.5} />
            </a>

            <span className="magnetic hidden sm:inline-block">
              <button
                ref={bookBtnRef}
                onClick={() => openModal()}
                className={`btn ${
                  scrolled ? "btn-primary" : "btn-outline"
                } ${scrolled ? "" : "!border-white !text-white hover:!bg-white hover:!text-ink"}`}
              >
                Book Now
              </button>
            </span>

            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
              className={`lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                scrolled
                  ? "text-ink hover:bg-ink/5"
                  : "text-white hover:bg-white/10"
              }`}
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-[140] lg:hidden transition-all duration-500 ease-out-expo ${
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          aria-hidden
          onClick={() => setMobileOpen(false)}
          className={`absolute inset-0 bg-black/50 transition-opacity duration-500 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          className={`absolute top-0 right-0 h-full w-[88vw] max-w-[420px] bg-white shadow-2xl flex flex-col transition-transform duration-500 ease-out-expo ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-6 h-[68px] border-b border-ink/10">
            <Logo variant="dark" size="sm" asLink={false} />
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="w-10 h-10 inline-flex items-center justify-center rounded-full hover:bg-ink/5"
            >
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>
          <nav className="flex-1 px-6 py-10 flex flex-col gap-1">
            {NAV_LINKS.map((l, i) => (
              <button
                key={l.href}
                onClick={() => handleNav(l.href)}
                className="text-left py-4 serif text-3xl text-ink hover:text-gold transition-colors border-b border-ink/5"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {l.label}
              </button>
            ))}
          </nav>
          <div className="p-6 border-t border-ink/10 flex flex-col gap-4">
            <button
              onClick={() => {
                setMobileOpen(false);
                openModal();
              }}
              className="btn btn-primary w-full"
            >
              Book Now
            </button>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 text-ink/70 hover:text-ink text-sm tracking-[0.2em] uppercase"
            >
              <Instagram size={16} strokeWidth={1.5} /> @shotsbyjosh.v_llc
            </a>
          </div>
        </aside>
      </div>
    </>
  );
}
