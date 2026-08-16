"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
import { Lightbox } from "./ui/Lightbox";
import { GALLERY } from "@/lib/constants";
import type { GalleryCategory } from "@/lib/types";

// Derive filter pills from the actual gallery so empty categories don't
// show up as buttons that lead to "no photos found" dead ends.
const ALL_CATEGORIES: GalleryCategory[] = [
  "Outdoor",
  "Sports",
  "Events",
  "Cars",
  "Prom",
  "Graduation",
];
const PRESENT: GalleryCategory[] = ALL_CATEGORIES.filter((c) =>
  GALLERY.some((g) => g.category === c)
);
const FILTERS: GalleryCategory[] = ["All", ...PRESENT];

export function Gallery() {
  const [filter, setFilter] = useState<GalleryCategory>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () =>
      filter === "All"
        ? GALLERY
        : GALLERY.filter((g) => g.category === filter),
    [filter]
  );

  // Scroll-triggered cascade reveal on the section heading + initial cards
  useIsoLayoutEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const eyebrow = sectionRef.current!.querySelector(".g-eyebrow");
      const heading = sectionRef.current!.querySelectorAll(
        ".g-heading .reveal-mask span"
      );
      const filters = sectionRef.current!.querySelector(".g-filters");
      const tiles = sectionRef.current!.querySelectorAll(".gallery-tile");

      gsap.set(eyebrow, { y: 18, opacity: 0 });
      gsap.set(heading, { yPercent: 110 });
      gsap.set(filters, { y: 16, opacity: 0 });
      gsap.set(tiles, { y: 50, scale: 0.96, opacity: 0 });

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
      gsap.to(filters, {
        y: 0,
        opacity: 1,
        duration: 0.9,
        delay: 0.18,
        ease: "expo.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 72%" },
      });
      gsap.to(tiles, {
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: "expo.out",
        stagger: { each: 0.06, from: "start" },
        scrollTrigger: { trigger: gridRef.current, start: "top 78%" },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // On filter change, animate the rearrangement
  useEffect(() => {
    if (!gridRef.current) return;
    const tiles = gridRef.current.querySelectorAll(".gallery-tile");
    gsap.fromTo(
      tiles,
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.04,
        ease: "expo.out",
      }
    );
  }, [filter]);

  // Image tilt effect
  const onTileMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rx = (py - 0.5) * -4; // tilt strength
    const ry = (px - 0.5) * 4;
    const inner = el.querySelector(".gallery-img") as HTMLElement | null;
    if (inner) {
      inner.style.transform = `scale(1.045) perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    }
  };
  const onTileLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const inner = e.currentTarget.querySelector(".gallery-img") as HTMLElement | null;
    if (inner) inner.style.transform = "";
  };

  const spanClass = (span?: string) => {
    if (span === "tall") return "row-span-2";
    if (span === "wide") return "col-span-2";
    return "";
  };

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      className="relative bg-bone py-24 md:py-36 px-5 md:px-10"
      aria-labelledby="portfolio-heading"
    >
      <div className="max-w-[1500px] mx-auto">
        <div className="text-center mb-12 md:mb-14">
          <p className="g-eyebrow eyebrow opacity-0 text-ink/60 mb-5">
            <span className="inline-block w-8 h-px bg-ink/30 align-middle mr-3" />
            Selected Work
            <span className="inline-block w-8 h-px bg-ink/30 align-middle ml-3" />
          </p>
          <h2
            id="portfolio-heading"
            className="g-heading display text-ink text-[clamp(2.4rem,6vw,5rem)] leading-[1.02]"
          >
            <span className="reveal-mask">
              <span>
                Portfolio{" "}
                <em
                  style={{
                    fontStyle: "italic",
                    color: "#C9A96E",
                    fontSize: "0.55em",
                    verticalAlign: "0.6em",
                    fontWeight: 400,
                  }}
                >
                  ({filtered.length})
                </em>
              </span>
            </span>
          </h2>
        </div>

        {/* Filters */}
        <div className="g-filters opacity-0 flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-10 md:mb-14">
          {FILTERS.map((f) => {
            const active = f === filter;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2.5 rounded-full text-[0.72rem] tracking-[0.22em] uppercase transition-all duration-400 ease-out-expo ${
                  active
                    ? "bg-ink text-white"
                    : "bg-white text-ink/70 hover:text-ink border border-ink/10 hover:border-ink/30"
                }`}
                style={{ fontWeight: 500 }}
              >
                {f}
              </button>
            );
          })}
        </div>

        {/* Masonry grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 auto-rows-[180px] md:auto-rows-[240px]"
        >
          {filtered.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setLightboxIndex(i)}
              onMouseMove={onTileMouseMove}
              onMouseLeave={onTileLeave}
              className={`gallery-tile rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${spanClass(
                img.span
              )}`}
              style={{ minHeight: 0 }}
              aria-label={`Open image: ${img.alt}`}
            >
              <div className="relative w-full h-full overflow-hidden">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                  className="gallery-img object-cover"
                  quality={80}
                />
                <div className="gallery-overlay" aria-hidden />
              </div>
            </button>
          ))}
        </div>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={filtered}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </section>
  );
}
