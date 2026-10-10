import { MapPin, Package, Phone, User, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import { formatMoney } from '@/lib/format';

export default function RiderJobCard({ job, canAccept, accepting, onAccept }) {
  const customer = job.customer;

  return (
    <article className="rounded-2xl border border-ink/10 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-display text-sm font-extrabold tracking-wide text-brand">
          {job.trackingCode}
        </span>
        <span className="font-display font-extrabold text-ink">
          {formatMoney(job.deliveryFee, job.currency)}
        </span>
      </div>

      <div className="mt-4 space-y-3 text-sm">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-lilac text-brand">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate font-semibold text-ink">
              {job.pickupLabel} <span className="text-ink-soft">→</span> {job.dropoffLabel}
            </p>
            <p className="truncate text-ink-soft">{job.pickupAddress}</p>
            <p className="truncate text-ink-soft">{job.dropoffAddress}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-ink-soft">
          <span className="inline-flex items-center gap-1.5">
            <Package className="h-4 w-4" aria-hidden="true" />
            {job.packageDescription}
          </span>
          {job.distanceKm ? <span>{job.distanceKm} km</span> : null}
          {customer ? (
            <span className="inline-flex items-center gap-1.5">
              <User className="h-4 w-4" aria-hidden="true" />
              {customer.firstName} {customer.lastName}
            </span>
          ) : null}
          {customer?.phone ? (
            <a href={`tel:${customer.phone}`} className="inline-flex items-center gap-1.5 hover:text-brand">
              <Phone className="h-4 w-4" aria-hidden="true" />
              {customer.phone}
            </a>
          ) : null}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-3 border-t border-ink/8 pt-4">
        {!canAccept ? (
          <span className="text-xs font-medium text-ink-soft">
            Set yourself Available to accept jobs.
          </span>
        ) : null}
        <Button onClick={() => onAccept(job)} disabled={!canAccept} loading={accepting}>
          Accept job
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </article>
  );
}
