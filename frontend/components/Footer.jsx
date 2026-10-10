import Link from 'next/link';
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  ArrowUpRight,
  Youtube,
} from 'lucide-react';
import Logo from '@/components/Logo';

const serviceLinks = [
  { label: 'Food Delivery', href: '/#services' },
  { label: 'Groceries', href: '/#services' },
  { label: 'Packages', href: '/#services' },
  { label: 'Courier', href: '/#services' },
];

const supportLinks = [
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Track Delivery', href: '/#track' },
  { label: 'Help & Support', href: '/help' },
  { label: 'Become a Rider', href: '/register?role=RIDER' },
];

/**
 * Social accounts do not exist yet. They are rendered as clearly-marked
 * placeholders rather than links that pretend to lead somewhere.
 */
const socials = [
  { label: 'Instagram', Icon: Instagram },
  { label: 'Facebook', Icon: Facebook },
  { label: 'LinkedIn', Icon: Linkedin },
  { label: 'YouTube', Icon: Youtube },
];

const contact = [
  {
    Icon: Mail,
    label: 'support@ceesdeliveries.com',
    href: 'mailto:support@ceesdeliveries.com',
  },
  { Icon: Phone, label: '+234 800 000 0000', href: 'tel:+2348000000000' },
  { Icon: MapPin, label: 'Victoria Island, Lagos, Nigeria', href: null },
];

export default function Footer() {
  return (
    <footer className="relative bg-ink text-white">
      <div
        aria-hidden="true"
        className="h-1.5 w-full bg-brand"
      />

      <div className="mx-auto max-w-[100rem] px-[55px]">
        <div className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr] lg:gap-8">
          <div className="max-w-sm">
            <Logo tone="light" />
            <p className="mt-5 text-sm leading-relaxed text-white/70">
              Cee&apos;s Deliveries moves food, groceries, packages and same-day courier
              items across your city — booked in seconds and tracked in real time.
            </p>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-white/40">
              Coming soon
            </p>
            <ul className="mt-3 flex flex-wrap gap-2.5">
              {socials.map(({ label, Icon }) => (
                <li key={label}>
                  <span
                    aria-disabled="true"
                    title={`${label} — coming soon`}
                    className="grid h-10 w-10 cursor-not-allowed place-items-center rounded-xl border border-white/10 bg-white/5 text-white/45"
                  >
                    <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                    <span className="sr-only">{label} (coming soon)</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-labelledby="footer-services">
            <h2
              id="footer-services"
              className="font-display text-sm font-bold uppercase tracking-[0.12em] text-white"
            >
              Services
            </h2>
            <ul className="mt-5 space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-solar focus-visible:text-solar"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-support">
            <h2
              id="footer-support"
              className="font-display text-sm font-bold uppercase tracking-[0.12em] text-white"
            >
              Company
            </h2>
            <ul className="mt-5 space-y-3">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-solar focus-visible:text-solar"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-display text-sm font-bold uppercase tracking-[0.12em] text-white">
              Contact
            </h2>
            <ul className="mt-5 space-y-3.5">
              {contact.map(({ Icon, label, href }) => (
                <li key={label} className="flex items-start gap-3 text-sm text-white/70">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-solar" aria-hidden="true" />
                  {href ? (
                    <a
                      href={href}
                      className="transition-colors hover:text-solar focus-visible:text-solar"
                    >
                      {label}
                    </a>
                  ) : (
                    <span>{label}</span>
                  )}
                </li>
              ))}
            </ul>

            <Link
              href="/book"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-coral px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-coral/25 transition-transform duration-200 hover:-translate-y-0.5 focus-visible:-translate-y-0.5"
            >
              Book a Delivery
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 py-7 text-sm text-white/50 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Cee&apos;s Deliveries. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/terms" className="transition-colors hover:text-white focus-visible:text-white">
              Terms of Service
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-white focus-visible:text-white">
              Privacy Policy
            </Link>
            <span className="hidden text-white/30 md:inline" aria-hidden="true">
              •
            </span>
            <span className="text-xs text-white/35">
              Demo build — social &amp; legal pages are placeholders.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
