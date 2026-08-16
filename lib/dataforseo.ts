/**
 * DataForSEO client (server-only).
 *
 * Reads from env vars set in Vercel:
 *   DATAFORSEO_LOGIN     — email used at dataforseo.com
 *   DATAFORSEO_PASSWORD  — API password from Dashboard → API Access
 *
 * Auth = HTTP Basic. We deliberately keep this thin — DataForSEO has hundreds
 * of endpoints; we only need one: SERP Live (Google Organic).
 *
 * Pricing: ~$0.60 per 1000 queries. Checking 5 keywords weekly = ~20/month
 * = ~$0.01/month. Negligible.
 */

const BASE = "https://api.dataforseo.com/v3";

function authHeader() {
  const login = process.env.DATAFORSEO_LOGIN;
  const password = process.env.DATAFORSEO_PASSWORD;
  if (!login || !password) {
    throw new Error(
      "DATAFORSEO_LOGIN / DATAFORSEO_PASSWORD not set. Add them in Vercel env vars."
    );
  }
  return `Basic ${Buffer.from(`${login}:${password}`).toString("base64")}`;
}

export interface RankSnapshot {
  keyword: string;
  location: string;
  // 1 = top of page 1, etc. null = not in top 100.
  ourRank: number | null;
  // The URL of ours that's ranking (if any).
  ourUrl: string | null;
  // Total organic results returned (sanity check).
  totalResults: number;
  fetchedAt: string;
}

interface SerpItem {
  rank_group?: number;
  rank_absolute?: number;
  url?: string;
  domain?: string;
}

/**
 * Fetch where `targetDomain` ranks for a given keyword/location.
 * Returns null rank if the domain isn't in the top 100 organic results.
 */
export async function fetchRank(
  keyword: string,
  locationName: string,
  targetDomain: string
): Promise<RankSnapshot> {
  const body = [
    {
      keyword,
      location_name: locationName,
      language_code: "en",
      device: "desktop",
      os: "macos",
      // Search 100 results so we can see rank up to position 100.
      depth: 100,
    },
  ];

  const res = await fetch(`${BASE}/serp/google/organic/live/advanced`, {
    method: "POST",
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    // No caching — we want fresh ranking data.
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`DataForSEO ${res.status}: ${await res.text()}`);
  }

  const json = (await res.json()) as {
    tasks?: Array<{
      result?: Array<{
        items?: SerpItem[];
        items_count?: number;
      }>;
    }>;
  };

  const result = json.tasks?.[0]?.result?.[0];
  const items = result?.items ?? [];
  const targetMatch = items.find((it) =>
    (it.domain ?? "").toLowerCase().includes(targetDomain.toLowerCase())
  );

  return {
    keyword,
    location: locationName,
    ourRank: targetMatch?.rank_absolute ?? null,
    ourUrl: targetMatch?.url ?? null,
    totalResults: result?.items_count ?? items.length,
    fetchedAt: new Date().toISOString(),
  };
}

/** Target keywords + locations to track weekly. Edit freely. */
export const SEO_TARGETS: Array<{ keyword: string; location: string }> = [
  { keyword: "shotsbyjoshv", location: "New York,United States" },
  { keyword: "long island photographer", location: "New York,United States" },
  {
    keyword: "prom photographer long island",
    location: "New York,United States",
  },
  {
    keyword: "graduation photographer long island",
    location: "New York,United States",
  },
  {
    keyword: "car photographer long island",
    location: "New York,United States",
  },
  {
    keyword: "meadowbrook polo photographer",
    location: "New York,United States",
  },
];

export const TARGET_DOMAIN = "shotsbyjoshv.com";
