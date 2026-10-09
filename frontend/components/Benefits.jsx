import {
  Layers,
  CalendarCheck,
  BellRing,
  ClipboardList,
  Headphones,
  ArrowRight,
  Star,
} from 'lucide-react';
import SectionHeading from './SectionHeading';

const BENEFITS = [
  {
    title: 'Everything in one place',
    description:
      'Food, groceries, parcels and couriers share a single wallet, history and dashboard.',
    Icon: Layers,
    tone: 'bg-lilac text-brand',
  },
  {
    title: 'Convenient booking',
    description: 'Book in seconds with saved addresses, quick repeats and clear upfront pricing.',
    Icon: CalendarCheck,
    tone: 'bg-coral/12 text-coral',
  },
  {
    title: 'Clear delivery updates',
    description: 'Follow every status change and get notified from confirmation to doorstep.',
    Icon: BellRing,
    tone: 'bg-solar/20 text-solar-ink',
  },
  {
    title: 'Simple order management',
    description: 'View, edit, cancel or reorder any request right from your account.',
    Icon: ClipboardList,
    tone: 'bg-violet/15 text-violet',
  },
  {
    title: 'Responsive support',
    description: 'Real people on chat and phone whenever you need a helping hand.',
    Icon: Headphones,
    tone: 'bg-brand/10 text-brand',
  },
];

export default function Benefits() {
  return (
    <section id="help" className="relative bg-vanilla py-20 sm:py-24">
      <div className="mx-auto max-w-[100rem] px-4 sm:px-6">
        <SectionHeading
          eyebrow="Why Cee's"
          title="Built to make delivery feel effortless"
          subtitle="A friendly, dependable experience that keeps your everyday essentials moving without the stress."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map(({ title, description, Icon, tone }) => (
            <article
              key={title}
              className="group flex h-full flex-col rounded-3xl border border-ink/8 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/20 hover:shadow-xl hover:shadow-ink/5"
            >
              <span className={`grid h-12 w-12 place-items-center rounded-2xl ${tone}`}>
                <Icon className="h-6 w-6" strokeWidth={2.1} />
              </span>
              <h3 className="mt-5 font-display text-lg font-extrabold text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{description}</p>
            </article>
          ))}

          {/* accent card completes the grid */}
          <article className="relative flex h-full flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-brand to-violet p-7 text-white shadow-xl shadow-brand/25">
            <div
              className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-solar/30 blur-2xl"
              aria-hidden="true"
            />
            <div className="relative">
              <span className="inline-flex items-center gap-1 text-solar">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-solar" />
                ))}
              </span>
              <h3 className="mt-4 font-display text-2xl font-extrabold leading-tight">
                20,000+ deliveries, one trusted platform
              </h3>
              <p className="mt-3 text-sm text-white/85">
                Join customers who rely on Cee&apos;s every day — with a 4.9 average rider rating and
                24/7 support.
              </p>
            </div>
            <a
              href="/register"
              className="relative mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-brand shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-lilac"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
