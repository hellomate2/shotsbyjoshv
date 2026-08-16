"use client";

import { ChevronLeft, Zap } from "lucide-react";
import {
  LOCATION_SUGGESTIONS,
  RUSH_PRICING,
} from "@/lib/constants";
import type {
  BookingDetails,
  PaymentMethod,
  RushOrder,
} from "@/lib/types";

interface StepDetailsProps {
  details: BookingDetails;
  errors: Partial<Record<keyof BookingDetails, string>>;
  onChange: (patch: Partial<BookingDetails>) => void;
  onBack: () => void;
}

// Venmo and Card are the prepay-online options.
// "Pay In Person" covers cash/check at the session location.
// Card pays via Square-hosted checkout (see /api/checkout). It unlocks when
// NEXT_PUBLIC_CARD_PAYMENTS="true" is set in Vercel env vars — flip it on
// once valid production Square credentials are configured.
const CARD_ENABLED = process.env.NEXT_PUBLIC_CARD_PAYMENTS === "true";

const PAYMENT_OPTS: {
  value: PaymentMethod;
  helper: string;
  disabled?: boolean;
  badge?: string;
}[] = [
  {
    value: "Venmo",
    helper: "Send full session fee via Venmo to lock in your date",
  },
  {
    value: "Pay In Person",
    helper: "Pay full session fee at the location (cash or check accepted)",
  },
  {
    value: "Card",
    helper: CARD_ENABLED
      ? "Pay securely online by card to lock in your date"
      : "Online card payments coming soon",
    disabled: !CARD_ENABLED,
    badge: CARD_ENABLED ? undefined : "Coming soon",
  },
];

const RUSH_OPTS: { value: RushOrder; label: string; sub: string }[] = [
  {
    value: "none",
    label: "Standard",
    sub: "Delivered within 14 business days · included",
  },
  {
    value: "48h",
    label: "48-Hour Rush",
    sub: `Delivered within 48 hours · +$${RUSH_PRICING["48h"]}`,
  },
  {
    value: "24h",
    label: "24-Hour Rush",
    sub: `Delivered within 24 hours · +$${RUSH_PRICING["24h"]}`,
  },
];

function formatPhone(input: string) {
  const digits = input.replace(/\D/g, "").slice(0, 10);
  const a = digits.slice(0, 3);
  const b = digits.slice(3, 6);
  const c = digits.slice(6, 10);
  if (digits.length <= 3) return a;
  if (digits.length <= 6) return `(${a}) ${b}`;
  return `(${a}) ${b}-${c}`;
}

export function StepDetails({
  details,
  errors,
  onChange,
  onBack,
}: StepDetailsProps) {
  return (
    <div>
      <button
        onClick={onBack}
        className="text-[0.7rem] tracking-[0.24em] uppercase text-ink/55 hover:text-ink inline-flex items-center gap-1.5 mb-6"
      >
        <ChevronLeft size={14} strokeWidth={1.6} /> Back
      </button>

      <div className="mb-7 md:mb-9">
        <p className="eyebrow text-ink/55 mb-3">Step 4 of 5</p>
        <h3 className="serif text-3xl md:text-4xl text-ink leading-tight">
          Almost there. Tell us about you.
        </h3>
        <p className="mt-3 text-ink/65 text-[14.5px] max-w-lg">
          A few quick details so I can confirm your session.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        <div className={`field ${errors.name ? "field-error shake" : ""}`}>
          <input
            id="b-name"
            type="text"
            placeholder=" "
            value={details.name}
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "b-name-error" : undefined}
            onChange={(e) => onChange({ name: e.target.value })}
          />
          <label htmlFor="b-name">Full Name *</label>
          {errors.name && (
            <p id="b-name-error" role="alert" className="mt-1.5 text-[12px] text-red-600">
              {errors.name}
            </p>
          )}
        </div>

        <div className={`field ${errors.phone ? "field-error shake" : ""}`}>
          <input
            id="b-phone"
            type="tel"
            placeholder=" "
            value={details.phone}
            autoComplete="tel"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "b-phone-error" : undefined}
            onChange={(e) =>
              onChange({ phone: formatPhone(e.target.value) })
            }
          />
          <label htmlFor="b-phone">Phone Number *</label>
          {errors.phone && (
            <p id="b-phone-error" role="alert" className="mt-1.5 text-[12px] text-red-600">
              {errors.phone}
            </p>
          )}
        </div>

        <div
          className={`field md:col-span-2 ${
            errors.email ? "field-error shake" : ""
          }`}
        >
          <input
            id="b-email"
            type="email"
            placeholder=" "
            value={details.email}
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "b-email-error" : undefined}
            onChange={(e) => onChange({ email: e.target.value })}
          />
          <label htmlFor="b-email">Email Address *</label>
          {errors.email && (
            <p id="b-email-error" role="alert" className="mt-1.5 text-[12px] text-red-600">
              {errors.email}
            </p>
          )}
        </div>

        {/* Location with datalist-based suggestions. Free-text is allowed
            so clients can type any address; the dropdown surfaces common
            Long Island venues for quick selection. */}
        <div
          className={`field md:col-span-2 ${
            errors.location ? "field-error shake" : ""
          }`}
        >
          <input
            id="b-location"
            type="text"
            list="location-suggestions"
            placeholder=" "
            autoComplete="street-address"
            aria-invalid={!!errors.location}
            aria-describedby={
              errors.location ? "b-location-error" : "b-location-hint"
            }
            value={details.location}
            onChange={(e) => onChange({ location: e.target.value })}
          />
          <label htmlFor="b-location">Location / Address *</label>
          <datalist id="location-suggestions">
            {LOCATION_SUGGESTIONS.map((l) => (
              <option key={l} value={l} />
            ))}
          </datalist>
          <p id="b-location-hint" className="mt-1.5 text-[12px] text-ink/50">
            Start typing. Pick a suggestion or enter any address.
          </p>
          {errors.location && (
            <p
              id="b-location-error"
              role="alert"
              className="mt-1.5 text-[12px] text-red-600"
            >
              {errors.location}
            </p>
          )}
        </div>

        {/* Payment */}
        <div className="md:col-span-2">
          <p
            className="text-[0.66rem] tracking-[0.28em] uppercase text-ink/55 mb-3"
            style={{ fontWeight: 500 }}
          >
            Payment Method *
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PAYMENT_OPTS.map((opt) => {
              const sel = details.payment === opt.value;
              const disabled = !!opt.disabled;
              return (
                <button
                  key={opt.value}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    if (disabled) return;
                    onChange({ payment: opt.value });
                  }}
                  className={`relative text-left p-4 rounded-sm transition-all duration-400 ease-out-expo ${
                    disabled
                      ? "ring-1 ring-ink/10 bg-ink/[0.03] cursor-not-allowed opacity-60"
                      : sel
                      ? "ring-2 ring-gold bg-bone/60"
                      : "ring-1 ring-ink/15 hover:ring-ink/35 bg-white"
                  }`}
                  aria-pressed={sel}
                  aria-disabled={disabled}
                >
                  {opt.badge && (
                    <span className="absolute top-2 right-2 text-[9.5px] tracking-[0.18em] uppercase text-ink/55 bg-ink/[0.06] px-2 py-0.5 rounded-full">
                      {opt.badge}
                    </span>
                  )}
                  <p
                    className="text-[0.78rem] tracking-[0.18em] uppercase text-ink mb-1.5"
                    style={{ fontWeight: 500 }}
                  >
                    {opt.value}
                  </p>
                  <p className="text-[13px] text-ink/65 leading-relaxed">
                    {opt.helper}
                  </p>
                </button>
              );
            })}
          </div>
          {errors.payment && (
            <p className="mt-2 text-[12px] text-red-600">{errors.payment}</p>
          )}
        </div>

        {/* Rush delivery */}
        <div className="md:col-span-2">
          <p
            className="text-[0.66rem] tracking-[0.28em] uppercase text-ink/55 mb-3 inline-flex items-center gap-2"
            style={{ fontWeight: 500 }}
          >
            <Zap size={13} strokeWidth={1.8} className="text-gold" />
            Rush Delivery <span className="text-ink/40">(optional)</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {RUSH_OPTS.map((opt) => {
              const sel = details.rush === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChange({ rush: opt.value })}
                  className={`text-left p-4 rounded-sm transition-all duration-400 ease-out-expo ${
                    sel
                      ? "ring-2 ring-gold bg-bone/60"
                      : "ring-1 ring-ink/15 hover:ring-ink/35 bg-white"
                  }`}
                  aria-pressed={sel}
                >
                  <p
                    className="text-[0.74rem] tracking-[0.2em] uppercase text-ink mb-1"
                    style={{ fontWeight: 500 }}
                  >
                    {opt.label}
                  </p>
                  <p className="text-[12.5px] text-ink/65 leading-relaxed">
                    {opt.sub}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="field md:col-span-2">
          <textarea
            id="b-notes"
            placeholder=" "
            value={details.notes}
            onChange={(e) => onChange({ notes: e.target.value })}
          />
          <label htmlFor="b-notes">Special Requests / Notes</label>
        </div>
      </div>
    </div>
  );
}
