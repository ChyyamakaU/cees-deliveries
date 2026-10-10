import { Pencil, Route, Package, CalendarClock, ClipboardList } from 'lucide-react';
import Alert from '@/components/ui/Alert';
import Skeleton from '@/components/ui/Skeleton';
import { PACKAGE_SIZES, getService } from '@/lib/services';

function formatMoney(amount, currency = 'NGN') {
  try {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${Number(amount).toLocaleString()}`;
  }
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4 py-1.5">
      <span className="text-ink-soft">{label}</span>
      <span className="text-right font-medium text-ink">{value || '—'}</span>
    </div>
  );
}

function SectionCard({ title, onEdit, children }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-ink">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-coral transition-colors hover:bg-coral-tint"
        >
          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
          Edit
        </button>
      </div>
      <div className="mt-3 text-sm">{children}</div>
    </div>
  );
}

export default function ReviewStep({ values, quote, quoteLoading, quoteError, onEdit }) {
  const service = getService(values.category);
  const size = PACKAGE_SIZES.find((s) => s.value === values.packageSize);

  return (
    <div className="space-y-5">
      <SectionCard title="Service" onEdit={() => onEdit(0)}>
        <Row label="Category" value={service?.label} />
        <Row label="Package size" value={size?.label} />
      </SectionCard>

      <SectionCard title="Route" onEdit={() => onEdit(1)}>
        <div className="flex items-start gap-3">
          <Route className="mt-1 h-4 w-4 shrink-0 text-coral" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-ink">Pickup · {values.pickupLabel}</p>
            <p className="text-ink-soft">{values.pickupAddress}</p>
            <p className="text-ink-soft">
              {values.pickupContactName} · {values.pickupContactPhone}
            </p>
          </div>
        </div>
        <div className="my-3 border-t border-dashed border-ink/15" />
        <div className="flex items-start gap-3">
          <Route className="mt-1 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-ink">Destination · {values.dropoffLabel}</p>
            <p className="text-ink-soft">{values.dropoffAddress}</p>
            <p className="text-ink-soft">
              {values.dropoffContactName} · {values.dropoffContactPhone}
            </p>
          </div>
        </div>
        {values.distanceKm ? <Row label="Distance" value={`${values.distanceKm} km`} /> : null}
      </SectionCard>

      <SectionCard title="Package" onEdit={() => onEdit(2)}>
        <div className="flex items-start gap-3">
          <Package className="mt-1 h-4 w-4 shrink-0 text-violet" aria-hidden="true" />
          <p className="text-ink">{values.packageDescription}</p>
        </div>
        {values.packageWeight ? <Row label="Weight" value={`${values.packageWeight} kg`} /> : null}
        {values.scheduledPickupAt ? (
          <Row
            label="Preferred time"
            value={new Date(values.scheduledPickupAt).toLocaleString()}
          />
        ) : null}
        {values.notes ? (
          <div className="mt-3 flex items-start gap-2 rounded-xl bg-lilac/60 p-3">
            <ClipboardList className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
            <p className="text-ink-soft">{values.notes}</p>
          </div>
        ) : null}
      </SectionCard>

      <div className="rounded-2xl border border-brand/20 bg-lilac/50 p-5">
        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-brand">
          <CalendarClock className="h-4 w-4" aria-hidden="true" />
          Estimated price
        </div>

        {quoteLoading ? (
          <div className="mt-3 space-y-2">
            <Skeleton className="h-8 w-40" rounded="rounded-lg" />
            <Skeleton className="h-4 w-56" />
          </div>
        ) : quoteError ? (
          <Alert variant="warning" className="mt-3">
            {quoteError}
          </Alert>
        ) : quote ? (
          <>
            <p className="mt-2 font-display text-3xl font-extrabold text-ink">
              {formatMoney(quote.deliveryFee, quote.currency)}
            </p>
            <p className="mt-1 text-sm text-ink-soft">
              {quote.distanceKm ? `Based on ~${quote.distanceKm} km. ` : 'Based on package size and our base rate. '}
              This is an <strong className="font-semibold">estimate</strong> — the confirmed fee is
              set when the delivery is accepted.
            </p>
          </>
        ) : (
          <p className="mt-2 text-sm text-ink-soft">
            We&apos;ll show an estimate once the details are complete.
          </p>
        )}
      </div>
    </div>
  );
}
