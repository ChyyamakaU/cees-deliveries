import { ShoppingBag, MapPin, PackageCheck } from 'lucide-react';
import SectionHeading from './SectionHeading';

const STEPS = [
  {
    title: 'Choose what you want delivered',
    description:
      'Pick a service — food, groceries, a parcel or a courier — and tell us what we are carrying.',
    Icon: ShoppingBag,
    number: '01',
    ring: 'bg-brand text-white',
    iconWrap: 'bg-lilac text-brand',
  },
  {
    title: 'Enter pickup and delivery details',
    description:
      'Add the pickup and drop-off locations, contacts, and any notes for your rider.',
    Icon: MapPin,
    number: '02',
    ring: 'bg-coral text-white',
    iconWrap: 'bg-coral/12 text-coral',
  },
  {
    title: 'Confirm, pay and track it live',
    description:
      'Review the price, confirm your request, then follow every step until it is delivered.',
    Icon: PackageCheck,
    number: '03',
    ring: 'bg-solar text-ink',
    iconWrap: 'bg-solar/20 text-solar-ink',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-[100rem] px-[55px]">
        <SectionHeading
          eyebrow="How it works"
          title="Booked in three simple steps"
          subtitle="No forms to wrestle with, no phone calls. Just a fast, friendly flow from request to doorstep."
        />

        <div className="relative mt-16">
          {/* connecting line (desktop) */}
          <div
            className="absolute left-0 right-0 top-8 hidden border-t border-dashed border-ink/20 lg:block"
            aria-hidden="true"
          />

          <div className="grid gap-8 lg:grid-cols-3">
            {STEPS.map(({ title, description, Icon, number, ring, iconWrap }) => (
              <div key={number} className="relative">
                <div className="relative flex flex-col items-center rounded-3xl border border-ink/8 bg-vanilla/60 px-7 py-9 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/20 hover:shadow-xl hover:shadow-ink/5">
                  <span
                    className={`grid h-16 w-16 place-items-center rounded-2xl ${iconWrap} shadow-sm`}
                  >
                    <Icon className="h-8 w-8" strokeWidth={2} />
                  </span>
                  <span
                    className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 font-display text-xs font-extrabold tracking-wider shadow-md ${ring}`}
                  >
                    STEP {number}
                  </span>
                  <h3 className="mt-6 font-display text-lg font-extrabold text-ink">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
