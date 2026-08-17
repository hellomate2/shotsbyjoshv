"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Plus } from "lucide-react";
import { FAQS } from "@/lib/constants";
import { useBooking } from "./BookingContext";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function Faq() {
  const sectionRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(0);
  const { openModal } = useBooking();

  useIsoLayoutEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current!.querySelectorAll(".faq-reveal"),
        { y: 32, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.06,
          ease: "expo.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="relative bg-bone py-24 md:py-36 px-5 md:px-10"
      aria-labelledby="faq-heading"
    >
      <div className="max-w-[1320px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20 items-start">
        {/* Left: heading */}
        <div className="lg:sticky lg:top-28">
          <p className="eyebrow text-ink/60 mb-5 faq-reveal opacity-0">
            <span className="inline-block w-8 h-px bg-ink/30 align-middle mr-3" />
            Good to Know
          </p>
          <h2
            id="faq-heading"
            className="display text-ink text-[clamp(2.4rem,5vw,4.5rem)] leading-[1.02] mb-6 faq-reveal opacity-0"
          >
            Questions,{" "}
            <em style={{ fontStyle: "italic", color: "#C9A96E" }}>answered.</em>
          </h2>
          <p className="text-ink/70 leading-[1.85] text-[15.5px] md:text-[16.5px] max-w-md faq-reveal opacity-0">
            Everything most clients ask before booking. Anything else, just
            reach out. Ready when you are:
          </p>
          <button
            onClick={() => openModal()}
            className="mt-8 inline-flex items-center gap-2 px-7 py-3.5 bg-ink text-white text-[0.7rem] tracking-[0.28em] uppercase hover:bg-gold hover:text-ink transition-all duration-500 ease-out-expo rounded-sm faq-reveal opacity-0"
          >
            Book a Session
          </button>
        </div>

        {/* Right: accordion */}
        <div>
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={f.question}
                className="faq-reveal opacity-0 border-b border-ink/10 first:border-t"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  className="w-full flex items-center justify-between gap-6 py-6 md:py-7 text-left group"
                >
                  <span className="serif text-xl md:text-2xl text-ink leading-snug group-hover:text-gold transition-colors duration-400">
                    {f.question}
                  </span>
                  <Plus
                    size={18}
                    strokeWidth={1.4}
                    className={`shrink-0 text-ink/50 transition-transform duration-500 ease-out-expo ${
                      isOpen ? "rotate-45 text-gold" : ""
                    }`}
                  />
                </button>
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-hidden={!isOpen}
                  className="grid transition-all duration-500 ease-out-expo"
                  style={{
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <div className="overflow-hidden">
                    <p className="pb-7 pr-10 text-ink/70 leading-[1.85] text-[14.5px] md:text-[15.5px] max-w-2xl">
                      {f.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
