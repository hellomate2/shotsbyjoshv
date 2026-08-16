"use client";

import { ChevronLeft, Printer } from "lucide-react";
import type { BookingState } from "@/lib/types";
import { TERMS_OF_SERVICE } from "@/lib/constants";
import { parseLocalDate } from "@/lib/animations";

interface StepReviewProps {
  state: BookingState;
  total: number;
  surcharge: boolean;
  rushFee: number;
  onAgree: (v: boolean) => void;
  onConfirm: () => void;
  onBack: () => void;
  /** True while we're waiting on the Square checkout URL. */
  checkoutPending?: boolean;
  /** Error message if creating the Square checkout failed. */
  checkoutError?: string | null;
}

function formatTimeLabel(t: string) {
  const [hStr, mStr] = t.split(":");
  const h = Number(hStr);
  const ampm = h < 12 ? "AM" : "PM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${mStr} ${ampm}`;
}

/** "07:00" + 90 minutes → "08:30" */
function addMinutes(t: string, mins: number) {
  const [h, m] = t.split(":").map(Number);
  const total = h * 60 + m + mins;
  const hh = Math.floor((total / 60) % 24);
  const mm = total % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

function formatDuration(mins: number) {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (m === 0) return `${h} ${h === 1 ? "hour" : "hours"}`;
  return `${h}h ${m}m`;
}

function rushLabel(rush: BookingState["details"]["rush"]) {
  if (rush === "48h") return "48-Hour Rush";
  if (rush === "24h") return "24-Hour Rush";
  return "Standard (14 business days)";
}

function greetingFor(time: string | null) {
  if (!time) return "You're all set!";
  const h = Number(time.split(":")[0]);
  if (h < 12) return "Good morning!";
  if (h < 17) return "Good afternoon!";
  return "Good evening!";
}

export function StepReview({
  state,
  total,
  surcharge,
  rushFee,
  onAgree,
  onConfirm,
  onBack,
  checkoutPending = false,
  checkoutError = null,
}: StepReviewProps) {
  const { service, pkg, date, time, details, agreedToTerms, confirmed } = state;
  if (!service || !pkg || !date || !time) return null;

  const endTime = addMinutes(time, pkg.durationMinutes);
  const durationLabel = formatDuration(pkg.durationMinutes);

  if (confirmed) {
    return (
      <div className="text-center pt-6 pb-4 md:pt-10">
        <div className="mx-auto w-24 h-24 mb-6 relative">
          <svg viewBox="0 0 80 80" className="w-full h-full">
            <circle
              cx="40"
              cy="40"
              r="36"
              fill="none"
              stroke="#0A0A0A"
              strokeWidth="2"
              strokeDasharray="226"
              strokeDashoffset="226"
              style={{
                animation: "draw-circle 0.8s 0.05s forwards ease-out",
              }}
            />
            <path
              d="M24 41 L36 53 L58 30"
              fill="none"
              stroke="#C9A96E"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="60"
              strokeDashoffset="60"
              style={{
                animation: "draw-check 0.55s 0.85s forwards ease-out",
              }}
            />
          </svg>
        </div>
        <h3 className="serif text-3xl md:text-5xl text-ink leading-tight">
          {greetingFor(time)}
        </h3>
        <p
          className="mt-3 text-gold tracking-[0.32em] uppercase"
          style={{ fontSize: "0.7rem", fontWeight: 500 }}
        >
          Booking Confirmed
        </p>
        <p className="mt-6 max-w-md mx-auto text-ink/70 text-[15px] leading-relaxed">
          Josh will reach out within 24 hours to confirm your{" "}
          <strong className="text-ink">{service.name.toLowerCase()}</strong>{" "}
          session on{" "}
          <strong className="text-ink">
            {parseLocalDate(date).toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </strong>{" "}
          from{" "}
          <strong className="text-ink">{formatTimeLabel(time)}</strong> to{" "}
          <strong className="text-ink">{formatTimeLabel(endTime)}</strong>.
          Check your email for a confirmation copy.
        </p>
        {details.payment === "Venmo" && (
          <p className="mt-4 max-w-md mx-auto text-ink/80 text-[14px] leading-relaxed bg-gold/10 border border-gold/30 rounded-sm px-4 py-3">
            <strong className="text-ink">Heads up:</strong> Venmo opened in a
            new tab with your amount and booking note prefilled. Send the
            payment from there to lock in your date.
          </p>
        )}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3 no-print">
          <button
            type="button"
            onClick={() => window.print()}
            className="btn btn-outline"
          >
            <Printer size={14} strokeWidth={1.6} /> Save Confirmation
          </button>
        </div>

        <div className="mt-12 max-w-md mx-auto p-5 border border-ink/10 rounded-sm text-left bg-bone/50">
          <p
            className="text-[0.62rem] tracking-[0.28em] uppercase text-ink/55 mb-3"
            style={{ fontWeight: 500 }}
          >
            Booking Summary
          </p>
          <ul className="space-y-2 text-[14px] text-ink/80">
            <li>
              <strong className="text-ink">Service:</strong> {service.name}
            </li>
            <li>
              <strong className="text-ink">Package:</strong> {pkg.name} · $
              {pkg.price.toLocaleString()}
            </li>
            <li>
              <strong className="text-ink">Date:</strong>{" "}
              {parseLocalDate(date).toLocaleDateString()}
            </li>
            <li>
              <strong className="text-ink">Start:</strong>{" "}
              {formatTimeLabel(time)}
            </li>
            <li>
              <strong className="text-ink">End:</strong>{" "}
              {formatTimeLabel(endTime)}
            </li>
            <li>
              <strong className="text-ink">Duration:</strong> {durationLabel}
            </li>
            <li>
              <strong className="text-ink">Where:</strong> {details.location}
            </li>
            <li>
              <strong className="text-ink">Payment:</strong> {details.payment}
            </li>
            <li>
              <strong className="text-ink">Delivery:</strong>{" "}
              {rushLabel(details.rush)}
            </li>
            <li className="pt-2 border-t border-ink/10 mt-2 text-base">
              <strong className="text-ink">Total: </strong>
              <span className="serif text-2xl text-gold">
                ${total.toLocaleString()}
              </span>
            </li>
          </ul>
        </div>

        <style jsx global>{`
          @keyframes draw-circle {
            to {
              stroke-dashoffset: 0;
            }
          }
          @keyframes draw-check {
            to {
              stroke-dashoffset: 0;
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={onBack}
        className="text-[0.7rem] tracking-[0.24em] uppercase text-ink/55 hover:text-ink inline-flex items-center gap-1.5 mb-6"
      >
        <ChevronLeft size={14} strokeWidth={1.6} /> Back
      </button>

      <div className="mb-7 md:mb-9">
        <p className="eyebrow text-ink/55 mb-3">Step 5 of 5</p>
        <h3 className="serif text-3xl md:text-4xl text-ink leading-tight">
          Review your booking
        </h3>
        <p className="mt-3 text-ink/65 text-[14.5px] max-w-lg">
          One last look. Confirm the details and you&apos;re booked.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-5">
        {/* Summary */}
        <div className="bg-bone/60 border border-ink/10 rounded-sm p-6 md:p-8">
          <p
            className="text-[0.62rem] tracking-[0.28em] uppercase text-ink/55 mb-5"
            style={{ fontWeight: 500 }}
          >
            Summary
          </p>
          <ul className="space-y-4 text-[14.5px] text-ink/85">
            <li className="flex justify-between gap-4">
              <span className="text-ink/60">Service</span>
              <span className="text-ink text-right">{service.name}</span>
            </li>
            <li className="flex justify-between gap-4">
              <span className="text-ink/60">Package</span>
              <span className="text-ink text-right">{pkg.name}</span>
            </li>
            <li className="flex justify-between gap-4">
              <span className="text-ink/60">Date</span>
              <span className="text-ink text-right">
                {parseLocalDate(date).toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </li>
            <li className="flex justify-between gap-4">
              <span className="text-ink/60">Start Time</span>
              <span className="text-ink text-right">
                {formatTimeLabel(time)}
              </span>
            </li>
            <li className="flex justify-between gap-4">
              <span className="text-ink/60">End Time</span>
              <span className="text-ink text-right">
                {formatTimeLabel(endTime)}
              </span>
            </li>
            <li className="flex justify-between gap-4">
              <span className="text-ink/60">Duration</span>
              <span className="text-ink text-right">{durationLabel}</span>
            </li>
            <li className="flex justify-between gap-4">
              <span className="text-ink/60">Name</span>
              <span className="text-ink text-right">{details.name}</span>
            </li>
            <li className="flex justify-between gap-4">
              <span className="text-ink/60">Email</span>
              <span className="text-ink text-right">{details.email}</span>
            </li>
            <li className="flex justify-between gap-4">
              <span className="text-ink/60">Phone</span>
              <span className="text-ink text-right">{details.phone}</span>
            </li>
            <li className="flex justify-between gap-4">
              <span className="text-ink/60">Location</span>
              <span className="text-ink text-right">{details.location}</span>
            </li>
            <li className="flex justify-between gap-4">
              <span className="text-ink/60">Payment</span>
              <span className="text-ink text-right">{details.payment}</span>
            </li>
            <li className="flex justify-between gap-4">
              <span className="text-ink/60">Delivery</span>
              <span className="text-ink text-right">
                {rushLabel(details.rush)}
              </span>
            </li>
            {details.notes && (
              <li className="flex flex-col gap-1">
                <span className="text-ink/60">Notes</span>
                <span className="text-ink text-[13.5px] leading-relaxed">
                  {details.notes}
                </span>
              </li>
            )}
          </ul>

          <div className="mt-6 pt-5 border-t border-ink/15 space-y-2 text-[14px]">
            <div className="flex justify-between text-ink/70">
              <span>Package</span>
              <span>${pkg.price.toLocaleString()}</span>
            </div>
            {surcharge && (
              <div className="flex justify-between text-ink/70">
                <span>After-hours surcharge</span>
                <span>+$25</span>
              </div>
            )}
            {rushFee > 0 && (
              <div className="flex justify-between text-ink/70">
                <span>
                  Rush delivery ({details.rush === "24h" ? "24h" : "48h"})
                </span>
                <span>+${rushFee}</span>
              </div>
            )}
            <div className="flex justify-between items-baseline pt-3 mt-2 border-t border-ink/15">
              <span
                className="text-[0.7rem] tracking-[0.28em] uppercase text-ink"
                style={{ fontWeight: 500 }}
              >
                Total
              </span>
              <span className="serif text-3xl md:text-4xl text-ink">
                ${total.toLocaleString()}
              </span>
            </div>
            <p className="text-[12px] text-ink/55 mt-2">
              {details.payment === "Venmo"
                ? "You'll be sent to Venmo with the amount and booking note prefilled. Send the payment to lock in your date."
                : details.payment === "Card"
                ? "Card payments are processed in full at booking to secure your date."
                : details.payment === "Pay In Person"
                ? "Pay the full amount upon arrival. Cash or check accepted."
                : "Full amount due per your selected payment method."}
            </p>
          </div>
        </div>

        {/* Terms */}
        <div className="flex flex-col">
          <p
            className="text-[0.62rem] tracking-[0.28em] uppercase text-ink/55 mb-3"
            style={{ fontWeight: 500 }}
          >
            Terms of Service
          </p>
          <div className="border border-ink/10 rounded-sm bg-white max-h-[280px] overflow-y-auto p-5 text-[13.5px] text-ink/75 leading-relaxed whitespace-pre-line">
            {TERMS_OF_SERVICE}
          </div>

          <label className="mt-4 flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => onAgree(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-ink"
            />
            <span className="text-ink/75 text-[14px] leading-relaxed">
              I have read and agree to the Terms of Service.
            </span>
          </label>

          {checkoutError && (
            <p
              role="alert"
              className="mt-4 text-[13px] text-red-700 bg-red-50 border border-red-200 rounded-sm px-3 py-2"
            >
              {checkoutError}
            </p>
          )}

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onConfirm}
              disabled={!agreedToTerms || checkoutPending}
              className={`btn btn-primary ${
                !agreedToTerms || checkoutPending
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {checkoutPending
                ? "Redirecting to checkout…"
                : details.payment === "Card"
                ? "Pay & Confirm Booking"
                : details.payment === "Venmo"
                ? "Pay with Venmo & Confirm"
                : "Confirm Booking"}
              {!checkoutPending && (
                <svg width="18" height="10" viewBox="0 0 22 10">
                  <path
                    d="M0 5 H20 M16 1 L20 5 L16 9"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    fill="none"
                  />
                </svg>
              )}
            </button>
          </div>
          {details.payment === "Card" && agreedToTerms && (
            <p className="mt-3 text-right text-[11.5px] text-ink/50">
              You&apos;ll be taken to Square&apos;s secure checkout to complete
              payment.
            </p>
          )}
          {details.payment === "Venmo" && agreedToTerms && (
            <p className="mt-3 text-right text-[11.5px] text-ink/50">
              You&apos;ll be taken to Venmo with the amount prefilled.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
