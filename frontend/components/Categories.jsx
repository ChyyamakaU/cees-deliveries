import { UtensilsCrossed, ShoppingBasket, Package, Bike } from 'lucide-react';
import SectionHeading from './SectionHeading';
import ServiceCard from './ServiceCard';

const CATEGORIES = [
  {
    key: 'food',
    title: 'Food',
    description: 'Hot meals and restaurant favourites, delivered fresh and fast.',
    cta: 'Order Food',
    href: '/book?service=food',
    Icon: UtensilsCrossed,
    card: 'bg-coral-tint border-coral/15 hover:border-coral/40',
    iconTile: 'from-coral to-coral-soft',
    glow: 'bg-coral/30',
    button: 'bg-coral text-white group-hover:bg-coral-dark',
    badge: { label: 'Popular', className: 'bg-white text-coral' },
  },
  {
    key: 'groceries',
    title: 'Groceries',
    description: 'Everyday essentials and fresh produce from stores near you.',
    cta: 'Get Groceries',
    href: '/book?service=groceries',
    Icon: ShoppingBasket,
    card: 'bg-solar-tint border-solar/30 hover:border-solar/70',
    iconTile: 'from-solar to-solar-deep',
    iconText: 'text-ink',
    glow: 'bg-solar/40',
    button: 'bg-solar text-ink group-hover:bg-solar-deep',
    badge: { label: 'Fresh', className: 'bg-white text-solar-ink' },
  },
  {
    key: 'packages',
    title: 'Packages',
    description: 'Send documents and parcels across town with live updates.',
    cta: 'Send a Package',
    href: '/book?service=packages',
    Icon: Package,
    card: 'bg-lilac border-violet/15 hover:border-violet/45',
    iconTile: 'from-violet to-brand',
    glow: 'bg-violet/30',
    button: 'bg-brand text-white group-hover:bg-brand-dark',
    badge: null,
  },
  {
    key: 'courier',
    title: 'Courier',
    description: 'An on-demand courier for last-minute errands and pickups.',
    cta: 'Book a Courier',
    href: '/book?service=courier',
    Icon: Bike,
    card: 'bg-white border-ink/10 hover:border-brand/40',
    iconTile: 'from-brand to-violet',
    glow: 'bg-brand/20',
    button: 'bg-ink text-white group-hover:bg-brand',
    badge: { label: 'On-demand', className: 'bg-lilac text-brand' },
  },
];

export default function Categories() {
  return (
    <section id="services" className="relative bg-vanilla py-20 sm:py-24">
      <div className="mx-auto max-w-[100rem] px-4 sm:px-6">
        <SectionHeading
          eyebrow="What we deliver"
          title="One platform, every kind of delivery"
          subtitle="From a late-night dinner to a same-day parcel, pick the service you need and Cee's handles the rest."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map(({ key, ...card }) => (
            <ServiceCard key={key} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}
