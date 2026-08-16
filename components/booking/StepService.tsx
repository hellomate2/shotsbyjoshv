"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { SERVICES } from "@/lib/constants";
import type { Service } from "@/lib/types";

interface StepServiceProps {
  selected: Service | null;
  onSelect: (s: Service) => void;
}

export function StepService({ selected, onSelect }: StepServiceProps) {
  return (
    <div>
      <div className="mb-7 md:mb-9">
        <p className="eyebrow text-ink/55 mb-3">Step 1 of 5</p>
        <h3 className="serif text-3xl md:text-4xl text-ink leading-tight">
          What are you looking for?
        </h3>
        <p className="mt-3 text-ink/65 text-[14.5px] max-w-lg">
          Pick the type of session that fits. You&apos;ll customize the package
          next.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {SERVICES.map((s) => {
          const isSel = selected?.id === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelect(s)}
              className={`relative text-left rounded-sm overflow-hidden transition-all duration-500 ease-out-expo focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                isSel
                  ? "ring-2 ring-gold scale-[1.02] shadow-[0_22px_60px_-26px_rgba(0,0,0,0.4)]"
                  : "ring-1 ring-ink/10 hover:ring-ink/30 hover:-translate-y-0.5"
              }`}
              aria-pressed={isSel}
            >
              <div className="relative aspect-[5/4] bg-bone overflow-hidden">
                <Image
                  src={s.image}
                  alt={s.name}
                  fill
                  sizes="(min-width: 1024px) 30vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out-expo"
                  style={{ transform: isSel ? "scale(1.06)" : undefined }}
                  quality={75}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                {isSel && (
                  <span className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gold text-ink inline-flex items-center justify-center">
                    <Check size={16} strokeWidth={2} />
                  </span>
                )}
              </div>
              <div className="bg-white p-5">
                <h4 className="serif text-xl text-ink leading-tight">
                  {s.name}
                </h4>
                <p
                  className="mt-2 text-[0.66rem] tracking-[0.28em] uppercase text-ink/55"
                  style={{ fontWeight: 500 }}
                >
                  From ${s.startingFrom}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
