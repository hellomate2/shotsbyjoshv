/**
 * Simple booking-slot persistence on Vercel Blob.
 *
 * One JSON blob at `bookings/index.json` holds every confirmed slot. When the
 * date/time picker loads it fetches this list and disables any taken slots.
 * When a booking is confirmed we write the new slot back.
 *
 * Trade-offs:
 *   - Read-modify-write is not atomic, but for a low-volume photography site
 *     two concurrent bookings hitting the same second is vanishingly unlikely.
 *   - Stored slots auto-expire: anything before today is filtered out on read.
 *   - Free Vercel Blob tier is plenty for thousands of bookings.
 *
 * Requires `BLOB_READ_WRITE_TOKEN` env var. Vercel auto-provisions this when
 * you create a Blob store via dashboard → Project → Storage → Create → Blob.
 */
import { head, list, put } from "@vercel/blob";

const PATHNAME = "bookings/index.json";

export interface BookedSlot {
  /** ISO yyyy-mm-dd */
  date: string;
  /** "HH:MM" 24-hour, e.g. "14:00" */
  time: string;
  /** Minutes the session occupies (we block exactly this slot for v1). */
  durationMinutes: number;
  /** When the booking was recorded. */
  bookedAt: string;
  /** Free-form label for debugging; never shown to clients. */
  label?: string;
}

interface Store {
  version: 1;
  slots: BookedSlot[];
}

function emptyStore(): Store {
  return { version: 1, slots: [] };
}

function isBlobConfigured() {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

/** Drop entries for past dates so the file doesn't grow forever. */
function pruneStale(slots: BookedSlot[]): BookedSlot[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return slots.filter((s) => {
    const d = new Date(s.date + "T00:00:00");
    return d >= today;
  });
}

async function findBlobUrl(): Promise<string | null> {
  try {
    const { blobs } = await list({ prefix: PATHNAME, limit: 1 });
    const match = blobs.find((b) => b.pathname === PATHNAME);
    return match?.url ?? null;
  } catch (e) {
    console.error("[bookings-store] list failed:", e);
    return null;
  }
}

/** Read all currently-booked slots. Safe to call from server components / API. */
export async function getBookedSlots(): Promise<BookedSlot[]> {
  if (!isBlobConfigured()) return [];
  try {
    const url = await findBlobUrl();
    if (!url) return [];
    // Cache-bust query so we never get a stale read.
    const res = await fetch(`${url}?t=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = (await res.json()) as Store;
    return pruneStale(data.slots ?? []);
  } catch (e) {
    console.error("[bookings-store] read failed:", e);
    return [];
  }
}

/** Append a new booked slot. Returns false on failure (caller should not 500). */
export async function addBookedSlot(slot: BookedSlot): Promise<boolean> {
  if (!isBlobConfigured()) {
    console.log("[bookings-store] BLOB_READ_WRITE_TOKEN unset, skipping.");
    return false;
  }
  try {
    const existing = await getBookedSlots();
    // Defensive de-dupe: don't double-count if someone double-clicks.
    const duplicate = existing.some(
      (s) => s.date === slot.date && s.time === slot.time
    );
    const next: Store = {
      version: 1,
      slots: duplicate ? existing : [...existing, slot],
    };
    await put(PATHNAME, JSON.stringify(next), {
      access: "public", // file content is public, but URL is unguessable
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
      cacheControlMaxAge: 0,
    });
    return true;
  } catch (e) {
    console.error("[bookings-store] write failed:", e);
    return false;
  }
}

/** For debugging — returns metadata without reading the contents. */
export async function bookingsMetadata() {
  try {
    const url = await findBlobUrl();
    if (!url) return null;
    return await head(url);
  } catch {
    return null;
  }
}
