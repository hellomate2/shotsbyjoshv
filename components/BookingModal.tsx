"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";
import { X } from "lucide-react";
import { useBooking } from "./BookingContext";
import { ProgressBar } from "./ui/ProgressBar";
import { StepService } from "./booking/StepService";
import { StepPackage } from "./booking/StepPackage";
import { StepDateTime } from "./booking/StepDateTime";
import { StepDetails } from "./booking/StepDetails";
import { StepReview } from "./booking/StepReview";
import {
  AFTER_HOURS_SURCHARGE,
  buildVenmoPayUrl,
  RUSH_PRICING,
  STANDARD_HOURS_END,
  STANDARD_HOURS_START,
} from "@/lib/constants";
import type {
  BookingDetails,
  BookingState,
  PackageTier,
  Service,
} from "@/lib/types";

type Action =
  | { type: "RESET" }
  | { type: "SET_SERVICE"; service: Service }
  | { type: "SET_PACKAGE"; pkg: PackageTier }
  | { type: "SET_DATE"; date: string }
  | { type: "SET_TIME"; time: string }
  | { type: "PATCH_DETAILS"; patch: Partial<BookingDetails> }
  | { type: "SET_AGREED"; v: boolean }
  | { type: "GO"; step: BookingState["step"] }
  | { type: "CONFIRM" };

const INITIAL_DETAILS: BookingDetails = {
  name: "",
  email: "",
  phone: "",
  location: "",
  payment: "",
  rush: "none",
  notes: "",
};

const initialState = (initialService: Service | null): BookingState => ({
  step: initialService ? 2 : 1,
  service: initialService,
  pkg: null,
  date: null,
  time: null,
  details: { ...INITIAL_DETAILS },
  agreedToTerms: false,
  confirmed: false,
});

function reducer(state: BookingState, action: Action): BookingState {
  switch (action.type) {
    case "RESET":
      return initialState(null);
    case "SET_SERVICE":
      return {
        ...state,
        service: action.service,
        pkg:
          state.service?.id === action.service.id ? state.pkg : null,
        step: 2,
      };
    case "SET_PACKAGE":
      return { ...state, pkg: action.pkg, step: 3 };
    case "SET_DATE":
      return { ...state, date: action.date };
    case "SET_TIME":
      return { ...state, time: action.time, step: 4 };
    case "PATCH_DETAILS":
      return {
        ...state,
        details: { ...state.details, ...action.patch },
      };
    case "SET_AGREED":
      return { ...state, agreedToTerms: action.v };
    case "GO":
      return { ...state, step: action.step };
    case "CONFIRM":
      return { ...state, confirmed: true };
    default:
      return state;
  }
}

const STEP_LABELS = ["Service", "Package", "Date & Time", "Details", "Review"];

function validateDetails(d: BookingDetails) {
  const errors: Partial<Record<keyof BookingDetails, string>> = {};
  if (!d.name.trim()) errors.name = "Required";
  if (!d.email.trim()) errors.email = "Required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email))
    errors.email = "Enter a valid email address";
  if (!d.phone.replace(/\D/g, "")) errors.phone = "Required";
  else if (d.phone.replace(/\D/g, "").length < 10)
    errors.phone = "Enter a complete phone number";
  if (!d.location.trim()) errors.location = "Required";
  if (!d.payment) errors.payment = "Select a payment method";
  return errors;
}

export function BookingModal() {
  const { open, initialService, closeModal } = useBooking();
  const [state, dispatch] = useReducer(
    reducer,
    initialService,
    initialState
  );
  const [errors, setErrors] = useState<
    Partial<Record<keyof BookingDetails, string>>
  >({});
  const [confirmingClose, setConfirmingClose] = useState(false);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [checkoutPending, setCheckoutPending] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef<HTMLDivElement>(null);

  // Reset when reopening with a fresh initial
  useEffect(() => {
    if (open) {
      dispatch({ type: "RESET" });
      if (initialService) {
        dispatch({ type: "SET_SERVICE", service: initialService });
      }
      setErrors({});
      setConfirmingClose(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Open animation
  useEffect(() => {
    if (!open) return;
    if (!overlayRef.current || !panelRef.current) return;
    gsap.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: "expo.out" }
    );
    gsap.fromTo(
      panelRef.current,
      { y: 40, opacity: 0, scale: 0.985 },
      { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "expo.out" }
    );
  }, [open]);

  // Step transition
  useEffect(() => {
    if (!stepRef.current) return;
    const fromX = direction === "forward" ? 50 : -50;
    gsap.fromTo(
      stepRef.current,
      { x: fromX, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.55, ease: "expo.out" }
    );
  }, [state.step, direction]);

  // ESC to close (with confirm)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") tryClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const surcharge = useMemo(() => {
    if (!state.time) return false;
    const h = Number(state.time.split(":")[0]);
    return h < STANDARD_HOURS_START || h >= STANDARD_HOURS_END;
  }, [state.time]);

  const rushFee = useMemo(
    () => RUSH_PRICING[state.details.rush] ?? 0,
    [state.details.rush]
  );

  const total = useMemo(() => {
    const base = state.pkg?.price ?? 0;
    return base + (surcharge ? AFTER_HOURS_SURCHARGE : 0) + rushFee;
  }, [state.pkg, surcharge, rushFee]);

  const animatedClose = useCallback(() => {
    if (!overlayRef.current || !panelRef.current) {
      closeModal();
      return;
    }
    gsap.to(panelRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.35,
      ease: "expo.in",
    });
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.35,
      ease: "expo.in",
      onComplete: closeModal,
    });
  }, [closeModal]);

  const tryClose = useCallback(() => {
    if (state.confirmed) {
      animatedClose();
      return;
    }
    // If user has made any selection, confirm
    const hasProgress =
      state.service ||
      state.pkg ||
      state.date ||
      state.time ||
      state.details.name ||
      state.details.email ||
      state.details.phone;
    if (hasProgress) {
      setConfirmingClose(true);
    } else {
      animatedClose();
    }
  }, [state, animatedClose]);

  const goNext = useCallback(() => {
    setDirection("forward");
    if (state.step === 4) {
      const e = validateDetails(state.details);
      setErrors(e);
      if (Object.keys(e).length === 0) {
        dispatch({ type: "GO", step: 5 });
      }
      return;
    }
    if (state.step < 5)
      dispatch({ type: "GO", step: (state.step + 1) as BookingState["step"] });
  }, [state.step, state.details]);

  const goBack = useCallback(() => {
    setDirection("back");
    if (state.step > 1) {
      dispatch({ type: "GO", step: (state.step - 1) as BookingState["step"] });
    }
  }, [state.step]);

  /** Assemble the shared payload used for both /api/checkout and /api/booking-notify. */
  const buildPayload = useCallback(() => {
    if (!state.service || !state.pkg || !state.date || !state.time) return null;
    const [h, m] = state.time.split(":").map(Number);
    const totalMins = h * 60 + m + state.pkg.durationMinutes;
    const endH = Math.floor((totalMins / 60) % 24)
      .toString()
      .padStart(2, "0");
    const endM = (totalMins % 60).toString().padStart(2, "0");
    const durationLabel =
      state.pkg.durationMinutes < 60
        ? `${state.pkg.durationMinutes} min`
        : state.pkg.durationMinutes % 60 === 0
        ? `${state.pkg.durationMinutes / 60}h`
        : `${Math.floor(state.pkg.durationMinutes / 60)}h ${
            state.pkg.durationMinutes % 60
          }m`;
    return {
      serviceName: state.service.name,
      packageName: state.pkg.name,
      totalDollars: total,
      name: state.details.name,
      email: state.details.email,
      phone: state.details.phone,
      location: state.details.location,
      date: state.date,
      startTime: state.time,
      endTime: `${endH}:${endM}`,
      duration: durationLabel,
      durationMinutes: state.pkg.durationMinutes,
      rush: state.details.rush,
      afterHours: surcharge,
      payment: state.details.payment as "Card" | "Pay In Person" | "Venmo",
      notes: state.details.notes,
    };
  }, [state, total, surcharge]);

  /** Best-effort notification to Josh. Never blocks the booking UX. */
  const notifyJosh = useCallback(
    async (payload: ReturnType<typeof buildPayload>) => {
      if (!payload) return;
      try {
        await fetch("/api/booking-notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch {
        // Swallow — the booking is already locked in client-side or via Square.
      }
    },
    []
  );

  const startCheckout = useCallback(async () => {
    const payload = buildPayload();
    if (!payload) return;
    setCheckoutPending(true);
    setCheckoutError(null);

    // Fire the "heads up Josh" email immediately so he sees the intent even
    // if the client never finishes Square's payment screen.
    void notifyJosh(payload);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Could not start checkout");
      }
      window.location.href = data.url;
    } catch (e) {
      setCheckoutPending(false);
      setCheckoutError(
        e instanceof Error
          ? e.message
          : "Something went wrong starting checkout. Please try again or pay in person."
      );
    }
  }, [buildPayload, notifyJosh]);

  const onConfirmBooking = useCallback(() => {
    if (state.details.payment === "Card") {
      void startCheckout();
      return;
    }

    const payload = buildPayload();

    if (state.details.payment === "Venmo" && payload) {
      // Email Josh so he sees the booking even if the client closes the Venmo tab.
      void notifyJosh(payload);
      // Confirm locally so the user sees the success screen on return.
      dispatch({ type: "CONFIRM" });
      // Open Venmo's pay flow with amount + booking note prefilled in a new tab.
      const note = `ShotsByJoshV · ${payload.serviceName} · ${payload.packageName} · ${payload.date} ${payload.startTime}`;
      const url = buildVenmoPayUrl(payload.totalDollars, note);
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }

    // Pay In Person — confirm locally + email Josh so he knows to follow up.
    void notifyJosh(payload);
    dispatch({ type: "CONFIRM" });
  }, [state.details.payment, startCheckout, buildPayload, notifyJosh]);

  const onSelectService = (s: Service) => {
    setDirection("forward");
    dispatch({ type: "SET_SERVICE", service: s });
  };
  const onSelectPackage = (p: PackageTier) => {
    setDirection("forward");
    dispatch({ type: "SET_PACKAGE", pkg: p });
  };
  const onSelectDate = (iso: string) =>
    dispatch({ type: "SET_DATE", date: iso });
  const onSelectTime = (t: string) => {
    setDirection("forward");
    dispatch({ type: "SET_TIME", time: t });
  };

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[180] flex items-end md:items-center justify-center bg-black/65 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Booking"
    >
      <div
        ref={panelRef}
        className="relative w-full md:w-[min(94vw,1100px)] md:max-h-[92vh] h-[100svh] md:h-auto bg-white md:rounded-md shadow-[0_30px_120px_-20px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-5 md:px-9 pt-5 md:pt-7 pb-4 border-b border-ink/8">
          <div className="flex-1 max-w-2xl">
            <ProgressBar
              current={state.step}
              total={5}
              labels={STEP_LABELS}
            />
          </div>
          <button
            type="button"
            onClick={tryClose}
            aria-label="Close booking"
            className="w-10 h-10 inline-flex items-center justify-center rounded-full hover:bg-ink/5 transition-colors text-ink/70 hover:text-ink shrink-0"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div ref={stepRef} className="px-5 md:px-9 py-7 md:py-9">
            {state.step === 1 && (
              <StepService
                selected={state.service}
                onSelect={onSelectService}
              />
            )}
            {state.step === 2 && state.service && (
              <StepPackage
                service={state.service}
                selected={state.pkg}
                onSelect={onSelectPackage}
                onBack={goBack}
              />
            )}
            {state.step === 3 && (
              <StepDateTime
                date={state.date}
                time={state.time}
                onSelectDate={onSelectDate}
                onSelectTime={onSelectTime}
                onBack={goBack}
              />
            )}
            {state.step === 4 && (
              <StepDetails
                details={state.details}
                errors={errors}
                onChange={(p) => {
                  dispatch({ type: "PATCH_DETAILS", patch: p });
                  // clear field error as user types
                  const k = Object.keys(p)[0] as keyof BookingDetails;
                  if (k && errors[k]) {
                    setErrors((e) => ({ ...e, [k]: undefined }));
                  }
                }}
                onBack={goBack}
              />
            )}
            {state.step === 5 && (
              <StepReview
                state={state}
                total={total}
                surcharge={surcharge}
                rushFee={rushFee}
                onAgree={(v) => dispatch({ type: "SET_AGREED", v })}
                onConfirm={onConfirmBooking}
                onBack={goBack}
                checkoutPending={checkoutPending}
                checkoutError={checkoutError}
              />
            )}
          </div>
        </div>

        {/* Footer (Continue button) */}
        {!state.confirmed && state.step !== 5 && (
          <div className="border-t border-ink/8 px-5 md:px-9 py-4 md:py-5 flex items-center justify-between gap-3 bg-white">
            <p
              className="hidden md:block text-[0.66rem] tracking-[0.24em] uppercase text-ink/45"
              style={{ fontWeight: 500 }}
            >
              Step {state.step} of 5
            </p>
            <div className="flex items-center gap-3 ml-auto">
              <button
                type="button"
                onClick={tryClose}
                className="text-[0.7rem] tracking-[0.24em] uppercase text-ink/55 hover:text-ink"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={
                  (state.step === 1 && !state.service) ||
                  (state.step === 2 && !state.pkg) ||
                  (state.step === 3 && (!state.date || !state.time))
                }
                aria-disabled={
                  (state.step === 1 && !state.service) ||
                  (state.step === 2 && !state.pkg) ||
                  (state.step === 3 && (!state.date || !state.time))
                }
                title={
                  state.step === 1 && !state.service
                    ? "Pick a service to continue"
                    : state.step === 2 && !state.pkg
                    ? "Pick a package to continue"
                    : state.step === 3 && (!state.date || !state.time)
                    ? "Pick a date and time to continue"
                    : undefined
                }
                className={`btn btn-primary ${
                  (state.step === 1 && !state.service) ||
                  (state.step === 2 && !state.pkg) ||
                  (state.step === 3 && (!state.date || !state.time))
                    ? "opacity-40 cursor-not-allowed"
                    : ""
                }`}
              >
                {state.step === 4 ? "Review Booking" : "Continue"}
                <svg width="18" height="10" viewBox="0 0 22 10">
                  <path
                    d="M0 5 H20 M16 1 L20 5 L16 9"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    fill="none"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Footer when confirmed */}
        {state.confirmed && (
          <div className="border-t border-ink/8 px-5 md:px-9 py-4 md:py-5 flex items-center justify-end bg-white no-print">
            <button
              type="button"
              onClick={animatedClose}
              className="btn btn-outline"
            >
              Close
            </button>
          </div>
        )}
      </div>

      {/* Close-confirmation mini modal */}
      {confirmingClose && (
        <div className="absolute inset-0 z-10 flex items-center justify-center p-5 bg-black/30">
          <div className="max-w-md w-full bg-white rounded-md p-7 shadow-2xl">
            <h4 className="serif text-2xl text-ink mb-2">Are you sure?</h4>
            <p className="text-ink/70 text-[14.5px] leading-relaxed">
              Your selections won&apos;t be saved if you leave now.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmingClose(false)}
                className="text-[0.7rem] tracking-[0.24em] uppercase text-ink/65 hover:text-ink"
              >
                Stay
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmingClose(false);
                  animatedClose();
                }}
                className="btn btn-primary"
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
