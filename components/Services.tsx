"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SERVICES } from "@/lib/constants";
import { useBooking } from "./BookingContext";
import { ServiceCardImages } from "./ServiceCardImages";

// Avoid SSR layout-effect warning while still firing pre-paint on the client.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const { openModal } = useBooking();

  useIsoLayoutEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const eyebrow = sectionRef.current!.querySelector(".s-eyebrow");
      const heading = sectionRef.current!.querySelectorAll(
        ".s-heading .reveal-mask span"
      );
      const sub = sectionRef.current!.querySelector(".s-sub");
      const cards = sectionRef.current!.querySelectorAll(".service-card");

      // Hide initial state via gsap.set so reduced-motion users still see the content
      gsap.set(eyebrow, { y: 18, opacity: 0 });
      gsap.set(heading, { yPercent: 110 });
      gsap.set(sub, { y: 18, opacity: 0 });
      gsap.set(cards, { y: 60, opacity: 0 });

      gsap.to(eyebrow, {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: "expo.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
      });
      gsap.to(heading, {
        yPercent: 0,
        duration: 1.1,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      });
      gsap.to(sub, {
        y: 0,
        opacity: 1,
        duration: 0.9,
        delay: 0.2,
        ease: "expo.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      });
      gsap.to(cards, {
        y: 0,
        opacity: 1,
        duration: 1.0,
        stagger: 0.09,
        ease: "expo.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 65%" },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative bg-white py-24 md:py-36 px-5 md:px-10"
      aria-labelledby="services-heading"
    >
      <div className="max-w-[1320px] mx-auto">
        <div className="text-center mb-16 md:mb-20">
          <p className="s-eyebrow eyebrow opacity-0 text-ink/60 mb-5">
            <span className="inline-block w-8 h-px bg-ink/30 align-middle mr-3" />
            What I Offer
            <span className="inline-block w-8 h-px bg-ink/30 align-middle ml-3" />
          </p>
          <h2
            id="services-heading"
            className="s-heading display text-ink text-[clamp(2.4rem,6vw,5rem)] leading-[1.02]"
          >
            <span className="reveal-mask">
              <span>Services</span>
            </span>
          </h2>
          <p className="s-sub mt-6 max-w-xl mx-auto text-ink/65 leading-relaxed text-[15px] md:text-base">
            Portraits, prom and graduation, sports, events, and cars. Every
            shoot tailored, every frame intentional. Not seeing what you need?
            Pick <em className="text-ink">Custom Request</em>.
          </p>
        </div>

        {/* Split out "custom" so we can render it as a full-width banner at the
            bottom instead of leaving it alone on its own row. */}
        {(() => {
          const regularServices = SERVICES.filter((s) => s.id !== "custom");
          const customService = SERVICES.find((s) => s.id === "custom");
          return (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {regularServices.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => openModal(s)}
                    className="service-card text-left group rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                    aria-label={`Book ${s.name}`}
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-bone">
                      <ServiceCardImages
                        images={s.images && s.images.length > 0 ? s.images : [s.image]}
                        alt={s.name}
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        startOffsetMs={idx * 700}
                      />
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background:
                            "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)",
                        }}
                      />
                      <span
                        className="absolute top-5 left-5 inline-flex items-center text-[0.62rem] tracking-[0.32em] uppercase text-white/85 bg-black/35 backdrop-blur-sm px-3 py-1.5 rounded-full"
                        style={{ fontWeight: 500 }}
                      >
                        From ${s.startingFrom}
                      </span>
                    </div>

                    <div className="p-7 md:p-8">
                      <h3 className="serif text-2xl md:text-[1.7rem] text-ink leading-tight mb-2.5">
                        {s.name}
                      </h3>
                      <p className="text-ink/65 text-[14.5px] leading-relaxed mb-6 min-h-[3.2em]">
                        {s.short}
                      </p>
                      <div className="flex items-center justify-between pt-5 border-t border-ink/10">
                        <span className="text-ink text-[0.72rem] tracking-[0.28em] uppercase font-medium">
                          Book This
                        </span>
                        <svg
                          width="22"
                          height="10"
                          viewBox="0 0 22 10"
                          className="text-ink transition-transform duration-500 group-hover:translate-x-1.5"
                        >
                          <path
                            d="M0 5 H20 M16 1 L20 5 L16 9"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            fill="none"
                          />
                        </svg>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {customService && (
                <button
                  type="button"
                  onClick={() => openModal(customService)}
                  className="service-card mt-6 md:mt-8 w-full text-left group rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gold relative overflow-hidden"
                  aria-label="Book a custom session"
                  style={{ background: "#0A0A0A", border: 0 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_1.3fr] items-stretch">
                    <div className="p-8 md:p-12 lg:p-14 flex flex-col justify-center">
                      <p
                        className="text-[0.62rem] tracking-[0.32em] uppercase text-gold mb-4"
                        style={{ fontWeight: 500 }}
                      >
                        Don&apos;t see your shoot?
                      </p>
                      <h3 className="serif text-3xl md:text-4xl lg:text-5xl text-white leading-[1.05] mb-4">
                        Let&apos;s build something{" "}
                        <em style={{ fontStyle: "italic", color: "#C9A96E" }}>
                          custom.
                        </em>
                      </h3>
                      <p className="text-white/70 text-[15px] leading-relaxed mb-7 max-w-md">
                        Tell me what you have in mind. I&apos;ll put together a
                        package and confirm pricing before the shoot. Starting
                        at ${customService.startingFrom}.
                      </p>
                      <span className="inline-flex items-center gap-3 text-[0.72rem] tracking-[0.28em] uppercase text-gold">
                        Start a Custom Request
                        <svg
                          width="28"
                          height="10"
                          viewBox="0 0 28 10"
                          className="transition-transform duration-500 group-hover:translate-x-2"
                        >
                          <path
                            d="M0 5 H24 M20 1 L24 5 L20 9"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            fill="none"
                          />
                        </svg>
                      </span>
                    </div>
                    <div className="relative min-h-[260px] md:min-h-[320px]">
                      <Image
                        src={customService.image}
                        alt={customService.name}
                        fill
                        sizes="(min-width: 768px) 55vw, 100vw"
                        className="object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.04]"
                        quality={82}
                      />
                      <div
                        className="absolute inset-0 md:bg-gradient-to-r md:from-ink md:via-ink/40 md:to-transparent"
                        aria-hidden
                      />
                    </div>
                  </div>
                </button>
              )}
            </>
          );
        })()}
      </div>
    </section>
  );
}
