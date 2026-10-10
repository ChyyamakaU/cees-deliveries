import Link from 'next/link';
import { ArrowRight, Construction } from 'lucide-react';

export default function AuthComingSoon({
  eyebrow,
  title,
  description,
  altText,
  altHref,
  altLabel,
}) {
  return (
    <main className="relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grid-soft opacity-60" />
      <div className="relative mx-auto flex max-w-2xl flex-col items-center px-[55px] py-20 text-center sm:py-28">
        <span className="grid h-16 w-16 place-items-center rounded-3xl bg-brand text-white shadow-xl shadow-brand/25">
          <Construction className="h-7 w-7" aria-hidden="true" />
        </span>

        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-brand">
          {eyebrow}
        </p>
        <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 max-w-md leading-relaxed text-ink-soft">{description}</p>

        <div className="mt-6 rounded-2xl border border-solar/40 bg-solar-tint px-5 py-3 text-sm font-medium text-solar-ink">
          This screen is a placeholder — the full flow ships in an upcoming build.
        </div>

        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/#services"
            className="group inline-flex items-center gap-2 rounded-full bg-coral px-6 py-3 text-sm font-bold text-white shadow-lg shadow-coral/30 transition-all duration-200 hover:-translate-y-0.5"
          >
            Book a Delivery
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
          <Link
            href={altHref}
            className="inline-flex items-center gap-2 rounded-full border border-ink/12 bg-white px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-coral/40 hover:text-coral"
          >
            {altLabel}
          </Link>
        </div>

        <p className="mt-6 text-sm text-ink-soft">
          {altText}{' '}
          <Link href={altHref} className="font-semibold text-brand underline-offset-4 hover:underline">
            {altLabel}
          </Link>
        </p>
      </div>
    </main>
  );
}
