/**
 * POST /api/square/webhook
 *
 * Receives Square payment events (e.g. `payment.updated`, `payment.created`).
 * Verifies the HMAC signature so random POSTs can't fake completions.
 *
 * To wire this up in Square Developer Dashboard:
 *   1. Webhooks → Add Endpoint → URL = https://shotsbyjoshv.com/api/square/webhook
 *   2. Subscribe to: payment.created, payment.updated
 *   3. Copy the "Signature Key" → set as SQUARE_WEBHOOK_SIGNATURE_KEY in Vercel.
 *
 * For v1 this just logs the event. Extend to e.g. email Josh, write to a DB,
 * or trigger a Slack notification.
 */
import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";

export const runtime = "nodejs";

function verifySignature(
  rawBody: string,
  notificationUrl: string,
  receivedSignature: string,
  signatureKey: string
): boolean {
  // Square's signature = HMAC-SHA256(signatureKey, notificationUrl + rawBody), base64
  const payload = notificationUrl + rawBody;
  const expected = createHmac("sha256", signatureKey)
    .update(payload)
    .digest("base64");
  try {
    const a = Buffer.from(expected);
    const b = Buffer.from(receivedSignature);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const signatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
  const rawBody = await req.text();

  if (signatureKey) {
    const sig =
      req.headers.get("x-square-hmacsha256-signature") ||
      req.headers.get("x-square-signature") ||
      "";
    const notificationUrl =
      process.env.SQUARE_WEBHOOK_URL ||
      `${new URL(req.url).origin}/api/square/webhook`;
    const ok = verifySignature(rawBody, notificationUrl, sig, signatureKey);
    if (!ok) {
      return NextResponse.json({ error: "Bad signature" }, { status: 401 });
    }
  } else {
    // If no signature key is configured we accept but warn — useful for first-time setup.
    console.warn(
      "[square/webhook] SQUARE_WEBHOOK_SIGNATURE_KEY not set; skipping verification."
    );
  }

  let event: { type?: string; data?: unknown } = {};
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Log for now. Extend here: email Josh, write to a DB, etc.
  console.log("[square/webhook] event:", event.type, event.data);

  return NextResponse.json({ received: true });
}
