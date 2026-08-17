import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { FAQS } from "@/lib/constants";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://shotsbyjoshv.com"),
  title: {
    default: "ShotsByJoshV · Joshua Velasquez · Photographer in Jericho, Long Island NY",
    template: "%s · ShotsByJoshV",
  },
  description:
    "ShotsByJoshV is the photography studio of Joshua Velasquez, a freelance photographer based in Jericho, Long Island, NY. Official photographer of Meadowbrook Country Polo Club. Book portraits, prom, graduation, sports, events, and car sessions online.",
  applicationName: "ShotsByJoshV",
  authors: [{ name: "Josh Velasquez", url: "https://shotsbyjoshv.com" }],
  creator: "Josh Velasquez",
  publisher: "ShotsByJoshV Photography",
  keywords: [
    // Brand
    "ShotsByJoshV",
    "Shots By Josh V",
    "shotsbyjosh.v_llc",
    "shotsbyjoshv.com",
    // Personal name variants
    "Joshua Velasquez photographer",
    "Josh Velasquez photographer",
    "Josh V photography",
    "Josh Velasquez Jericho",
    "Joshua Velasquez Long Island",
    // Hyper-local
    "photographer Jericho NY",
    "photographer Jericho New York",
    "freelance photographer Jericho",
    "freelance photographer Long Island",
    "photographer near me Jericho",
    "Long Island photographer",
    "Nassau County photographer",
    "Suffolk County photographer",
    // Service + location combos
    "prom photographer Jericho",
    "prom photographer Long Island",
    "graduation photographer Jericho",
    "graduation photographer Long Island",
    "senior portrait photographer Long Island",
    "sports photographer Long Island",
    "event photographer Long Island",
    "car photographer Long Island",
    "automotive photographer New York",
    // Meadowbrook
    "Meadowbrook Polo Club photographer",
    "Meadowbrook Country Polo photography",
    "polo photographer New York",
  ],
  category: "photography",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    title:
      "ShotsByJoshV · Joshua Velasquez · Photographer in Jericho, Long Island NY",
    description:
      "Freelance photographer Joshua Velasquez, based in Jericho, Long Island. Portraits, prom, grad, sports, events, and cars. Official photographer of the Meadowbrook Country Polo Club.",
    url: "https://shotsbyjoshv.com",
    siteName: "ShotsByJoshV",
    images: [
      // Custom-built branded social card (1200×630) — what shows up in
      // iMessage / Slack / Twitter / Facebook link previews.
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ShotsByJoshV · Photography · Jericho, Long Island NY",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ShotsByJoshV · Joshua Velasquez · Jericho, NY",
    description:
      "Portraits, prom, grad, sports, events, and cars. Long Island, NY.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    // Drop your Google Search Console TXT/meta tag here once you verify
    // the domain in https://search.google.com/search-console
    // google: "your-verification-string",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1,
};

// JSON-LD: tells Google "this is a real local photography business" → eligible
// for rich results / knowledge panel. The @graph form lets us declare both the
// LocalBusiness and the Person (Joshua Velasquez) so name searches resolve.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["LocalBusiness", "ProfessionalService", "Photograph"],
      "@id": "https://shotsbyjoshv.com/#business",
      name: "ShotsByJoshV Photography",
      alternateName: ["Shots By Josh V", "ShotsByJoshV", "shotsbyjosh.v_llc"],
      description:
        "Freelance photography studio in Jericho, Long Island NY, run by Joshua Velasquez. Portraits, prom, graduation, sports, events, and car photography. Official photographer of the Meadowbrook Country Polo Club.",
      url: "https://shotsbyjoshv.com",
      image: "https://shotsbyjoshv.com/og-image.jpg",
      logo: "https://shotsbyjoshv.com/icon-512.png",
      email: "shotsbyjoshv.photography@gmail.com",
      founder: { "@id": "https://shotsbyjoshv.com/#person" },
      employee: { "@id": "https://shotsbyjoshv.com/#person" },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Jericho",
        addressRegion: "NY",
        postalCode: "11753",
        addressCountry: "US",
      },
      areaServed: [
        { "@type": "City", name: "Jericho, NY" },
        { "@type": "City", name: "Syosset, NY" },
        { "@type": "City", name: "Old Westbury, NY" },
        { "@type": "City", name: "Woodbury, NY" },
        { "@type": "City", name: "Plainview, NY" },
        { "@type": "City", name: "Hicksville, NY" },
        { "@type": "City", name: "Oyster Bay, NY" },
        { "@type": "City", name: "Garden City, NY" },
        { "@type": "AdministrativeArea", name: "Nassau County, NY" },
        { "@type": "AdministrativeArea", name: "Suffolk County, NY" },
        { "@type": "Place", name: "Long Island, NY" },
      ],
      priceRange: "$$",
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "07:00",
        closes: "19:00",
      },
      sameAs: ["https://www.instagram.com/shotsbyjosh.v_llc/"],
      makesOffer: [
        { "@type": "Offer", name: "Outdoor Portraits", priceCurrency: "USD", price: "75" },
        { "@type": "Offer", name: "Prom Photography", priceCurrency: "USD", price: "75" },
        { "@type": "Offer", name: "Graduation Photography", priceCurrency: "USD", price: "100" },
        { "@type": "Offer", name: "Sports Coverage", priceCurrency: "USD", price: "250" },
        { "@type": "Offer", name: "Event Coverage", priceCurrency: "USD", price: "200" },
        { "@type": "Offer", name: "Car Photography", priceCurrency: "USD", price: "75" },
      ],
    },
    {
      "@type": "Person",
      "@id": "https://shotsbyjoshv.com/#person",
      name: "Joshua Velasquez",
      alternateName: ["Josh Velasquez", "Josh V"],
      jobTitle: "Owner & Lead Photographer",
      worksFor: { "@id": "https://shotsbyjoshv.com/#business" },
      url: "https://shotsbyjoshv.com",
      image: "https://shotsbyjoshv.com/photos/about/josh.jpg",
      email: "shotsbyjoshv.photography@gmail.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Jericho",
        addressRegion: "NY",
        addressCountry: "US",
      },
      sameAs: ["https://www.instagram.com/shotsbyjosh.v_llc/"],
    },
    {
      // FAQ rich-result eligibility. Answers come from the same FAQS constant
      // that renders the on-page FAQ section, so they can never drift apart.
      "@type": "FAQPage",
      "@id": "https://shotsbyjoshv.com/#faq",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="antialiased bg-white text-ink font-sans selection:bg-gold/30 selection:text-ink">
        {children}
        <script
          type="application/ld+json"
          // Safe: static, no user input. Lets Google parse the business info.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Free on Vercel Hobby. Page-view counts + Core Web Vitals dashboard. */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
