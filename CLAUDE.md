# shotsbyjoshv.com — source code

Photography portfolio + booking site for Josh Velasquez. Next.js 14 (App Router),
Tailwind, deployed on Vercel under Dev's account (`dev-lakhanis-projects/shotsbyjoshv`,
production domain shotsbyjoshv.com, domain registered at GoDaddy).

## History
Built May 2026 on a different computer (source was never in git/GitHub). Recovered
2026-08-16 from Vercel deployment `dpl_AcVdz6qPEqkEQeFpuJj2xvGA1L9s` via the API.
This folder is now the authoritative source of truth.

## Where things live
- All display text, pricing, packages, terms: `lib/constants.ts` (single source of truth)
- Instagram/contact links: `INSTAGRAM_URL` etc. in `lib/constants.ts` (now @shotsbyjosh.v_llc)
- Photos: `public/photos/{cars,events,outdoor,sports,about}/` — swap files, keep names
- Booking flow: `components/booking/Step*.tsx`, orchestrated by `components/BookingModal.tsx`
- Square checkout: `app/api/checkout/route.ts` + `lib/square.ts` (Square-hosted payment links)
- Booking emails: `lib/email.ts` via Resend
- Env vars documented in `.env.example`

## Card payments (Square) — CURRENT STATE
The Card tile in booking is gated by `NEXT_PUBLIC_CARD_PAYMENTS === "true"` (see
`components/booking/StepDetails.tsx`). It is currently OFF because the
SQUARE_ACCESS_TOKEN / SQUARE_LOCATION_ID stored in Vercel (added May 2026) are
INVALID — live /api/checkout returns the Square-failure fallback error (tested
2026-08-16). To turn Card on:
1. Get from Josh's Square Developer Dashboard (production): Access Token + Location ID
2. `vercel env rm SQUARE_ACCESS_TOKEN production` then `vercel env add ...` (same for location)
3. `vercel env add NEXT_PUBLIC_CARD_PAYMENTS production` → `true`
4. `vercel deploy --prod` and test a $1 checkout end-to-end

## Deploying
`vercel deploy --prod --yes` (project already linked via `.vercel/`; log in as Dev first).
