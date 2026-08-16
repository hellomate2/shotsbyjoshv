/**
 * GET /api/seo/rank-snapshot
 *
 * Fetches current Google rankings for every keyword in SEO_TARGETS and logs
 * the snapshot. Designed to be hit by Vercel Cron weekly — see vercel.json.
 *
 * For local debugging:  curl http://localhost:3000/api/seo/rank-snapshot
 * To protect from public abuse, set CRON_SECRET in Vercel env vars. Vercel Cron
 * automatically sends it in the Authorization header for scheduled invocations.
 */
import { NextResponse } from "next/server";
import {
  fetchRank,
  SEO_TARGETS,
  TARGET_DOMAIN,
  type RankSnapshot,
} from "@/lib/dataforseo";

export const runtime = "nodejs";
// Force dynamic — never cache. Each run hits DataForSEO live.
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  // Vercel Cron sends `Authorization: Bearer <CRON_SECRET>` when configured.
  // If you set CRON_SECRET we require it; otherwise we accept all (handy for
  // local dev and one-off manual runs).
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = req.headers.get("authorization") || "";
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const results: RankSnapshot[] = [];
    const errors: Array<{ keyword: string; error: string }> = [];

    // Sequential (not parallel) to be polite to DataForSEO's rate limits and
    // to keep total spend predictable.
    for (const t of SEO_TARGETS) {
      try {
        const snap = await fetchRank(t.keyword, t.location, TARGET_DOMAIN);
        results.push(snap);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        errors.push({ keyword: t.keyword, error: msg });
      }
    }

    // Pretty-print to Vercel function logs. Josh / dev can see this in the
    // Vercel dashboard → Project → Logs.
    console.log(
      "[SEO Snapshot]",
      new Date().toISOString(),
      "\n" +
        results
          .map(
            (r) =>
              `  ${r.keyword.padEnd(40)} → ${
                r.ourRank ? `#${r.ourRank}` : "not in top 100"
              }`
          )
          .join("\n")
    );
    if (errors.length) {
      console.error("[SEO Snapshot] errors:", errors);
    }

    return NextResponse.json({
      fetchedAt: new Date().toISOString(),
      targetDomain: TARGET_DOMAIN,
      results,
      errors,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("[SEO Snapshot] fatal:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
