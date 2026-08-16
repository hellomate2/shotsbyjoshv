"use client";

interface ProgressBarProps {
  current: number; // 1-based
  total: number;
  labels?: string[];
}

export function ProgressBar({ current, total, labels }: ProgressBarProps) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 md:gap-3 w-full">
        {Array.from({ length: total }).map((_, i) => {
          const idx = i + 1;
          const active = idx === current;
          const done = idx < current;
          return (
            <div key={i} className="flex-1 flex items-center gap-2 md:gap-3">
              <div className="flex-1 h-[3px] rounded-full overflow-hidden bg-ink/10">
                <div
                  className="h-full bg-ink transition-all duration-700 ease-out-expo"
                  style={{
                    width: done ? "100%" : active ? "100%" : "0%",
                    background: done || active ? "#0A0A0A" : "transparent",
                  }}
                />
              </div>
              <span
                className={`text-[0.62rem] tracking-[0.28em] uppercase transition-colors ${
                  active
                    ? "text-ink"
                    : done
                    ? "text-ink/60"
                    : "text-ink/30"
                }`}
                style={{ fontWeight: 500 }}
              >
                {String(idx).padStart(2, "0")}
              </span>
            </div>
          );
        })}
      </div>
      {labels && (
        <div className="hidden md:flex items-center gap-2 md:gap-3 w-full mt-2">
          {labels.map((l, i) => {
            const idx = i + 1;
            const active = idx === current;
            return (
              <span
                key={l}
                className={`flex-1 text-[0.62rem] tracking-[0.24em] uppercase ${
                  active ? "text-ink" : "text-ink/40"
                }`}
                style={{ fontWeight: 500 }}
              >
                {l}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
