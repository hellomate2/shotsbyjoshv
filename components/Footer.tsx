"use client";

import { Instagram, Mail, MapPin } from "lucide-react";
import { Logo } from "./Logo";
import { useBooking } from "./BookingContext";
import { CONTACT_EMAIL, INSTAGRAM_URL, MEADOWBROOK_URL } from "@/lib/constants";
import { smoothScrollTo } from "@/lib/animations";

export function Footer() {
  const { openModal } = useBooking();

  const links = [
    { label: "Services", href: "#services" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "About", href: "#about" },
  ];

  return (
    <footer className="bg-ink text-white pt-20 pb-10 px-5 md:px-10">
      <div className="max-w-[1320px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10 pb-14 border-b border-white/10">
          {/* Left */}
          <div>
            <div className="text-white">
              <Logo variant="light" size="md" asLink={false} />
            </div>
            <p className="mt-5 text-white/60 text-[14.5px] leading-relaxed max-w-xs">
              Capturing moments that last forever. Long Island, NY.
            </p>
            <div className="mt-7 flex items-center gap-2">
              <span
                className="text-[0.62rem] tracking-[0.32em] uppercase text-gold"
                style={{ fontWeight: 500 }}
              >
                Official Photographer ·{" "}
                <a
                  href={MEADOWBROOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Meadowbrook Polo
                </a>
              </span>
            </div>
          </div>

          {/* Center */}
          <div className="md:text-center">
            <h4
              className="text-[0.62rem] tracking-[0.32em] uppercase text-white/55 mb-5"
              style={{ fontWeight: 500 }}
            >
              Navigate
            </h4>
            <ul className="space-y-3">
              {links.map((l) => (
                <li key={l.href}>
                  <button
                    onClick={() => smoothScrollTo(l.href, 80)}
                    className="serif text-xl text-white/90 hover:text-gold transition-colors"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => openModal()}
                  className="serif text-xl text-gold hover:text-white transition-colors"
                >
                  Book Now →
                </button>
              </li>
            </ul>
          </div>

          {/* Right */}
          <div className="md:text-right">
            <h4
              className="text-[0.62rem] tracking-[0.32em] uppercase text-white/55 mb-5"
              style={{ fontWeight: 500 }}
            >
              Connect
            </h4>
            <ul className="space-y-4">
              <li className="flex md:justify-end items-center gap-2.5 text-white/85">
                <MapPin size={15} strokeWidth={1.5} className="text-gold" />
                <span className="text-[14.5px]">Long Island, New York</span>
              </li>
              <li className="flex md:justify-end items-center gap-2.5 text-white/85">
                <Mail size={15} strokeWidth={1.5} className="text-gold" />
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-[14.5px] hover:text-gold transition-colors"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li className="flex md:justify-end items-center gap-2.5 text-white/85">
                <Instagram size={15} strokeWidth={1.5} className="text-gold" />
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[14.5px] hover:text-gold transition-colors"
                >
                  @shotsbyjosh.v_llc
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-3 text-white/45 text-[12.5px]">
          <p>© {new Date().getFullYear()} ShotsByJoshV. All rights reserved.</p>
          <p
            className="tracking-[0.28em] uppercase text-[0.62rem]"
            style={{ fontWeight: 500 }}
          >
            Crafted with care · Long Island, NY
          </p>
        </div>
      </div>
    </footer>
  );
}
