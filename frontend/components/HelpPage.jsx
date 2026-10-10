import Link from 'next/link';
import {
  ArrowRight,
  ChevronDown,
  LifeBuoy,
  Mail,
  MessageCircle,
  Phone,
  Search,
} from 'lucide-react';
import Container from './ui/Container';
import Button from './ui/Button';

const FAQS = [
  {
    q: 'How do I track my delivery?',
    a: 'Every booking gets a tracking code (for example CD-DEMO-0001). Enter it in the “Track Delivery” box on the homepage, or open the delivery from your dashboard to see live status updates on the timeline.',
  },
  {
    q: 'How is the delivery fee calculated?',
    a: 'Pricing is distance-based: a base fee plus a per-kilometre rate, multiplied by your package size (small, medium or large). You will always see the exact price on the review step before you confirm.',
  },
  {
    q: 'Can I cancel a delivery?',
    a: 'Yes — until a rider is on the way. Open the delivery from your dashboard and choose “Cancel delivery”. Once a delivery is picked up, in transit or delivered it can no longer be cancelled, but our support team can help.',
  },
  {
    q: 'What happens after I book?',
    a: 'Your request is created as Pending, our team confirms it, then a verified rider is assigned. You will follow each step — Confirmed, Assigned, Picked up, In transit, Delivered — on the delivery timeline.',
  },
  {
    q: 'How do I become a rider?',
    a: 'Create an account and choose the Rider role, then add your vehicle details. A quick verification by our team unlocks job offers — you can accept confirmed deliveries and update their status as you go.',
  },
  {
    q: 'Is online payment available?',
    a: 'Online payment is not live yet. Deliveries are settled on delivery for now, and the price shown when you book is the price you pay.',
  },
];

const CHANNELS = [
  {
    icon: Phone,
    title: 'Call us',
    detail: '+234 800 000 0000',
    href: 'tel:+2348000000000',
    note: 'Mon–Sat, 8am–8pm',
  },
  {
    icon: Mail,
    title: 'Email us',
    detail: 'support@ceesdeliveries.com',
    href: 'mailto:support@ceesdeliveries.com',
    note: 'We reply within a day',
  },
];

function Faq() {
  return (
    <div className="divide-y divide-ink/8 overflow-hidden rounded-3xl border border-ink/10 bg-white">
      {FAQS.map((item) => (
        <details key={item.q} className="group px-6 py-5 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left">
            <span className="font-display font-bold text-ink">{item.q}</span>
            <ChevronDown
              className="h-5 w-5 shrink-0 text-ink-soft transition-transform duration-200 group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-soft">{item.a}</p>
        </details>
      ))}
    </div>
  );
}

export default function HelpPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-grid-soft">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-lilac blur-3xl"
          aria-hidden="true"
        />
        <Container className="relative py-16 sm:py-20">
          <span className="inline-flex items-center gap-2 rounded-full bg-lilac px-4 py-1.5 text-sm font-bold text-brand">
            <LifeBuoy className="h-4 w-4" aria-hidden="true" />
            Help & Support
          </span>
          <h1 className="mt-5 max-w-2xl font-display text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
            How can we help you today?
          </h1>
          <p className="mt-3 max-w-xl text-ink-soft">
            Answers to the questions we hear most, plus real people you can reach whenever you need a
            hand.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button href="/#track">
              <Search className="h-4 w-4" aria-hidden="true" />
              Track a delivery
            </Button>
            <Button href="/book" variant="secondary">
              Book a delivery
            </Button>
          </div>
        </Container>
      </section>

      <Container className="py-14 sm:py-20">
        <div className="grid gap-5 sm:grid-cols-2">
          {CHANNELS.map(({ icon: Icon, title, detail, href, note }) => (
            <a
              key={title}
              href={href}
              className="flex items-start gap-4 rounded-3xl border border-ink/10 bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-lg hover:shadow-ink/5"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-lilac text-brand">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <p className="font-display font-bold text-ink">{title}</p>
                <p className="text-sm font-semibold text-brand">{detail}</p>
                <p className="text-xs text-ink-soft">{note}</p>
              </div>
            </a>
          ))}

          <div className="flex items-start gap-4 rounded-3xl border border-dashed border-ink/15 bg-white/60 p-6 sm:col-span-2">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-solar-tint text-solar-ink">
              <MessageCircle className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <p className="font-display font-bold text-ink">
                Live chat <span className="text-sm font-semibold text-ink-soft">· coming soon</span>
              </p>
              <p className="text-sm text-ink-soft">
                In-app chat with your rider and support is on the way. For now, call or email us and we
                will take care of it.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink">
            Frequently asked questions
          </h2>
          <p className="mt-1 text-ink-soft">A few of the things customers ask us most.</p>
          <div className="mt-6">
            <Faq />
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center gap-4 rounded-3xl bg-brand p-8 text-center text-white sm:p-10">
          <h2 className="font-display text-2xl font-extrabold">Still need a hand?</h2>
          <p className="max-w-lg text-white/85">
            Our support team is one message away — we are happy to help you get your delivery moving.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button href="mailto:support@ceesdeliveries.com" variant="secondary">
              Email support
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-white/10"
            >
              Create an account
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
