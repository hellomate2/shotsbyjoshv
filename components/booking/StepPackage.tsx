"use client";

import { Check, ChevronLeft } from "lucide-react";
import { SERVICE_PACKAGES } from "@/lib/constants";
import type { PackageTier, Service } from "@/lib/types";

interface StepPackageProps {
  service: Service;
  selected: PackageTier | null;
  onSelect: (p: PackageTier) => void;
  onBack: () => void;
}

export function StepPackage({
  service,
  selected,
  onSelect,
  onBack,
}: StepPackageProps) {
  const pkgGroup = SERVICE_PACKAGES.find((p) => p.serviceId === service.id);
  const tiers = pkgGroup?.tiers ?? [];

  return (
    <div>
      <button
        onClick={onBack}
        className="text-[0.7rem] tracking-[0.24em] uppercase text-ink/55 hover:text-ink inline-flex items-center gap-1.5 mb-6"
      >
        <ChevronLeft size={14} strokeWidth={1.6} /> Back
      </button>
      <div className="mb-7 md:mb-9">
        <p className="eyebrow text-ink/55 mb-3">
          Step 2 of 5 ·{" "}
          <span className="text-gold normal-case tracking-[0.18em]">
            {service.name}
          </span>
        </p>
        <h3 className="serif text-3xl md:text-4xl text-ink leading-tight">
          Choose your package
        </h3>
        <p className="mt-3 text-ink/65 text-[14.5px] max-w-lg">
          Pick whichever fits the moment. Custom packages available on request.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        {tiers.map((t) => {
          const isSel = selected?.id === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelect(t)}
              className={`relative text-left p-7 rounded-sm bg-white transition-all duration-500 ease-out-expo focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                isSel
                  ? "ring-2 ring-gold shadow-[0_22px_60px_-26px_rgba(0,0,0,0.4)]"
                  : "ring-1 ring-ink/10 hover:ring-ink/30 hover:-translate-y-0.5"
              }`}
              aria-pressed={isSel}
            >
              {t.popular && (
                <span
                  className="absolute -top-2.5 left-7 inline-flex items-center text-[0.6rem] tracking-[0.28em] uppercase bg-gold text-ink px-3 py-1 rounded-full"
                  style={{ fontWeight: 600 }}
                >
                  Most Popular
                </span>
              )}
              {isSel && (
                <span className="absolute top-5 right-5 w-7 h-7 rounded-full bg-gold text-ink inline-flex items-center justify-center">
                  <Check size={14} strokeWidth={2.2} />
                </span>
              )}
              <p
                className="text-[0.62rem] tracking-[0.28em] uppercase text-ink/55 mb-3"
                style={{ fontWeight: 500 }}
              >
                {t.name}
              </p>
              <p className="serif text-4xl md:text-5xl text-ink leading-none mb-5">
                ${t.price.toLocaleString()}
              </p>
              <p className="text-ink/70 text-[14.5px] leading-relaxed">
                {t.description}
              </p>
              {t.addOnNote && (
                <p className="mt-3 text-[12.5px] text-gold tracking-wide">
                  {t.addOnNote}
                </p>
              )}
              <div className="mt-7 pt-5 border-t border-ink/10 flex items-center justify-between">
                <span className="text-[0.7rem] tracking-[0.24em] uppercase text-ink/60">
                  {isSel ? "Selected" : "Select"}
                </span>
                <svg
                  width="22"
                  height="10"
                  viewBox="0 0 22 10"
                  className="text-ink"
                >
                  <path
                    d="M0 5 H20 M16 1 L20 5 L16 9"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    fill="none"
                  />
                </svg>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
