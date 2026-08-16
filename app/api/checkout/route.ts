/**
 * POST /api/checkout
 *
 * Creates a Square-hosted payment link for the booking and returns the URL
 * the browser should redirect to. The user pays on Square's secure page,
 * Square sends them an automatic email receipt, and redirects them back to
 * /booking/confirmation when done.
 *
 * Request body shape — see `CheckoutBody` below.
 */
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { dollarsToCents, getSquareClient } from "@/lib/square";

export const runtime = "nodejs";

type CheckoutBody = {
  serviceName: string;
  packageName: string;
  // total in dollars (already includes after-hours + rush)
  totalDollars: number;
  // booking details to surface on the Square page + receipt
  name: string;
  email: string;
  phone: string;
  location: string;
  // ISO date + 24h time, so Josh has them in his Square notes
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  rush: "none" | "48h" | "24h";
  afterHours: boolean;
  notes?: string;
};

function buildPaymentNote(b: CheckoutBody) {
  const lines = [
    `${b.serviceName} · ${b.packageName}`,
    `${b.date}  ${b.startTime}–${b.endTime} (${b.duration})`,
    `Client: ${b.name} · ${b.phone} · ${b.email}`,
    `Location: ${b.location}`,
    b.afterHours ? "After-hours surcharge applied" : null,
    b.rush !== "none" ? `Rush delivery: ${b.rush}` : null,
    b.notes ? `Notes: ${b.notes}` : null,
  ].filter(Boolean);
  // Square caps the note at 500 chars
  return lines.join(" | ").slice(0, 500);
}

export async function POST(req: Request) {
  let body: CheckoutBody;
  try {
    body = (await req.json()) as CheckoutBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Basic server-side validation — never trust client price math.
  if (
    !body.serviceName ||
    !body.packageName ||
    typeof body.totalDollars !== "number" ||
    !Number.isFinite(body.totalDollars) ||
    body.totalDollars <= 0 ||
    body.totalDollars > 5000 // sanity ceiling
  ) {
    return NextResponse.json(
      { error: "Missing or invalid booking fields" },
      { status: 400 }
    );
  }
  if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const origin = req.headers.get("origin") || new URL(req.url).origin;

  const locationId = process.env.SQUARE_LOCATION_ID;
  if (!locationId) {
    console.error(
      "[/api/checkout] SQUARE_LOCATION_ID is not set in Vercel env vars"
    );
    return NextResponse.json(
      {
        error:
          "Card payments are not configured yet. Choose Pay In Person, or contact us to book.",
      },
      { status: 503 }
    );
  }

  try {
    const client = getSquareClient();
    const idempotencyKey = randomUUID();
    const itemName = `${body.serviceName} · ${body.packageName}`.slice(0, 255);

    const response = await client.checkout.paymentLinks.create({
      idempotencyKey,
      quickPay: {
        name: itemName,
        priceMoney: {
          amount: dollarsToCents(body.totalDollars),
          currency: "USD",
        },
        locationId,
      },
      checkoutOptions: {
        // Square auto-emails the buyer their receipt; we just need the redirect.
        redirectUrl: `${origin}/booking/confirmation`,
        askForShippingAddress: false,
        merchantSupportEmail:
          process.env.NEXT_PUBLIC_CONTACT_EMAIL ||
          "shotsbyjoshv.photography@gmail.com",
      },
      prePopulatedData: {
        buyerEmail: body.email,
        buyerPhoneNumber: body.phone || undefined,
      },
      paymentNote: buildPaymentNote(body),
    });

    const url = response.paymentLink?.url;
    if (!url) {
      return NextResponse.json(
        { error: "Square did not return a checkout URL" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      url,
      paymentLinkId: response.paymentLink?.id ?? null,
      orderId: response.paymentLink?.orderId ?? null,
    });
  } catch (err) {
    // Surface a friendly, actionable message based on the actual Square error.
    // We log the raw error for ops, and pattern-match the common ones so the
    // UI can tell the user what to do (vs. the generic "try again" wall).
    console.error("[/api/checkout] Square error:", err);

    // Pull a useful string out of whatever shape the SDK threw.
    type SquareLikeError = {
      errors?: Array<{ code?: string; detail?: string; category?: string }>;
      statusCode?: number;
      body?: { errors?: Array<{ code?: string; detail?: string }> };
    };
    const e = err as SquareLikeError & Error;
    const allErrors =
      e?.errors ?? e?.body?.errors ?? [];
    const codes = allErrors.map((x) => x.code).filter(Boolean) as string[];
    const details = allErrors.map((x) => x.detail).filter(Boolean) as string[];
    const codeStr = codes.join(", ");
    const detailStr = details.join(" | ");
    const status = e?.statusCode ?? 500;
    const rawMessage = e?.message || "";

    // Diagnostic dump — visible in Vercel function logs.
    console.error(
      "[/api/checkout] codes=", codeStr,
      "details=", detailStr,
      "status=", status,
      "raw=", rawMessage
    );

    let msg =
      "Could not create card checkout right now. Please choose Pay In Person. We'll be in touch.";

    if (
      codes.some((c) => /UNAUTHORIZED|AUTHENTICATION/i.test(c)) ||
      status === 401
    ) {
      msg =
        "Card payments aren't authenticated correctly. Please pay in person. We'll resolve this shortly.";
    } else if (
      codes.some((c) => /MERCHANT_SUBSCRIPTION_NOT_FOUND|FORBIDDEN|ACTIVATION/i.test(c)) ||
      /activate/i.test(detailStr) ||
      status === 403
    ) {
      msg =
        "Online card payments are being activated by Square. Please choose Pay In Person. We'll be in touch about your booking.";
    } else if (codes.some((c) => /LOCATION/i.test(c))) {
      msg =
        "There's a payment configuration issue on our end. Please choose Pay In Person. We'll be in touch.";
    } else if (rawMessage.includes("SQUARE_ACCESS_TOKEN")) {
      msg = rawMessage;
    }

    return NextResponse.json(
      {
        error: msg,
        // Diagnostic envelope visible only to admins via the dashboard logs.
        // (Not surfaced in the UI — the friendly `error` string is what shows.)
        debug:
          process.env.NODE_ENV !== "production"
            ? { codes: codeStr, details: detailStr, status }
            : undefined,
      },
      { status: status >= 400 && status < 600 ? status : 500 }
    );
  }
}
