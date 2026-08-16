"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface ServiceCardImagesProps {
  images: string[];
  alt: string;
  sizes: string;
  /** Crossfade interval (ms). */
  intervalMs?: number;
  /** Stagger start so all cards don't tick in unison. */
  startOffsetMs?: number;
}

export function ServiceCardImages({
  images,
  alt,
  sizes,
  intervalMs = 4500,
  startOffsetMs = 0,
}: ServiceCardImagesProps) {
  const [index, setIndex] = useState(0);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    if (images.length <= 1) return;
    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reducedMotionRef.current) return;

    let intervalId: ReturnType<typeof setInterval> | null = null;
    const startTimeoutId = window.setTimeout(() => {
      intervalId = setInterval(() => {
        if (document.hidden) return;
        setIndex((i) => (i + 1) % images.length);
      }, intervalMs);
    }, startOffsetMs);

    return () => {
      window.clearTimeout(startTimeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [images.length, intervalMs, startOffsetMs]);

  if (images.length === 0) return null;

  return (
    <>
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className="service-img object-cover"
          quality={80}
          priority={i === 0}
          style={{
            opacity: i === index ? 1 : 0,
            transition: "opacity 900ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      ))}
    </>
  );
}
