/**
 * POST /api/booking-notify
 *
 * Fires off an email to Josh whenever a booking is confirmed. Called from
 * BookingModal for BOTH "Pay In Person" confirmations and Card flows (the
 * Card path is hit *before* the Square redirect — that way Josh sees the
 * intent even if the client bails out of Square checkout).
 *
 * Email sending is best-effort: if RESEND_API_KEY isn't set or the send
 * fails, we still return 200 so the booking UX doesn't break.
 */
import { NextResponse } from "next/server";
import { sendBookingNotification } from "@/lib/email";
import { addBookedSlot } from "@/lib/bookings-store";

export const runtime = "nodejs";

type Body = Parameters<typeof sendBookingNotification>[0] & {
  durationMinutes?: number;
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (
    !body.serviceName ||
    !body.packageName ||
    !body.name ||
    !body.email ||
    !body.date ||
    !body.startTime
  ) {
    return NextResponse.json(
      { error: "Missing required booking fields" },
      { status: 400 }
    );
  }

  // Run in parallel: email Josh + write the slot to the persistence store.
  // Neither is allowed to break the booking confirmation UX.
  const [emailResult, slotWritten] = await Promise.all([
    sendBookingNotification(body),
    addBookedSlot({
      date: body.date,
      time: body.startTime,
      durationMinutes: body.durationMinutes ?? 60,
      bookedAt: new Date().toISOString(),
      label: `${body.name} · ${body.serviceName} · ${body.packageName}`,
    }),
  ]);

  return NextResponse.json({
    ok: true,
    email: emailResult,
    slotWritten,
  });
}
