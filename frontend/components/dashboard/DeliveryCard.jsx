import Link from 'next/link';
import { ArrowRight, MapPin, Package } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import { formatDate, formatMoney } from '@/lib/format';

export default function DeliveryCard({ delivery, href }) {
  const target = href || `/dashboard/deliveries/${delivery.id}`;

  return (
    <Link
      href={target}
      className="group block rounded-2xl border border-ink/10 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-lg hover:shadow-ink/5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-display text-sm font-extrabold tracking-wide text-brand">
            {delivery.trackingCode}
          </span>
          <StatusBadge status={delivery.status} />
        </div>
        <span className="text-sm text-ink-soft">{formatDate(delivery.createdAt)}</span>
      </div>

      <div className="mt-4 flex items-start gap-3">
        <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-lilac text-brand">
          <MapPin className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="min-w-0 text-sm">
          <p className="truncate font-semibold text-ink">
            {delivery.pickupLabel} <span className="text-ink-soft">→</span> {delivery.dropoffLabel}
          </p>
          <p className="truncate text-ink-soft">{delivery.packageDescription}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-ink/8 pt-4 text-sm">
        <span className="inline-flex items-center gap-1.5 text-ink-soft">
          <Package className="h-4 w-4" aria-hidden="true" />
          {delivery.packageSize?.toLowerCase()}
        </span>
        <span className="flex items-center gap-2 font-semibold text-ink">
          {formatMoney(delivery.deliveryFee, delivery.currency)}
          <ArrowRight
            className="h-4 w-4 text-brand transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  );
}
