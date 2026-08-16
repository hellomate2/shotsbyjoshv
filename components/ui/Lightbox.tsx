"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { gsap } from "gsap";
import type { GalleryImage } from "@/lib/types";

interface LightboxProps {
  images: GalleryImage[];
  startIndex: number;
  onClose: () => void;
}

export function Lightbox({ images, startIndex, onClose }: LightboxProps) {
  const [index, setIndex] = useState(startIndex);
  const overlayRef = useRef<HTMLDivElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const total = images.length;
  const cur = images[index];

  const next = useCallback(
    () => setIndex((i) => (i + 1) % total),
    [total]
  );
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + total) % total),
    [total]
  );

  // Open animation
  useEffect(() => {
    if (!overlayRef.current) return;
    document.body.style.overflow = "hidden";
    gsap.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: "expo.out" }
    );
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Slide transition on index change
  useEffect(() => {
    if (!slideRef.current) return;
    gsap.fromTo(
      slideRef.current,
      { opacity: 0, scale: 0.985 },
      { opacity: 1, scale: 1, duration: 0.55, ease: "expo.out" }
    );
  }, [index]);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, next, prev]);

  const handleClose = () => {
    if (!overlayRef.current) {
      onClose();
      return;
    }
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: "expo.in",
      onComplete: onClose,
    });
  };

  // Swipe support
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) next();
      else prev();
    }
    touchStart.current = null;
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[210] bg-black/95 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Top bar */}
      <div className="absolute top-0 inset-x-0 px-5 md:px-10 py-5 flex items-center justify-between text-white/85 z-10">
        <span
          className="text-[0.7rem] tracking-[0.32em] uppercase"
          style={{ fontWeight: 500 }}
        >
          {cur.category} · {String(index + 1).padStart(2, "0")} /{" "}
          {String(total).padStart(2, "0")}
        </span>
        <button
          onClick={handleClose}
          aria-label="Close lightbox"
          className="w-11 h-11 inline-flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
        >
          <X size={22} strokeWidth={1.4} />
        </button>
      </div>

      {/* Prev / Next */}
      <button
        onClick={prev}
        aria-label="Previous image"
        className="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 md:w-14 md:h-14 rounded-full text-white hover:bg-white/10 inline-flex items-center justify-center transition-all"
      >
        <ChevronLeft size={28} strokeWidth={1.3} />
      </button>
      <button
        onClick={next}
        aria-label="Next image"
        className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 md:w-14 md:h-14 rounded-full text-white hover:bg-white/10 inline-flex items-center justify-center transition-all"
      >
        <ChevronRight size={28} strokeWidth={1.3} />
      </button>

      {/* Image */}
      <div
        ref={slideRef}
        className="relative w-[92vw] h-[78vh] md:w-[78vw] md:h-[80vh] max-w-[1500px]"
      >
        <Image
          src={cur.src}
          alt={cur.alt}
          fill
          sizes="92vw"
          className="object-contain"
          priority
          quality={90}
        />
      </div>

      {/* Caption */}
      <div className="absolute bottom-0 inset-x-0 px-6 pb-6 text-center">
        <p className="text-white/70 text-[13.5px] max-w-2xl mx-auto leading-relaxed">
          {cur.alt}
        </p>
      </div>

      {/* backdrop click closes */}
      <button
        aria-label="Close"
        onClick={handleClose}
        className="absolute inset-0 -z-10 cursor-zoom-out"
        tabIndex={-1}
      />
    </div>
  );
}
