import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Page not found",
};

// Branded 404 — replaces Next's default so a dead link still feels like the
// site (and still routes people toward booking instead of bouncing).
export default function NotFound() {
  return (
    <main className="relative min-h-[100svh] bg-ink flex items-center justify-center overflow-hidden px-6">
      <div className="absolute inset-0 opacity-30">
        <Image
          src="/photos/outdoor/04.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          quality={70}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/60 to-ink" />
      </div>

      <div className="relative z-10 text-center max-w-lg">
        <p
          className="text-gold mb-5"
          style={{
            fontSize: "0.7rem",
            letterSpacing: "0.45em",
            textTransform: "uppercase",
          }}
        >
          404 · Out of frame
        </p>
        <h1 className="display text-white text-[clamp(2.6rem,8vw,5.5rem)] leading-[0.98] m-0">
          This shot doesn&apos;t{" "}
          <em style={{ fontStyle: "italic", color: "#C9A96E" }}>exist.</em>
        </h1>
        <p className="mt-6 text-white/65 text-[15px] leading-relaxed">
          The page you&apos;re looking for was moved, renamed, or never made it
          out of the darkroom.
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex items-center gap-2 px-8 py-4 bg-white text-ink text-[0.7rem] tracking-[0.28em] uppercase hover:bg-gold transition-colors duration-500 rounded-sm"
        >
          Back to the portfolio
        </Link>
      </div>
    </main>
  );
}
