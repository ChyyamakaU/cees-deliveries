import {
  ArrowRight,
  UtensilsCrossed,
  ShoppingBasket,
  Package,
  Bike,
  Search,
  Star,
  Check,
  Sparkles,
} from 'lucide-react';
import CourierScene from './CourierScene';

const CATEGORIES = [
  { label: 'Food', icon: UtensilsCrossed },
  { label: 'Groceries', icon: ShoppingBasket },
  { label: 'Parcels', icon: Package },
  { label: 'Courier', icon: Bike },
];

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-vanilla pt-10 pb-20 sm:pt-14 lg:pb-28">
  
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-24 top-8 h-72 w-72 rounded-full bg-violet/20 blur-3xl" />
        <div className="absolute -right-16 top-24 h-80 w-80 rounded-full bg-coral/10 blur-3xl" />
        <div className="absolute left-1/3 top-0 h-64 w-64 rounded-full bg-solar/15 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-[100rem] items-center pt-0 md:pt-14 px-[55px] lg:grid-cols-[1.05fr_1fr] lg:gap-10">
    
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/15 bg-lilac px-4 py-2 text-sm font-semibold text-brand">
            <Sparkles className="h-4 w-4" />
            All your deliveries, one simple app
          </span>

          <h1 className="mt-6 font-display text-xl font-extrabold leading-[1.04] tracking-tight text-ink sm:text-6xl lg:text-[4.1rem]">
            Whatever you need.
            <br />
            <span className="text-brand text-5xl">Wherever it needs to </span>
            <span className="relative whitespace-nowrap text-brand">
              go.
              <svg
                className="absolute -bottom-3 left-0 w-full"
                viewBox="0 0 120 14"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M3 9 C 32 2, 62 13, 117 5"
                  stroke="#FF5B61"
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-soft">
            Food, groceries, packages and everyday essentials — all delivered through one simple
            platform. Book in seconds, watch it move in real time.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
            <a
              href="/book"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-coral px-7 py-4 text-base font-bold text-white shadow-xl shadow-coral/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-coral-dark hover:shadow-2xl hover:shadow-coral/40"
            >
              Book a Delivery
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href="#track"
              className="group inline-flex items-center justify-center gap-2 rounded-full border border-ink/12 bg-white px-7 py-4 text-base font-bold text-ink shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-coral/40 hover:text-coral hover:shadow-lg"
            >
              <Search className="h-5 w-5 text-coral" />
              Track My Delivery
            </a>
          </div>

         
        </div>

        {/* visual */}
        <div className="relative mx-auto w-4/5 max-w-xl lg:max-w-none">
          <div className="relative aspect-[5/4] overflow-hidden rounded-[2.25rem] shadow-2xl shadow-brand/30 sm:rounded-[2.75rem]">
            <div className="absolute inset-0 bg-grid-soft opacity-30" />
            <CourierScene className="absolute inset-0 h-full w-full" />
          </div>

          {/* floating: food */}
          <div className="animate-float absolute -left-3 top-10 flex items-center gap-3 rounded-2xl bg-white p-3 pr-4 shadow-xl shadow-ink/10 sm:-left-6">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-coral/12 text-coral">
              <UtensilsCrossed className="h-5 w-5" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-bold text-ink">Food order</p>
              <p className="text-xs font-medium text-ink-soft">Arriving in 18 min</p>
            </div>
          </div>

          {/* floating: groceries */}
          <div className="animate-float-slow absolute -right-2 top-24 hidden items-center gap-3 rounded-2xl bg-lilac p-3 pr-4 shadow-xl shadow-brand/10 sm:flex lg:-right-6">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet text-white">
              <ShoppingBasket className="h-5 w-5" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-bold text-ink">Groceries</p>
              <p className="text-xs font-medium text-ink-soft">Packed &amp; on the way</p>
            </div>
          </div>

          {/* floating: delivered */}
          <div className="animate-float-slow absolute -bottom-5 left-2 flex items-center gap-3 rounded-2xl bg-white p-3 pr-4 shadow-xl shadow-ink/10 sm:left-6">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-success/12 text-success">
              <Check className="h-5 w-5" strokeWidth={3} />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-bold text-ink">Package delivered</p>
              <p className="text-xs font-medium text-ink-soft">Order #CD-4821</p>
            </div>
          </div>

          {/* floating: rating */}
          <div className="animate-float absolute -bottom-6 right-0 rounded-2xl bg-ink px-4 py-3 shadow-xl shadow-ink/25 sm:right-4">
            <div className="flex items-center gap-1 text-solar">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-solar" />
              ))}
            </div>
            <p className="mt-1 text-xs font-semibold text-white">
              <span className="text-base font-extrabold">4.9</span> rider rating
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
