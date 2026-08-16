/**
 * Square redirects here after a successful card payment.
 * Square handles the receipt email automatically.
 */
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Booking Confirmed · ShotsByJoshV",
};

export default function ConfirmationPage({
  searchParams,
}: {
  searchParams: { transactionId?: string; orderId?: string };
}) {
  const ref = searchParams.transactionId || searchParams.orderId || null;
  return (
    <main className="min-h-screen bg-bone flex items-center justify-center px-6 py-16">
      <div className="max-w-xl w-full bg-white rounded-sm shadow-sm border border-ink/10 p-9 md:p-12 text-center">
        <CheckCircle2
          size={56}
          strokeWidth={1.4}
          className="mx-auto text-gold mb-6"
        />
        <p
          className="text-[0.7rem] tracking-[0.32em] uppercase text-gold mb-3"
          style={{ fontWeight: 500 }}
        >
          Payment Received
        </p>
        <h1 className="serif text-3xl md:text-5xl text-ink leading-tight">
          You&apos;re booked.
        </h1>
        <p className="mt-5 text-ink/70 text-[15px] leading-relaxed">
          Square has emailed you a receipt. Josh will follow up shortly to
          confirm the final details of your session.
        </p>
        {ref && (
          <p className="mt-4 text-[12.5px] text-ink/50">
            Reference: <code className="font-mono">{ref}</code>
          </p>
        )}
        <div className="mt-9">
          <Link href="/" className="btn btn-outline">
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
