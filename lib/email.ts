/**
 * Email notifications via Resend.
 *
 * Set these in Vercel env vars to turn on emails:
 *   RESEND_API_KEY    — from resend.com → API Keys
 *   BOOKING_TO_EMAIL  — where Josh wants booking notifications
 *                       (defaults to shotsbyjoshv.photography@gmail.com)
 *   BOOKING_FROM      — "ShotsByJoshV <bookings@shotsbyjoshv.com>"
 *                       Requires verifying shotsbyjoshv.com in Resend dashboard.
 *                       Until verified, use "onboarding@resend.dev" (test sender).
 *
 * If RESEND_API_KEY is unset, sending is a no-op (logged). Bookings still work,
 * Josh just won't get the email until he wires this up.
 */
import { Resend } from "resend";

type BookingNotificationPayload = {
  serviceName: string;
  packageName: string;
  totalDollars: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  rush: "none" | "48h" | "24h";
  afterHours: boolean;
  payment: "Card" | "Pay In Person" | "Venmo";
  notes?: string;
};

function formatTime12(t: string) {
  const [h, m] = t.split(":").map(Number);
  const ampm = h < 12 ? "AM" : "PM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
}

function buildEmailHtml(b: BookingNotificationPayload) {
  const rushLabel =
    b.rush === "24h"
      ? "24-Hour Rush"
      : b.rush === "48h"
      ? "48-Hour Rush"
      : "Standard (14 business days)";
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 12px 6px 0;color:#666;font-size:13px;">${label}</td><td style="padding:6px 0;color:#111;font-size:14px;"><strong>${value}</strong></td></tr>`;

  return `<!doctype html><html><body style="font-family:Inter,Arial,sans-serif;background:#fafafa;padding:24px;">
<table cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #eee;border-radius:6px;padding:28px;">
  <tr><td>
    <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#C9A96E;">ShotsByJoshV</p>
    <h1 style="margin:0 0 16px;font-size:22px;color:#111;">New booking · ${b.serviceName}</h1>
    <p style="margin:0 0 24px;color:#444;font-size:14px;line-height:1.55;">
      ${b.payment === "Card"
        ? "Card payment was initiated through Square. Confirm in your Square dashboard before the session."
        : b.payment === "Venmo"
        ? "Venmo prepayment booking. The client was sent to Venmo to pay. Confirm the payment landed in your Venmo before the session."
        : "Cash / in-person booking. Reach out to confirm the location and any details."}
    </p>
    <table cellpadding="0" cellspacing="0">
      ${row("Service", b.serviceName)}
      ${row("Package", `${b.packageName} · $${b.totalDollars}`)}
      ${row("Date", new Date(b.date + "T00:00:00").toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" }))}
      ${row("Time", `${formatTime12(b.startTime)} – ${formatTime12(b.endTime)}  (${b.duration})`)}
      ${row("Location", b.location)}
      ${row("Payment", b.payment)}
      ${row("Delivery", rushLabel)}
      ${b.afterHours ? row("After-hours", "Yes (+$25 surcharge)") : ""}
    </table>
    <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
    <h2 style="margin:0 0 10px;font-size:15px;color:#111;">Client</h2>
    <table cellpadding="0" cellspacing="0">
      ${row("Name", b.name)}
      ${row("Email", `<a href="mailto:${b.email}" style="color:#111;">${b.email}</a>`)}
      ${row("Phone", `<a href="tel:${b.phone.replace(/\\D/g, "")}" style="color:#111;">${b.phone}</a>`)}
    </table>
    ${b.notes
      ? `<hr style="border:none;border-top:1px solid #eee;margin:24px 0;" /><h2 style="margin:0 0 6px;font-size:15px;color:#111;">Notes</h2><p style="margin:0;color:#333;font-size:14px;line-height:1.6;white-space:pre-wrap;">${b.notes}</p>`
      : ""}
  </td></tr>
</table>
</body></html>`;
}

function buildEmailText(b: BookingNotificationPayload) {
  const rushLabel =
    b.rush === "24h"
      ? "24-Hour Rush"
      : b.rush === "48h"
      ? "48-Hour Rush"
      : "Standard (14 business days)";
  return [
    `NEW BOOKING · ${b.serviceName}`,
    "",
    `Service:    ${b.serviceName}`,
    `Package:    ${b.packageName} · $${b.totalDollars}`,
    `Date:       ${b.date}`,
    `Time:       ${formatTime12(b.startTime)} – ${formatTime12(b.endTime)} (${b.duration})`,
    `Location:   ${b.location}`,
    `Payment:    ${b.payment}`,
    `Delivery:   ${rushLabel}`,
    b.afterHours ? `After-hours: +$25 surcharge` : null,
    "",
    `Client:     ${b.name}`,
    `Email:      ${b.email}`,
    `Phone:      ${b.phone}`,
    b.notes ? `\nNotes:\n${b.notes}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * Send a booking notification to Josh. Returns `{ sent: true }` on success,
 * or `{ sent: false, reason }` if Resend isn't configured or the call failed
 * (caller should not 500 the booking flow on email failure).
 */
export async function sendBookingNotification(
  b: BookingNotificationPayload
): Promise<{ sent: boolean; reason?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("[email] RESEND_API_KEY unset — skipping notification.");
    return { sent: false, reason: "RESEND_API_KEY not configured" };
  }

  const to = process.env.BOOKING_TO_EMAIL || "shotsbyjoshv.photography@gmail.com";
  // Default to Resend's test sender. Once shotsbyjoshv.com is verified in Resend,
  // override BOOKING_FROM to e.g. "ShotsByJoshV <bookings@shotsbyjoshv.com>".
  const from = process.env.BOOKING_FROM || "ShotsByJoshV <onboarding@resend.dev>";

  try {
    const resend = new Resend(apiKey);
    const subject = `New booking · ${b.name} · ${b.serviceName} · ${b.date}`;
    const res = await resend.emails.send({
      from,
      to: [to],
      replyTo: b.email,
      subject,
      html: buildEmailHtml(b),
      text: buildEmailText(b),
    });
    if (res.error) {
      console.error("[email] Resend error:", res.error);
      return { sent: false, reason: res.error.message };
    }
    console.log("[email] sent booking notification to", to);
    return { sent: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[email] threw:", msg);
    return { sent: false, reason: msg };
  }
}
