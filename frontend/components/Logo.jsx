import Link from 'next/link';

export default function Logo({ className = '', tone = 'dark' }) {
  return (
    <Link
      href="/"
      aria-label="Cee's Deliveries home"
      className={`group flex items-center gap-2.5 ${className}`}
    >
      <span className="relative grid h-10 w-10 place-items-center rounded-2xl bg-brand shadow-lg shadow-brand/30 transition-transform duration-300 group-hover:-rotate-6">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
          <path
            d="M12 2.8 19.5 6.6v7.1L12 17.5 4.5 13.7V6.6L12 2.8Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="M4.7 6.7 12 10.4l7.3-3.7" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M12 10.4v7" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-coral ring-2 ring-vanilla" />
      </span>
      <span
        className={`font-display text-[1.35rem] font-extrabold leading-none tracking-tight ${
          tone === 'light' ? 'text-white' : 'text-ink'
        }`}
      >
        Cee&apos;s{' '}
        <span className={tone === 'light' ? 'text-solar' : 'text-brand'}>Deliveries</span>
      </span>
    </Link>
  );
}
