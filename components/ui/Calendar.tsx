"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarProps {
  selected: string | null; // ISO yyyy-mm-dd
  onSelect: (iso: string) => void;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}
function isoFor(y: number, m: number, d: number) {
  return `${y}-${pad2(m + 1)}-${pad2(d)}`;
}
function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function Calendar({ selected, onSelect }: CalendarProps) {
  // Re-read "today" every render so the calendar stays accurate even if
  // the page is left open across midnight. Cheap (one Date allocation).
  const today = startOfDay(new Date());
  const [view, setView] = useState({
    y: today.getFullYear(),
    m: today.getMonth(),
  });

  // Tick once per hour so dates that *become* past while the page is open
  // (i.e. the user opened the page yesterday) get disabled automatically.
  const [, forceTick] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => forceTick((n) => n + 1), 60 * 60 * 1000);
    return () => window.clearInterval(id);
  }, []);

  const monthFirst = new Date(view.y, view.m, 1);
  const startOffset = monthFirst.getDay(); // 0..6
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();

  const cells: { d: number | null }[] = [];
  for (let i = 0; i < startOffset; i++) cells.push({ d: null });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ d });
  while (cells.length % 7 !== 0) cells.push({ d: null });

  const prevMonth = () => {
    setView((v) => {
      const m = v.m - 1;
      return m < 0 ? { y: v.y - 1, m: 11 } : { y: v.y, m };
    });
  };
  const nextMonth = () => {
    setView((v) => {
      const m = v.m + 1;
      return m > 11 ? { y: v.y + 1, m: 0 } : { y: v.y, m };
    });
  };

  return (
    <div className="bg-white rounded-sm border border-ink/10 p-4 md:p-6">
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={prevMonth}
          aria-label="Previous month"
          className="w-9 h-9 rounded-full inline-flex items-center justify-center hover:bg-ink/5 transition-colors text-ink/70 hover:text-ink"
        >
          <ChevronLeft size={18} strokeWidth={1.5} />
        </button>
        <h4 className="serif text-xl text-ink">
          {MONTHS[view.m]} {view.y}
        </h4>
        <button
          onClick={nextMonth}
          aria-label="Next month"
          className="w-9 h-9 rounded-full inline-flex items-center justify-center hover:bg-ink/5 transition-colors text-ink/70 hover:text-ink"
        >
          <ChevronRight size={18} strokeWidth={1.5} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {DOW.map((d) => (
          <div
            key={d}
            className="text-center text-[0.62rem] tracking-[0.18em] uppercase text-ink/45 py-2"
            style={{ fontWeight: 500 }}
          >
            {d.slice(0, 1)}
            <span className="hidden md:inline">{d.slice(1)}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((c, i) => {
          if (c.d === null) return <div key={i} />;
          const iso = isoFor(view.y, view.m, c.d);
          const dt = new Date(view.y, view.m, c.d);
          // Past dates are auto-disabled. Future-date blocking will come from
          // a real bookings source (Square / DB) once that's wired up.
          const disabled = dt < today;
          const isSel = selected === iso;
          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(iso)}
              className={`cal-day ${disabled ? "disabled" : ""} ${
                isSel ? "selected" : ""
              }`}
              aria-label={`${MONTHS[view.m]} ${c.d}, ${view.y}${
                disabled ? " (past date)" : ""
              }`}
            >
              {c.d}
            </button>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-ink/10 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[0.68rem] tracking-[0.18em] uppercase text-ink/55">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-ink" /> Selected
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-ink/20" /> Past date
        </span>
      </div>
    </div>
  );
}
