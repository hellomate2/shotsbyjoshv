export type ServiceId =
  | "outdoor"
  | "prom"
  | "graduation"
  | "sports"
  | "events"
  | "cars"
  | "custom";

export interface Service {
  id: ServiceId;
  name: string;
  short: string;
  startingFrom: number;
  description: string;
  /** Primary card image — also the SSR/no-JS fallback. */
  image: string;
  /** Optional extra images for the service-card auto-slideshow.
   *  When 2+ images are present (including `image` if absent here), the card
   *  crossfades through them. Falls back to a single static image otherwise. */
  images?: string[];
}

export interface PackageTier {
  id: string;
  name: string;
  price: number;
  /** Duration of the session in minutes (used to compute end time + summary). */
  durationMinutes: number;
  description: string;
  popular?: boolean;
  /** Optional add-on note shown below price (e.g. "+$60/hr for additional hours"). */
  addOnNote?: string;
}

export interface ServicePackages {
  serviceId: ServiceId;
  tiers: PackageTier[];
}

export type GalleryCategory =
  | "All"
  | "Outdoor"
  | "Prom"
  | "Graduation"
  | "Sports"
  | "Events"
  | "Cars";

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: Exclude<GalleryCategory, "All">;
  span?: "wide" | "tall" | "square";
  /** Set true for stock/placeholder photos so Josh can find & replace them. */
  placeholder?: boolean;
}

/** Payment method picked at checkout.
 *  - "Venmo": user is redirected to Josh's Venmo with prefilled amount + note.
 *  - "Pay In Person": cash/check at the session location.
 *  - "Card": card processing via Square — coming late June (currently disabled in UI). */
export type PaymentMethod = "Venmo" | "Pay In Person" | "Card";

/** Rush order add-on (faster delivery turnaround). */
export type RushOrder = "none" | "48h" | "24h";

export interface BookingDetails {
  name: string;
  email: string;
  phone: string;
  location: string;
  payment: PaymentMethod | "";
  rush: RushOrder;
  notes: string;
}

export interface BookingState {
  step: 1 | 2 | 3 | 4 | 5;
  service: Service | null;
  pkg: PackageTier | null;
  date: string | null; // ISO date
  time: string | null; // "09:00", "14:00"
  details: BookingDetails;
  agreedToTerms: boolean;
  confirmed: boolean;
}
