'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Search,
  MapPin,
  Package,
  Loader2,
  CircleAlert,
  Check,
  Bike,
  Clock,
  Wallet,
  Info,
} from 'lucide-react';
import { trackDelivery } from '@/lib/api';
import SectionHeading from './SectionHeading';

const STEP_ORDER = ['PENDING', 'CONFIRMED', 'ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED'];

const STATUS_LABEL = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  ASSIGNED: 'Rider assigned',
  PICKED_UP: 'Picked up',
  IN_TRANSIT: 'In transit',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

const STATUS_TONE = {
  PENDING: 'bg-pending-bg text-pending',
  CONFIRMED: 'bg-info-bg text-info',
  ASSIGNED: 'bg-info-bg text-info',
  PICKED_UP: 'bg-transit-bg text-transit',
  IN_TRANSIT: 'bg-transit-bg text-transit',
  DELIVERED: 'bg-delivered-bg text-delivered',
  CANCELLED: 'bg-failed-bg text-failed',
};

/**
 * Offline sample data. Only used when the live API cannot be reached, and the
 * UI always labels it clearly as demo data so it is never mistaken for live tracking.
 */
const DEMO_DELIVERIES = {
  'CD-DEMO-0002': {
    trackingCode: 'CD-DEMO-0002',
    status: 'CONFIRMED',
    pickupLabel: 'Ikeja City Mall',
    pickupAddress: 'Alausa, Ikeja, Lagos',
    dropoffLabel: 'Yaba Tech',
    dropoffAddress: '8 Herbert Macaulay Way, Yaba, Lagos',
    packageDescription: 'Laptop bag',
    deliveryFee: 1940,
    currency: 'NGN',
    statusHistory: [
      { status: 'PENDING', note: 'Delivery request created', createdAt: new Date().toISOString() },
      { status: 'CONFIRMED', note: 'Delivery confirmed', createdAt: new Date().toISOString() },
    ],
  },
  'CD-DEMO-0004': {
    trackingCode: 'CD-DEMO-0004',
    status: 'IN_TRANSIT',
    pickupLabel: 'Apapa Port',
    pickupAddress: 'Wharf Road, Apapa, Lagos',
    dropoffLabel: 'Ikeja GRA',
    dropoffAddress: '14 Sobo Arobiodu St, Ikeja GRA, Lagos',
    packageDescription: 'Spare parts',
    deliveryFee: 3014,
    currency: 'NGN',
    statusHistory: [
      { status: 'PENDING', note: 'Delivery request created', createdAt: new Date().toISOString() },
      { status: 'ASSIGNED', note: 'Rider assigned', createdAt: new Date().toISOString() },
      { status: 'PICKED_UP', note: 'Package picked up', createdAt: new Date().toISOString() },
      { status: 'IN_TRANSIT', note: 'On the way', createdAt: new Date().toISOString() },
    ],
  },
  'CD-DEMO-0005': {
    trackingCode: 'CD-DEMO-0005',
    status: 'DELIVERED',
    pickupLabel: 'Mushin Market',
    pickupAddress: 'Agege Motor Rd, Mushin, Lagos',
    dropoffLabel: 'Maryland Mall',
    dropoffAddress: '350 Ikorodu Rd, Maryland, Lagos',
    packageDescription: 'Fabric bundle',
    deliveryFee: 1244,
    currency: 'NGN',
    statusHistory: [
      { status: 'PENDING', note: 'Delivery request created', createdAt: new Date().toISOString() },
      { status: 'IN_TRANSIT', note: 'On the way', createdAt: new Date().toISOString() },
      { status: 'DELIVERED', note: 'Delivered to recipient', createdAt: new Date().toISOString() },
    ],
  },
};

function formatMoney(amount, currency = 'NGN') {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));
}

function formatTime(value) {
  if (!value) return '';
  try {
    return new Intl.DateTimeFormat('en-NG', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  } catch (e) {
    return '';
  }
}

export default function TrackDelivery() {
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [phase, setPhase] = useState('idle'); // idle | loading | success
  const [delivery, setDelivery] = useState(null);
  const inputRef = useRef(null);

  async function runTrack(rawValue) {
    const value = (rawValue ?? code).trim();

    if (!value) {
      setError('Please enter a tracking number to continue.');
      setPhase('idle');
      setDelivery(null);
      setNotice(null);
      inputRef.current?.focus();
      return;
    }

    setError(null);
    setNotice(null);
    setPhase('loading');

    try {
      const data = await trackDelivery(value);
      setDelivery(data);
      setPhase('success');
    } catch (err) {
      if (err.code === 'NOT_FOUND') {
        setError(`We couldn't find a delivery with tracking number "${value}". Please check it and try again.`);
        setDelivery(null);
        setPhase('idle');
        return;
      }

      // Live API unavailable — fall back to clearly-labelled demo data if we have it.
      const demo = DEMO_DELIVERIES[value.toUpperCase()];
      if (demo) {
        setDelivery(demo);
        setNotice('Live tracking is currently offline — showing sample demo data.');
        setPhase('success');
        return;
      }

      setError(
        'We couldn\u2019t reach the tracking service right now. Please try again in a moment.'
      );
      setDelivery(null);
      setPhase('idle');
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    runTrack(code);
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialCode = params.get('code');
    if (initialCode) {
      setCode(initialCode);
      runTrack(initialCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function useDemo(sampleCode) {
    setCode(sampleCode);
    setError(null);
    setNotice(null);
    inputRef.current?.focus();
  }

  return (
    <section id="track" className="relative overflow-hidden bg-brand py-20 sm:py-24">
      <div
        className="pointer-events-none absolute inset-0 bg-grid-light opacity-30"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-4xl px-[55px]">
        <SectionHeading
          light
          eyebrow="Track delivery"
          title="Follow your delivery, live"
          subtitle="Enter your tracking number to see exactly where your delivery is and what happens next."
        />

        <form onSubmit={handleSubmit} className="mt-10" noValidate>
          <label htmlFor="tracking-code" className="sr-only">
            Tracking number
          </label>
          <div
            className={`flex flex-col gap-3 rounded-[1.75rem] bg-white p-2.5 shadow-2xl shadow-ink/20 sm:flex-row sm:items-center ${
              error ? 'ring-2 ring-coral' : 'ring-0'
            }`}
          >
            <div className="flex flex-1 items-center gap-3 px-3">
              <Search className={`h-5 w-5 shrink-0 ${error ? 'text-coral' : 'text-brand'}`} />
              <input
                ref={inputRef}
                id="tracking-code"
                name="trackingCode"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="e.g. CD-DEMO-0004"
                autoComplete="off"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'tracking-error' : undefined}
                className="w-full bg-transparent py-3 text-base font-semibold text-ink placeholder:font-medium placeholder:text-ink-soft/50 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={phase === 'loading'}
              className="inline-flex items-center justify-center gap-2 rounded-[1.25rem] bg-coral px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-coral/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-coral-dark disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {phase === 'loading' ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Tracking…
                </>
              ) : (
                'Track Delivery'
              )}
            </button>
          </div>

          {error ? (
            <p
              id="tracking-error"
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-coral"
            >
              <CircleAlert className="h-4 w-4" />
              {error}
            </p>
          ) : (
            <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-white/75">
              <Info className="h-4 w-4" />
              Try a demo number:
              {['CD-DEMO-0002', 'CD-DEMO-0004', 'CD-DEMO-0005'].map((sample) => (
                <button
                  key={sample}
                  type="button"
                  onClick={() => useDemo(sample)}
                  className="rounded-full bg-white/15 px-3 py-1 font-semibold text-white transition-colors hover:bg-white/25"
                >
                  {sample}
                </button>
              ))}
            </p>
          )}
        </form>

        {notice ? (
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-solar px-4 py-2 text-sm font-bold text-ink">
            <Info className="h-4 w-4" />
            {notice}
          </p>
        ) : null}

        {phase === 'success' && delivery ? <TrackingResult delivery={delivery} /> : null}
      </div>
    </section>
  );
}

function TrackingResult({ delivery }) {
  const isCancelled = delivery.status === 'CANCELLED';
  const currentIndex = STEP_ORDER.indexOf(delivery.status);

  return (
    <div className="mt-8 overflow-hidden rounded-3xl bg-white p-6 shadow-2xl shadow-ink/20 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-ink-soft/70">
            Tracking number
          </p>
          <p className="font-display text-xl font-extrabold text-ink">{delivery.trackingCode}</p>
        </div>
        <span
          className={`rounded-full px-4 py-2 text-sm font-bold ${
            STATUS_TONE[delivery.status] || 'bg-lilac text-brand'
          }`}
        >
          {STATUS_LABEL[delivery.status] || delivery.status}
        </span>
      </div>

      {/* route */}
      <div className="mt-7 rounded-2xl bg-vanilla p-5">
        <RoutePoint
          icon={<Package className="h-4 w-4" />}
          label="Pickup"
          title={delivery.pickupLabel}
          address={delivery.pickupAddress}
          tone="text-brand bg-lilac"
        />
        <div className="ml-[1.15rem] my-1 h-6 border-l-2 border-dashed border-ink/20" />
        <RoutePoint
          icon={<MapPin className="h-4 w-4" />}
          label="Drop-off"
          title={delivery.dropoffLabel}
          address={delivery.dropoffAddress}
          tone="text-coral bg-coral/12"
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Meta icon={<Package className="h-4 w-4 text-brand" />} text={delivery.packageDescription} />
        <Meta
          icon={<Wallet className="h-4 w-4 text-coral" />}
          text={formatMoney(delivery.deliveryFee, delivery.currency)}
        />
        {delivery.rider ? (
          <Meta
            icon={<Bike className="h-4 w-4 text-violet" />}
            text={`${delivery.rider.firstName} ${delivery.rider.lastName}`}
          />
        ) : null}
      </div>

      {isCancelled ? (
        <div className="mt-7 flex items-center gap-3 rounded-2xl bg-coral/10 px-5 py-4 text-sm font-semibold text-coral">
          <CircleAlert className="h-5 w-5" />
          This delivery was cancelled{delivery.cancellationReason ? `: ${delivery.cancellationReason}` : '.'}
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto pb-1">
          <div className="flex min-w-[620px] items-start">
            {STEP_ORDER.map((step, index) => {
              const done = index <= currentIndex;
              const active = index === currentIndex;
              return (
                <div key={step} className="flex flex-1 flex-col items-center">
                  <div className="flex w-full items-center">
                    <span
                      className={`h-1 flex-1 rounded-full ${index === 0 ? 'opacity-0' : index <= currentIndex ? 'bg-brand' : 'bg-ink/10'}`}
                    />
                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-bold transition-colors ${
                        done
                          ? 'bg-brand text-white'
                          : 'border-2 border-ink/12 bg-white text-ink-soft'
                      } ${active ? 'ring-4 ring-brand/15' : ''}`}
                    >
                      {done ? <Check className="h-4 w-4" strokeWidth={3} /> : index + 1}
                    </span>
                    <span
                      className={`h-1 flex-1 rounded-full ${index === STEP_ORDER.length - 1 ? 'opacity-0' : index < currentIndex ? 'bg-brand' : 'bg-ink/10'}`}
                    />
                  </div>
                  <span
                    className={`mt-2 text-center text-[11px] font-bold leading-tight ${
                      done ? 'text-ink' : 'text-ink-soft/60'
                    }`}
                  >
                    {STATUS_LABEL[step]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {Array.isArray(delivery.statusHistory) && delivery.statusHistory.length > 0 ? (
        <div className="mt-8 border-t border-ink/8 pt-6">
          <h4 className="flex items-center gap-2 font-display text-sm font-extrabold uppercase tracking-wide text-ink">
            <Clock className="h-4 w-4 text-brand" />
            Delivery timeline
          </h4>
          <ol className="mt-4 space-y-4">
            {[...delivery.statusHistory].reverse().map((entry, index) => (
              <li key={`${entry.status}-${index}`} className="flex gap-4">
                <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-brand" />
                <div>
                  <p className="text-sm font-bold text-ink">
                    {STATUS_LABEL[entry.status] || entry.status}
                  </p>
                  {entry.note ? (
                    <p className="text-sm text-ink-soft">{entry.note}</p>
                  ) : null}
                  <p className="mt-0.5 text-xs font-medium text-ink-soft/70">
                    {formatTime(entry.createdAt)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </div>
  );
}

function RoutePoint({ icon, label, title, address, tone }) {
  return (
    <div className="flex items-start gap-4">
      <span className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full ${tone}`}>
        {icon}
      </span>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-ink-soft/70">{label}</p>
        <p className="text-sm font-bold text-ink">{title}</p>
        <p className="text-sm text-ink-soft">{address}</p>
      </div>
    </div>
  );
}

function Meta({ icon, text }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-semibold text-ink">
      {icon}
      {text}
    </span>
  );
}
