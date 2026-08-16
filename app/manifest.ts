import type { MetadataRoute } from "next";

/**
 * PWA / web app manifest.
 *
 * Tells mobile browsers what icon, name, and theme to use when a visitor
 * adds the site to their home screen. Also surfaced by some search engines
 * (notably Edge / Bing) as additional brand metadata.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ShotsByJoshV — Joshua Velasquez Photography",
    short_name: "ShotsByJoshV",
    description:
      "Freelance photography in Jericho, Long Island NY. Portraits, prom, graduation, sports, events, and cars.",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0A0A",
    theme_color: "#0A0A0A",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
