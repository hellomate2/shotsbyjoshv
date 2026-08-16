"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { BookingProvider } from "./BookingContext";
import { IntroOverlay } from "./IntroOverlay";
import { Navbar } from "./Navbar";
import { FloatingBookNow } from "./FloatingBookNow";
import { BackToTop } from "./BackToTop";
import { ScrollProgress } from "./ScrollProgress";
import { LoadBar } from "./LoadBar";
import { BookingModal } from "./BookingModal";
import { CustomCursor } from "./CustomCursor";

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    // Subtle parallax on hero already; clean up on unmount
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <BookingProvider>
      <LoadBar />
      <ScrollProgress />
      <CustomCursor />
      <IntroOverlay />
      <Navbar />
      <main className="relative">{children}</main>
      <FloatingBookNow />
      <BackToTop />
      <BookingModal />
    </BookingProvider>
  );
}
