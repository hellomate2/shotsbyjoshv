"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, Info } from "lucide-react";
import { Calendar } from "../ui/Calendar";
import { TIME_SLOTS } from "@/lib/constants";
import { parseLocalDate } from "@/lib/animations";

interface StepDateTimeProps {
  date: string | null;
  time: string | null;
  onSelectDate: (iso: string) => void;
  onSelectTime: (t: string) => void;
  onBack: () => void;
}

function formatTimeLabel(t: string) {
  const [hStr, mStr] = t.split(":");
  const h = Number(hStr);
  const ampm = h < 12 ? "AM" : "PM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${mStr} ${ampm}`;
}

export function StepDateTime({
  date,
  time,
  onSelectDate,
  onSelectTime,
  onBack,
}: StepDateTimeProps) {
  // Pull the list of already-booked slots so we can disable them.
  const [bookedSlots, setBookedSlots] = useState<
    Array<{ date: string; time: string }>
  >([]);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/bookings", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as {
          slots: Array<{ date: string; time: string }>;
        };
        if (!cancelled) setBookedSlots(data.slots ?? []);
      } catch {
        // Silent: if persistence isn't configured we just don't grey anything out.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const takenForDate = useMemo(() => {
    if (!date) return new Set<string>();
    return new Set(bookedSlots.filter((s) => s.date === date).map((s) => s.time));
  }, [bookedSlots, date]);
  return (
    <div>
      <button
        onClick={onBack}
        className="text-[0.7rem] tracking-[0.24em] uppercase text-ink/55 hover:text-ink inline-flex items-center gap-1.5 mb-6"
      >
        <ChevronLeft size={14} strokeWidth={1.6} /> Back
      </button>

      <div className="mb-7 md:mb-9">
        <p className="eyebrow text-ink/55 mb-3">Step 3 of 5</p>
        <h3 className="serif text-3xl md:text-4xl text-ink leading-tight">
          Pick a date &amp; time
        </h3>
        <p className="mt-3 text-ink/65 text-[14.5px] max-w-lg">
          Standard hours are 7 AM to 7 PM. Need something earlier or later? Add
          a note in your details. A $25 after-hours surcharge applies.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(320px,460px)_1fr] gap-7 lg:gap-10">
        <div>
          <Calendar selected={date} onSelect={onSelectDate} />
        </div>
        <div>
          <h4
            className="text-[0.7rem] tracking-[0.28em] uppercase text-ink/60 mb-4"
            style={{ fontWeight: 500 }}
          >
            {date
              ? `Available · ${parseLocalDate(date).toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}`
              : "Select a date first"}
          </h4>

          <div
            className={`grid grid-cols-3 sm:grid-cols-4 gap-2.5 transition-opacity ${
              date ? "opacity-100" : "opacity-40 pointer-events-none"
            }`}
          >
            {TIME_SLOTS.map((slot) => {
              const sel = time === slot;
              const taken = takenForDate.has(slot);
              return (
                <button
                  key={slot}
                  type="button"
                  disabled={taken}
                  onClick={() => !taken && onSelectTime(slot)}
                  aria-label={
                    taken
                      ? `${formatTimeLabel(slot)} is already booked`
                      : `Choose ${formatTimeLabel(slot)}`
                  }
                  className={`px-3 py-3 rounded-full text-[0.72rem] tracking-[0.18em] uppercase transition-all duration-400 ease-out-expo ${
                    sel
                      ? "bg-ink text-white"
                      : taken
                      ? "border border-ink/10 text-ink/30 cursor-not-allowed line-through"
                      : "border border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-white"
                  }`}
                  style={{ fontWeight: 500 }}
                >
                  {formatTimeLabel(slot)}
                </button>
              );
            })}
          </div>

          <div className="mt-7 flex items-start gap-3 p-4 bg-bone rounded-sm border border-ink/10">
            <Info
              size={16}
              strokeWidth={1.6}
              className="text-gold flex-shrink-0 mt-0.5"
            />
            <p className="text-ink/70 text-[13.5px] leading-relaxed">
              Sessions outside standard hours (7 AM – 7 PM) incur a{" "}
              <strong className="text-ink">$25 surcharge</strong>. Mention
              after-hours timing in your details on the next step.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
