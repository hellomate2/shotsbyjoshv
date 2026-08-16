import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Booking confirmation pages are personal — no point indexing them.
        disallow: ["/api/", "/booking/confirmation"],
      },
    ],
    sitemap: "https://shotsbyjoshv.com/sitemap.xml",
    host: "https://shotsbyjoshv.com",
  };
}
