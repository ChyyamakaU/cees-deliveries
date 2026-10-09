import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

/**
 * Reusable delivery-category card. Styling slots (`card`, `iconTile`, `button`,
 * `badge`, `glow`) are passed in so the palette stays centralised in the caller.
 */
export default function ServiceCard({
  Icon,
  title,
  description,
  cta,
  href = '/book',
  card = 'bg-white border-ink/10 hover:border-brand/40',
  iconTile = 'from-brand to-violet',
  iconText = 'text-white',
  glow = 'bg-brand/20',
  button = 'bg-brand text-white group-hover:bg-brand-dark',
  badge,
}) {
  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-ink/10 ${card}`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-70 blur-2xl transition-opacity duration-300 group-hover:opacity-90 ${glow}`}
      />

      <div className="relative flex items-start justify-between">
        <span
          className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br shadow-lg ${iconText} ${iconTile}`}
        >
          <Icon className="h-7 w-7" strokeWidth={2.1} aria-hidden="true" />
        </span>
        {badge ? (
          <span
            className={`rounded-full px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wide shadow-sm ${badge.className}`}
          >
            {badge.label}
          </span>
        ) : null}
      </div>

      <h3 className="relative mt-6 font-display text-xl font-extrabold text-ink">{title}</h3>
      <p className="relative mt-2 text-sm leading-relaxed text-ink-soft">{description}</p>

      <Link
        href={href}
        className={`relative mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition-colors duration-300 sm:mt-auto sm:pt-3 ${button}`}
      >
        {cta}
        <ArrowRight
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
          aria-hidden="true"
        />
      </Link>
    </article>
  );
}
