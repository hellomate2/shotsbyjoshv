# ShotsByJoshV

A production photography website built for a Long Island photographer launching to real paying clients. Live at **[shotsbyjoshv.com](https://shotsbyjoshv.com)**.

Modeled after the kind of editorial portfolio site you'd expect from a studio in Paris or New York: glassy nav, intro overlay, masonry gallery with lightbox, animated hero, magnetic CTAs, and a 5-step booking flow that takes real card payments via Square or locks in a pay-in-person session.

## What's in the box

| Surface | What it does |
|---|---|
| **Marketing site** | Hero with rotating Ken-Burns photos, services grid, masonry portfolio with category filter, about, footer. Built mobile-first with GSAP for animation. |
| **Booking flow** | Multi-step modal: pick service → package tier → date and time → contact details → review and confirm. Address autocomplete, after-hours surcharge detection, rush delivery add-ons, hard-checked terms agreement. |
| **Payments** | Card path creates a Square hosted Payment Link with the full booking encoded as line items, redirects the buyer to Square, then returns to a confirmation page. Pay-in-person path skips payment and emails the photographer. |
| **Notifications** | Every confirmed booking emails the photographer through Resend with a clean HTML summary of the client, service, time, location, payment method, and notes. |
| **Time-slot persistence** | Confirmed bookings get written to Vercel Blob; the date/time picker fetches the list on mount and greys out taken slots automatically. |
| **SEO** | Single canonical `<h1>`, JSON-LD `LocalBusiness` schema, Open Graph + Twitter cards, dynamic sitemap and robots, and a weekly Google rank-tracking cron via DataForSEO. |
| **Analytics** | Vercel Analytics for page views, Vercel Speed Insights for Core Web Vitals. Privacy-first, no cookie banner needed. |
| **Accessibility** | Real `<h1>`, semantic headings, `aria-invalid` + `aria-describedby` on form fields, focus rings for keyboard users, full `prefers-reduced-motion` support. |

## Stack

- **Next.js 14** App Router, React 18, TypeScript
- **Tailwind CSS** + custom design tokens in `globals.css`
- **GSAP** ScrollTrigger + ScrollToPlugin for hero / gallery / reveals
- **Square** SDK for Card payments (hosted Checkout)
- **Resend** for transactional booking emails
- **Vercel Blob** for booking time-slot persistence
- **DataForSEO** for weekly rank-tracking via Vercel Cron
- **Vercel** for hosting, Edge Network, Analytics, Cron

## Architecture

```
app/
  layout.tsx                 head, metadata, JSON-LD schema, Analytics, Speed Insights
  page.tsx                   homepage composition
  globals.css                design tokens, button styles, reveal helpers
  icon.svg / apple-icon.svg  favicon (Next auto-detects)
  robots.ts / sitemap.ts     SEO metadata routes
  booking/confirmation/page.tsx   Square-redirect landing
  api/
    checkout/route.ts        POST → Square hosted payment link
    booking-notify/route.ts  POST → email + persist time slot
    bookings/route.ts        GET booked slots, POST a new slot
    square/webhook/route.ts  Square payment webhook (HMAC verified)
    seo/rank-snapshot/route.ts  Weekly cron, fetches Google ranks

components/
  Hero · Services · Gallery · About · Footer · Navbar
  BookingContext · BookingModal
  booking/  StepService · StepPackage · StepDateTime · StepDetails · StepReview
  ui/       Calendar · Lightbox · ProgressBar
  ClientWrapper · IntroOverlay · FloatingBookNow · BackToTop · ScrollProgress · LoadBar

lib/
  constants.ts        services, packages, gallery, ToS, hours, locations
  types.ts            shared TypeScript types
  square.ts           server-only Square client
  email.ts            Resend wrapper, HTML + plain-text booking emails
  bookings-store.ts   Vercel Blob persistence helpers
  dataforseo.ts       DataForSEO HTTP wrapper + target keywords
  animations.ts       small GSAP helpers (reveals, native smooth-scroll)

scripts/
  configure-secrets.sh  one-shot interactive setup for every Vercel env var
```

## Local development

```bash
git clone https://github.com/<you>/shotsbyjoshv.git
cd shotsbyjoshv
npm install
cp .env.example .env.local        # then fill in Square / Resend keys
npm run dev                       # http://localhost:3000
```

## Environment variables

All optional except where noted. Bookings still work without any of them; you just lose the corresponding feature.

| Var | Required? | What it unlocks |
|---|---|---|
| `SQUARE_ACCESS_TOKEN` | for Card payments | Production token from Square Developer Dashboard |
| `SQUARE_LOCATION_ID` | for Card payments | Location ID from Square Dev Dashboard (starts with `L`) |
| `SQUARE_ENVIRONMENT` | yes | `production` or `sandbox` |
| `SQUARE_WEBHOOK_SIGNATURE_KEY` | optional | HMAC-verifies inbound webhooks |
| `RESEND_API_KEY` | for booking emails | From resend.com |
| `BOOKING_TO_EMAIL` | optional | Where to send booking notifications |
| `BOOKING_FROM` | optional | Default `onboarding@resend.dev`; override after verifying your domain in Resend |
| `BLOB_READ_WRITE_TOKEN` | for slot persistence | Auto-provisioned by Vercel when you enable Blob storage |
| `DATAFORSEO_LOGIN` / `DATAFORSEO_PASSWORD` | for rank tracking | API credentials |
| `CRON_SECRET` | recommended | Locks down the rank-snapshot endpoint |
| `NEXT_PUBLIC_CONTACT_EMAIL` | yes | Public-facing contact email |

Easiest way to set them all: run `bash scripts/configure-secrets.sh` from the project root. The script prompts for each value with hidden password-style input, then redeploys.

## Day-to-day editing

90% of content changes live in **`lib/constants.ts`**:

- `SERVICES` and `SERVICE_PACKAGES` for what's offered and at what price
- `GALLERY` for photo order and captions
- `LOCATION_SUGGESTIONS` for the address autocomplete dropdown
- `TIME_SLOTS`, `STANDARD_HOURS_START/END`, `AFTER_HOURS_SURCHARGE` for the calendar
- `TERMS_OF_SERVICE` for the ToS shown on the review step

To add a new photo: drop the JPG in `public/photos/<category>/`, then add an entry to `GALLERY`.

## Deploying

The Vercel project is already linked. One command:

```bash
vercel --prod
```

If the repo is connected to GitHub, every push to `main` auto-deploys to production and every branch gets a preview URL.

## Notes I learned building this

- **Don't trust the access token = the location ID.** Square's Developer Dashboard puts them on different tabs and they look similar enough that copy-paste mistakes are common. I added a pattern-matching error handler that surfaces `LOCATION` codes with actionable copy.
- **Vercel Cron on Hobby is once-daily max.** The weekly rank tracker runs Monday 9am ET via cron syntax, gated by the schedule field.
- **Resend without a verified domain still works** but is rate-limited and lands in spam more often. Verifying `shotsbyjoshv.com` takes 4 DNS records and 5 minutes.
- **Em-dashes everywhere read as "written by an AI"** to a lot of readers in 2026. I purged them from every user-facing string and replaced with periods or middle dots.

## License

Code: MIT. Photos in `public/photos/` are the photographer's property and not licensed for redistribution.
