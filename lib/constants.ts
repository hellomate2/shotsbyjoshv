import type {
  GalleryImage,
  Service,
  ServicePackages,
} from "./types";

// Hand-picked from Josh's real portfolio so each service card feels distinct:
//   - Prom uses a close stone-steps portrait (intimate, vertical)
//   - Graduation uses a different subject entirely (casual outdoor portrait,
//     matches the "cap & gown OR casual" pitch on the service)
//   - Custom uses the editorial pool-edge shot for the full-width banner
const SERVICE_IMG_PROM = "/photos/outdoor/03.jpg";
const SERVICE_IMG_GRADUATION = "/photos/outdoor/02.jpg";
const SERVICE_IMG_CUSTOM = "/photos/outdoor/05.jpg";

// ============================================================================
// SERVICES
// ============================================================================
export const SERVICES: Service[] = [
  {
    id: "outdoor",
    name: "Outdoor Portraits",
    short:
      "Natural-light portraits shot outdoors at a location of your choice",
    description:
      "Natural-light portraits shot outdoors at a location of your choice. Outfit changes are welcome. Just bring what you need.",
    startingFrom: 75,
    image: "/photos/outdoor/01.jpg",
    images: [
      "/photos/outdoor/01.jpg",
      "/photos/outdoor/06.jpg",
      "/photos/outdoor/04.jpg",
    ],
  },
  {
    id: "prom",
    name: "Prom Photos",
    short:
      "Quick outdoor session before prom. Individuals, couples, groups",
    description:
      "Quick outdoor session before prom covering individuals, couples, and group shots. Best done 30–45 minutes before you head out.",
    startingFrom: 75,
    image: SERVICE_IMG_PROM,
  },
  {
    id: "graduation",
    name: "Graduation Photos",
    short:
      "Celebrate your milestone with cap and gown or casual portraits",
    description:
      "Celebrate your milestone with outdoor photos in your cap and gown, casual fits, or both.",
    startingFrom: 100,
    image: SERVICE_IMG_GRADUATION,
  },
  {
    id: "sports",
    name: "Sports Coverage",
    short: "Action shots at games, matches, or practices",
    description:
      "Action shots at games, matches, or practices. Great for clubs, teams, or individual athletes building a highlights portfolio.",
    startingFrom: 250,
    image: "/photos/sports/04.jpg",
    images: [
      "/photos/sports/04.jpg",
      "/photos/sports/02.jpg",
      "/photos/sports/05.jpg",
      "/photos/sports/01.jpg",
      "/photos/sports/03.jpg",
    ],
  },
  {
    id: "events",
    name: "Event Coverage",
    short:
      "Candid + posed coverage of birthdays, school events, and gatherings",
    description:
      "Candid and posed coverage of birthdays, school events, team gatherings, and more. Delivered as a full edited online gallery.",
    startingFrom: 200,
    image: "/photos/events/01.jpg",
    images: [
      "/photos/events/01.jpg",
      "/photos/events/03.jpg",
      "/photos/events/05.jpg",
      "/photos/events/02.jpg",
    ],
  },
  {
    id: "cars",
    name: "Car Photography",
    short: "Outdoor automotive sessions. Your car, your spot, your vibe",
    description:
      "Outdoor automotive photography. Bring your car to a location of your choice and we'll capture it in its best light.",
    startingFrom: 75,
    image: "/photos/cars/01.jpg",
    images: [
      "/photos/cars/01.jpg",
      "/photos/cars/03.jpg",
      "/photos/cars/02.jpg",
      "/photos/cars/04.jpg",
    ],
  },
  {
    id: "custom",
    name: "Custom Request",
    short: "Don't see what you're looking for? Let's build something",
    description:
      "Don't see what you're looking for? Reach out and we'll put together something that works for you.",
    startingFrom: 75,
    image: SERVICE_IMG_CUSTOM,
  },
];

// ============================================================================
// PACKAGE TIERS PER SERVICE
// ============================================================================
export const SERVICE_PACKAGES: ServicePackages[] = [
  {
    serviceId: "outdoor",
    tiers: [
      {
        id: "outdoor-30",
        name: "30 Minutes",
        price: 75,
        durationMinutes: 30,
        description: "30-minute session · 15 edited photos · 1 location",
      },
      {
        id: "outdoor-60",
        name: "1 Hour",
        price: 150,
        durationMinutes: 60,
        description:
          "1-hour session · 25 edited photos · outfit changes welcome",
        popular: true,
      },
      {
        id: "outdoor-120",
        name: "2 Hours",
        price: 250,
        durationMinutes: 120,
        description:
          "2-hour session · 40 edited photos · multiple looks & locations",
      },
    ],
  },
  {
    serviceId: "prom",
    tiers: [
      {
        id: "prom-30",
        name: "30 Minutes",
        price: 75,
        durationMinutes: 30,
        description:
          "30-minute session · 20 edited photos · individuals, couples & group shots",
        popular: true,
      },
      {
        id: "prom-60",
        name: "1 Hour",
        price: 175,
        durationMinutes: 60,
        description:
          "1-hour session · 50 edited photos · full group + portraits",
      },
    ],
  },
  {
    serviceId: "graduation",
    tiers: [
      {
        id: "grad-30",
        name: "30 Minutes",
        price: 100,
        durationMinutes: 30,
        description:
          "30-minute session · 20 edited photos · cap & gown or casual",
        popular: true,
      },
      {
        id: "grad-60",
        name: "1 Hour",
        price: 175,
        durationMinutes: 60,
        description:
          "1-hour session · 35 edited photos · cap & gown + casual outfits",
      },
    ],
  },
  {
    serviceId: "sports",
    tiers: [
      {
        id: "sports-2",
        name: "2 Hours",
        price: 250,
        durationMinutes: 120,
        description: "2 hours coverage · 50 edited photos · online gallery",
        popular: true,
        addOnNote: "Additional hours +$60/hr",
      },
      {
        id: "sports-4",
        name: "4 Hours",
        price: 400,
        durationMinutes: 240,
        description:
          "4 hours coverage · 100 edited photos · online gallery",
        addOnNote: "Additional hours +$60/hr",
      },
    ],
  },
  {
    serviceId: "events",
    tiers: [
      {
        id: "event-2",
        name: "2 Hours",
        price: 200,
        durationMinutes: 120,
        description:
          "2 hours coverage · 40 edited photos · online gallery",
        popular: true,
        addOnNote: "Additional hours +$100/hr",
      },
      {
        id: "event-4",
        name: "4 Hours",
        price: 350,
        durationMinutes: 240,
        description:
          "4 hours coverage · 65 edited photos · online gallery",
        addOnNote: "Additional hours +$100/hr",
      },
    ],
  },
  {
    serviceId: "cars",
    tiers: [
      {
        id: "cars-30",
        name: "30 Minutes",
        price: 75,
        durationMinutes: 30,
        description: "30-minute session · 15 edited photos · 1 location",
      },
      {
        id: "cars-60",
        name: "1 Hour",
        price: 150,
        durationMinutes: 60,
        description:
          "1-hour session · 25 edited photos · multiple angles & details",
        popular: true,
      },
      {
        id: "cars-120",
        name: "2 Hours",
        price: 250,
        durationMinutes: 120,
        description:
          "2-hour session · 40 edited photos · multiple locations welcome",
      },
    ],
  },
  {
    serviceId: "custom",
    tiers: [
      {
        id: "custom-base",
        name: "Custom Request",
        price: 75,
        durationMinutes: 60,
        description:
          "Tell us what you have in mind in the notes. We'll tailor a package and confirm pricing before the shoot.",
        popular: true,
      },
    ],
  },
];

// ============================================================================
// GALLERY — curated from Josh's photos
//
// Order matters: photos are interleaved across categories so the "All" view
// doesn't stack 4-6 photos of the same subject in a row. Use the filter pills
// to see a single category in full.
// ============================================================================
const GALLERY_RAW: GalleryImage[] = [
  // Row 1
  { id: "sp04", src: "/photos/sports/04.jpg", alt: "Polo player on horseback", category: "Sports", span: "tall" },
  { id: "out01", src: "/photos/outdoor/01.jpg", alt: "Outdoor portrait in natural light", category: "Outdoor" },
  { id: "ev01", src: "/photos/events/01.jpg", alt: "Event coverage candid", category: "Events", span: "wide" },
  { id: "car01", src: "/photos/cars/01.jpg", alt: "Automotive exterior shot", category: "Cars" },

  // Row 2
  { id: "out04", src: "/photos/outdoor/04.jpg", alt: "Editorial outdoor portrait", category: "Outdoor", span: "tall" },
  { id: "sp01", src: "/photos/sports/01.jpg", alt: "Athlete in motion", category: "Sports", span: "wide" },
  { id: "ev02", src: "/photos/events/02.jpg", alt: "Celebration moment", category: "Events" },

  // Row 3
  { id: "car04", src: "/photos/cars/04.jpg", alt: "Car portrait at golden hour", category: "Cars" },
  { id: "out02", src: "/photos/outdoor/02.jpg", alt: "Outdoor portrait session", category: "Outdoor" },
  { id: "sp05", src: "/photos/sports/05.jpg", alt: "Polo match in motion at Meadowbrook", category: "Sports" },
  { id: "ev04", src: "/photos/events/04.jpg", alt: "Candid event detail", category: "Events", span: "tall" },

  // Row 4
  { id: "out03", src: "/photos/outdoor/03.jpg", alt: "Portrait with golden hour light", category: "Outdoor" },
  { id: "sp02", src: "/photos/sports/02.jpg", alt: "Sports action shot", category: "Sports" },
  { id: "car02", src: "/photos/cars/02.jpg", alt: "Car detail shot", category: "Cars" },
  { id: "ev03", src: "/photos/events/03.jpg", alt: "Group photo at event", category: "Events" },

  // Row 5
  { id: "out05", src: "/photos/outdoor/05.jpg", alt: "Outdoor portrait in soft afternoon light", category: "Outdoor" },
  { id: "sp03", src: "/photos/sports/03.jpg", alt: "Athlete mid-play", category: "Sports" },
  { id: "ev05", src: "/photos/events/05.jpg", alt: "Event coverage guest portrait", category: "Events" },
  { id: "car03", src: "/photos/cars/03.jpg", alt: "Automotive lifestyle shot", category: "Cars" },

  // Row 6
  { id: "out06", src: "/photos/outdoor/06.jpg", alt: "Outdoor lifestyle portrait", category: "Outdoor" },
  { id: "sp06", src: "/photos/sports/06.jpg", alt: "Sports highlight moment", category: "Sports" },
  { id: "ev06", src: "/photos/events/06.jpg", alt: "Event coverage wide shot", category: "Events" },

  // NOTE: No Prom or Graduation entries yet. The filter pills for those
  // categories will only appear once Josh adds real photos here (replace this
  // comment with entries shaped like the outdoor ones above).
];

// Defensive de-dupe by src so a copy/paste mistake later can never show the
// same photo twice.
export const GALLERY: GalleryImage[] = (() => {
  const seen = new Set<string>();
  return GALLERY_RAW.filter((g) => {
    if (seen.has(g.src)) return false;
    seen.add(g.src);
    return true;
  });
})();

// Hero carousel images (cinematic, full-bleed)
export const HERO_IMAGES = [
  { src: "/photos/cars/01.jpg", alt: "Automotive photography by ShotsByJoshV" },
  { src: "/photos/sports/04.jpg", alt: "Polo match at Meadowbrook Country Polo Club" },
  { src: "/photos/events/01.jpg", alt: "Event coverage candid moment" },
  { src: "/photos/outdoor/04.jpg", alt: "Outdoor portrait session" },
];

/**
 * About-section portrait. Drop a square or 4:5 portrait JPG at
 * `/public/photos/about/josh.jpg` (recommended at least 900x1200) and it
 * shows up here automatically. Falls back to one of Josh's own outdoor
 * portraits so we never display a stock "random person".
 */
export const ABOUT_IMAGE = "/photos/about/josh.jpg";
export const ABOUT_IMAGE_FALLBACK = "/photos/outdoor/04.jpg";

// ============================================================================
// TIME SLOTS — 7 AM through 7 PM (standard operating hours)
// ============================================================================
export const TIME_SLOTS = [
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
];

/** Hours outside of [STANDARD_HOURS_START, STANDARD_HOURS_END) trigger a surcharge. */
export const STANDARD_HOURS_START = 7; // 7 AM
export const STANDARD_HOURS_END = 19; // 7 PM
export const AFTER_HOURS_SURCHARGE = 25;

/** Rush delivery add-on pricing. */
export const RUSH_PRICING = {
  none: 0,
  "48h": 50,
  "24h": 75,
} as const;

// ============================================================================
// PAYMENT — Venmo interim (Card via Square launches late June 2026)
// ============================================================================
/** Josh's Venmo handle. */
export const VENMO_USERNAME = "Joshua-Velasquez-57";
/** Direct profile URL — the fallback if the pay-intent URL ever stops working. */
export const VENMO_PROFILE_URL = `https://venmo.com/u/${VENMO_USERNAME}`;

/** Build a prefilled Venmo pay URL.
 *
 *  The `https://venmo.com/?txn=pay&recipients=...&amount=...&note=...` format
 *  opens Venmo's web pay screen with the amount and note already populated.
 *  On mobile, the Venmo app intercepts the link and opens the native pay sheet.
 *  If anything in the chain fails, the user still lands on Josh's profile.
 */
export function buildVenmoPayUrl(amountDollars: number, note: string): string {
  const params = new URLSearchParams({
    txn: "pay",
    recipients: VENMO_USERNAME,
    amount: amountDollars.toFixed(2),
    note,
  });
  return `https://venmo.com/?${params.toString()}`;
}

/** When the Card option will become available. Shown next to the disabled
 *  Card payment tile so clients know what to expect. */
export const CARD_PAYMENT_AVAILABLE_LABEL = "Coming late June";

/** Common Long Island venue / area suggestions for the location field. */
export const LOCATION_SUGGESTIONS = [
  "Long Beach, NY",
  "Jones Beach State Park, Wantagh, NY",
  "Sands Point Preserve, Sands Point, NY",
  "Old Westbury Gardens, Old Westbury, NY",
  "Planting Fields Arboretum, Oyster Bay, NY",
  "Sunken Meadow State Park, Kings Park, NY",
  "Eisenhower Park, East Meadow, NY",
  "Belmont Lake State Park, Babylon, NY",
  "Heckscher State Park, East Islip, NY",
  "Caumsett State Historic Park, Lloyd Harbor, NY",
  "Bayard Cutting Arboretum, Great River, NY",
  "Montauk Point Lighthouse, Montauk, NY",
  "Robert Moses State Park, Babylon, NY",
  "Meadowbrook Polo Club, Old Westbury, NY",
  "Cedar Beach, Mount Sinai, NY",
];

// ============================================================================
// TERMS OF SERVICE
// ============================================================================
export const TERMS_OF_SERVICE = `TERMS OF SERVICE · ShotsByJoshV Photography

1. BOOKING & PAYMENT
By confirming your booking, you agree to pay the full session fee via your selected payment method. ShotsByJoshV Photography accepts two forms of payment:

• Card: Clients who choose to pay by card must pay the full session fee at the time of booking online in order to secure their session date. Card payments are processed securely online. This payment is non-refundable except as outlined in the Cancellation Policy below.

• Cash: Clients who choose to pay with cash must pay the full session fee upon arrival and before the session begins. Cash, personal check (made out to Joshua V), and Venmo are all accepted as cash-equivalent payments on the day of the session. Sessions will not commence until payment has been received in full. If a cash client arrives without payment or is unable to pay, the session will be immediately cancelled and the client will be charged a $50 wasted trip fee. This fee must be paid in full by card or cash before any new session date will be issued.

Returned & Bounced Checks: In the event that a personal check is returned or bounced for any reason, the client will be responsible for the full original session fee plus a $35 returned check fee. ShotsByJoshV Photography reserves the right to require future payments from that client to be made in cash or by card only.

Chargebacks: In the event of a card payment dispute or chargeback, the client remains responsible for the full session fee and any associated fees incurred as a result of the dispute.

2. CANCELLATION POLICY
Card Payments: Because card clients pay in full at the time of booking, cancellations made more than 24 hours before the scheduled session will receive a full refund. Cancellations made within 24 hours of the session are non-refundable. No-shows will not be refunded under any circumstances.

Cash Payments: Because cash clients pay upon arrival, cancellations made more than 24 hours before the session will not be charged. Cancellations made within 24 hours of the session will be charged a $25 cancellation fee, which must be paid before a new session can be booked. No-shows will be charged the full session fee, which must be paid before a new session can be booked.

Wasted Trip Fee: If a cash client arrives at the session location without payment or fails to pay upon arrival, a $50 wasted trip fee will be charged in addition to any applicable cancellation fees. No new session date will be issued until this fee has been paid in full by card or cash.

ShotsByJoshV Photography reserves the right to cancel any session at any time. In the event of a photographer-initiated cancellation, card clients will receive a full refund and cash clients will not be charged. This refund or waiver shall be the client's sole remedy. No-shows are defined as a client failing to arrive within 30 minutes of the scheduled session start time without prior notice.

3. RESCHEDULING
Rescheduling is permitted up to 24 hours before the session at no additional charge, subject to availability. Each client is allowed a maximum of two reschedules per booking. Requests to reschedule within 24 hours of the session will be treated as a cancellation and subject to the cancellation policy above.

4. AFTER-HOURS SURCHARGE
Standard operating hours are 7:00 AM – 7:00 PM. Sessions scheduled outside of these hours are subject to a $25 surcharge, which will be added to the total session fee and is due upon arrival along with the remaining balance.

5. OVERTIME & EVENT EXTENSIONS
If a session or event runs beyond the originally scheduled end time, and the client requests that ShotsByJoshV Photography stay longer, coverage may be extended strictly at the photographer's discretion and subject to availability. Overtime coverage will be billed at a rate of $50 per 30-minute increment. Payment for any overtime incurred must be paid in full via card or cash-equivalent before the final image gallery will be delivered.

6. IMAGE DELIVERY
Edited images will be delivered within 14 business days of the session via an online gallery link. Expedited delivery may be available for an additional fee. Please inquire at the time of booking. Online galleries will remain active for 30 days from the date of delivery, after which they may be removed. Clients are responsible for downloading and saving their images within this period. ShotsByJoshV Photography makes every effort to back up and safeguard all images; however, in the rare event of data loss due to equipment failure or circumstances beyond our control, liability is limited to a reshoot at no additional cost where reasonably possible.

7. COPYRIGHT & IMAGE USAGE
All images are the sole property of ShotsByJoshV Photography. Upon delivery, clients receive a personal-use license for all images in their gallery. This license permits the client to print, share, and post images for personal purposes only. Commercial use rights are not included and must be purchased separately. Clients may not alter, edit, crop, filter, or remove any watermark from delivered images without prior written consent. Unauthorized commercial use of images will be subject to licensing fees and/or legal action. When sharing images on Instagram or any other social media platform, credit to @shotsbyjosh.v_llc on Instagram is greatly appreciated.

8. MODEL RELEASE & MINOR POLICY
By booking a session, the client grants ShotsByJoshV Photography the right to use any images from the session for portfolio, website, social media, and promotional purposes, unless a written opt-out request is submitted prior to the session.

Minors: For sessions involving minors (individuals under the age of 18), a parent or legal guardian must complete and return a signed Minor Release Form no later than 48 hours before the scheduled session. The minor's session will not take place until the completed form has been received and confirmed by ShotsByJoshV Photography. If the form is not received within this window, the session will be cancelled. Card clients will receive a full refund. Cash clients will not be charged. ShotsByJoshV Photography is not responsible for sessions lost due to a failure to submit the required form on time.

9. LIABILITY
ShotsByJoshV Photography is not liable for circumstances beyond our control, including but not limited to severe weather, venue access restrictions, or equipment failure. In the event of such an occurrence, every effort will be made to reschedule the session at no additional cost. ShotsByJoshV Photography is not liable for any injury, damage, or loss sustained by the client or any third party during the session. Clients assume full responsibility for themselves and any individuals they bring to the session, including minors.

Third Party & Background Subjects: Sessions taking place at public events or locations may incidentally capture third parties in the background. ShotsByJoshV Photography is not liable for the incidental capture of third parties in images taken at public venues or events. The client agrees not to use any delivered images in any way that could be considered harassing, defamatory, or invasive of a third party's privacy. Responsibility for the appropriate use of delivered images rests solely with the client.

10. GOVERNING LAW
These terms and conditions shall be governed by and construed in accordance with the laws of the State of New York. Any disputes arising from this agreement shall be resolved in the appropriate courts of New York.`;

// External links
export const INSTAGRAM_URL = "https://www.instagram.com/shotsbyjosh.v_llc/";
export const MEADOWBROOK_URL = "https://meadowbrookpoloclub.com/";
export const CONTACT_EMAIL = "shotsbyjoshv.photography@gmail.com";

// ============================================================================
// FAQ — single source of truth for the homepage FAQ section AND the FAQPage
// JSON-LD in app/layout.tsx. Keep answers factual and in sync with the
// packages, RUSH_PRICING, hours, and TERMS_OF_SERVICE above.
// ============================================================================
export const FAQS: { question: string; answer: string }[] = [
  {
    question: "How do I book a session?",
    answer:
      "Tap Book Now anywhere on the site, pick your service and package, choose a date and time, and confirm. The whole thing takes about two minutes online. You can also email or DM on Instagram if you'd rather talk it through first.",
  },
  {
    question: "How much does a photo session cost?",
    answer:
      "Sessions start at $75 for outdoor portraits, prom, and car photography, $100 for graduation, $200 for event coverage, and $250 for sports coverage. Every package shows exactly how long the session runs and how many edited photos are included before you book.",
  },
  {
    question: "When will I get my photos?",
    answer:
      "Your fully edited gallery is delivered within 14 business days as an online link you can download and share. Need them faster? Add 48-hour rush delivery for $50 or 24-hour rush for $75 when you book.",
  },
  {
    question: "How does payment work?",
    answer:
      process.env.NEXT_PUBLIC_CARD_PAYMENTS === "true"
        ? "Pay securely online by card or Venmo when you book, or pay in person by cash or check at the session. Card and Venmo payments lock in your date immediately."
        : "Pay the full session fee through Venmo when you book to lock in your date, or pay in person by cash or check at the session. Secure online card payments are coming soon.",
  },
  {
    question: "Where do sessions happen?",
    answer:
      "Anywhere on Long Island. Josh is based in Jericho and shoots across Nassau and Suffolk County at a location you choose: parks, beaches, your home, your venue, or your favorite spot. Not sure where? He'll suggest a location that fits your session.",
  },
  {
    question: "What hours are you available?",
    answer:
      "Sessions run seven days a week from 7 AM to 7 PM. Sunrise or late-evening sessions outside those hours are available for a $25 after-hours surcharge.",
  },
  {
    question: "Can I reschedule or cancel?",
    answer:
      "Yes. Reschedule free up to 24 hours before your session, up to two times per booking, subject to availability. Requests within 24 hours of the session are treated as cancellations. The full cancellation policy is shown before you confirm any booking.",
  },
];
