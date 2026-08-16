/**
 * Server-side Square SDK client.
 *
 * Reads from env vars (set these in Vercel):
 *   SQUARE_ACCESS_TOKEN  — production access token from Square Developer Dashboard
 *   SQUARE_ENVIRONMENT   — "production" | "sandbox"   (defaults to "production")
 *   SQUARE_WEBHOOK_SIGNATURE_KEY — for verifying webhooks (optional but recommended)
 *
 * NEVER import this from a client component. Server routes / actions only.
 */
import { SquareClient, SquareEnvironment } from "square";

let _client: SquareClient | null = null;

export function getSquareClient(): SquareClient {
  if (_client) return _client;
  const token = process.env.SQUARE_ACCESS_TOKEN;
  if (!token) {
    throw new Error(
      "SQUARE_ACCESS_TOKEN is not set. Add it in Vercel → Settings → Environment Variables."
    );
  }
  const envName = (process.env.SQUARE_ENVIRONMENT ?? "production").toLowerCase();
  const environment =
    envName === "sandbox"
      ? SquareEnvironment.Sandbox
      : SquareEnvironment.Production;
  _client = new SquareClient({ token, environment });
  return _client;
}

/** Helper: dollars (e.g. 250.50) → BigInt cents for Square's Money type. */
export function dollarsToCents(dollars: number): bigint {
  return BigInt(Math.round(dollars * 100));
}
