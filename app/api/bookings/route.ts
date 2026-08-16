/**
 * GET  /api/bookings — list every currently-taken slot (date + time strings).
 *                       Used by the date/time picker to grey out booked slots.
 *
 * POST /api/bookings — internal: add a slot. Called by booking-notify after a
 *                       Pay-In-Person confirm, and by Square webhook on payment
 *                       success for Card bookings.
 */
import { NextResponse } from "next/server";
import { addBookedSlot, getBookedSlots } from "@/lib/bookings-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const slots = await getBookedSlots();
  // Return only date+time pairs; the durationMinutes is internal-only.
  return NextResponse.json({
    slots: slots.map((s) => ({ date: s.date, time: s.time })),
  });
}

type AddBody = {
  date: string;
  time: string;
  durationMinutes: number;
  label?: string;
};

export async function POST(req: Request) {
  let body: AddBody;
  try {
    body = (await req.json()) as AddBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (
    !body.date ||
    !body.time ||
    typeof body.durationMinutes !== "number"
  ) {
    return NextResponse.json(
      { error: "Missing date/time/durationMinutes" },
      { status: 400 }
    );
  }
  const ok = await addBookedSlot({
    date: body.date,
    time: body.time,
    durationMinutes: body.durationMinutes,
    bookedAt: new Date().toISOString(),
    label: body.label,
  });
  return NextResponse.json({ ok });
}
