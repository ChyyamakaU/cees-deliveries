'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Bike,
  Copy,
  Check,
  MapPin,
  Package,
  Phone,
  Wallet,
  XCircle,
  RefreshCw,
} from 'lucide-react';
import { cancelDelivery, getDelivery, riderUpdateStatus, updateDeliveryStatus } from '@/lib/api';
import { canCancel, nextStatuses } from '@/lib/deliveryStatus';
import { formatDateTime, formatMoney } from '@/lib/format';
import { useAuth } from '@/context/AuthContext';
import { statusLabel } from '@/components/ui/StatusBadge';
import StatusBadge from '@/components/ui/StatusBadge';
import StatusTimeline from './StatusTimeline';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import FormField from '@/components/ui/FormField';
import { LoadingState } from '@/components/ui/Skeleton';

const PAYMENT_TONE = {
  PENDING: 'pending',
  SUCCESSFUL: 'delivered',
  FAILED: 'failed',
  REFUNDED: 'info',
};

function Card({ title, icon: Icon, children }) {
  return (
    <section className="rounded-2xl border border-ink/10 bg-white p-5">
      <h2 className="flex items-center gap-2 font-display font-bold text-ink">
        {Icon ? <Icon className="h-4.5 w-4.5 text-brand" aria-hidden="true" /> : null}
        {title}
      </h2>
      <div className="mt-4 text-sm">{children}</div>
    </section>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4 py-1">
      <span className="text-ink-soft">{label}</span>
      <span className="text-right font-medium text-ink">{value || '—'}</span>
    </div>
  );
}

export default function DeliveryDetail({ id }) {
  const { user } = useAuth();
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [actionError, setActionError] = useState('');

  const [nextStatus, setNextStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [updating, setUpdating] = useState(false);

  const load = useCallback(() => {
    let active = true;
    setLoading(true);
    getDelivery(id)
      .then((data) => {
        if (!active) return;
        setDelivery(data);
        setError('');
      })
      .catch((err) => {
        if (active) setError(err.status === 403 ? 'You do not have access to this delivery.' : err.message || 'Could not load this delivery.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => load(), [load]);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(delivery.trackingCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const submitCancel = async () => {
    setCancelling(true);
    setActionError('');
    try {
      const updated = await cancelDelivery(delivery.id, cancelReason.trim() || undefined);
      setDelivery(updated);
      setCancelOpen(false);
      setCancelReason('');
    } catch (err) {
      setActionError(err.message || 'Could not cancel this delivery.');
    } finally {
      setCancelling(false);
    }
  };

  const submitStatus = async (event) => {
    event.preventDefault();
    if (!nextStatus) return;
    setUpdating(true);
    setActionError('');
    try {
      const updated =
        user.role === 'RIDER'
          ? await riderUpdateStatus(delivery.id, nextStatus, statusNote.trim() || undefined)
          : await updateDeliveryStatus(delivery.id, nextStatus, statusNote.trim() || undefined);
      setDelivery(updated);
      setNextStatus('');
      setStatusNote('');
    } catch (err) {
      setActionError(err.message || 'Could not update the status.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <LoadingState label="Loading delivery…" />;
  if (error) return <Alert variant="error">{error}</Alert>;
  if (!delivery) return null;

  const rider = delivery.rider;
  const options = nextStatuses(delivery.status).filter((s) => s !== 'CANCELLED');
  const showCustomerCancel = user.role === 'CUSTOMER' && canCancel(delivery.status);
  const showStaffActions = (user.role === 'RIDER' || user.role === 'ADMIN') && options.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard/deliveries"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft transition-colors hover:text-brand"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          All deliveries
        </Link>
      </div>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">
              {delivery.trackingCode}
            </h1>
            <button
              type="button"
              onClick={copyCode}
              className="grid h-8 w-8 place-items-center rounded-lg border border-ink/12 text-ink-soft transition-colors hover:border-coral/40 hover:text-coral"
              aria-label="Copy tracking code"
            >
              {copied ? <Check className="h-4 w-4 text-delivered" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
            </button>
          </div>
          <p className="mt-1 text-sm text-ink-soft">Booked {formatDateTime(delivery.createdAt)}</p>
        </div>
        <StatusBadge status={delivery.status} className="text-sm" />
      </header>

      {actionError ? <Alert variant="error">{actionError}</Alert> : null}

      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Route" icon={MapPin}>
          <div className="space-y-4">
            <div>
              <p className="font-semibold text-ink">Pickup · {delivery.pickupLabel}</p>
              <p className="text-ink-soft">{delivery.pickupAddress}</p>
              <p className="text-ink-soft">
                {delivery.pickupContactName} · {delivery.pickupContactPhone}
              </p>
            </div>
            <div className="border-t border-dashed border-ink/15 pt-4">
              <p className="font-semibold text-ink">Destination · {delivery.dropoffLabel}</p>
              <p className="text-ink-soft">{delivery.dropoffAddress}</p>
              <p className="text-ink-soft">
                {delivery.dropoffContactName} · {delivery.dropoffContactPhone}
              </p>
            </div>
          </div>
        </Card>

        <Card title="Package" icon={Package}>
          <p className="text-ink">{delivery.packageDescription}</p>
          <div className="mt-3">
            <DetailRow label="Size" value={delivery.packageSize?.toLowerCase()} />
            {delivery.packageWeight ? <DetailRow label="Weight" value={`${delivery.packageWeight} kg`} /> : null}
            {delivery.distanceKm ? <DetailRow label="Distance" value={`${delivery.distanceKm} km`} /> : null}
            {delivery.scheduledPickupAt ? (
              <DetailRow label="Preferred time" value={formatDateTime(delivery.scheduledPickupAt)} />
            ) : null}
          </div>
          {delivery.notes ? (
            <p className="mt-3 rounded-xl bg-lilac/60 p-3 text-ink-soft">{delivery.notes}</p>
          ) : null}
        </Card>

        {rider ? (
          <Card title="Rider" icon={Bike}>
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-brand text-sm font-bold text-white">
                {rider.firstName?.[0]}
                {rider.lastName?.[0]}
              </span>
              <div>
                <p className="font-semibold text-ink">
                  {rider.firstName} {rider.lastName}
                </p>
                {rider.phone ? (
                  <a href={`tel:${rider.phone}`} className="inline-flex items-center gap-1 text-ink-soft hover:text-brand">
                    <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                    {rider.phone}
                  </a>
                ) : null}
              </div>
            </div>
          </Card>
        ) : null}

        <Card title="Payment" icon={Wallet}>
          {delivery.payment ? (
            <>
              <div className="flex items-center justify-between">
                <span className="font-display text-xl font-extrabold text-ink">
                  {formatMoney(delivery.payment.amount, delivery.payment.currency || delivery.currency)}
                </span>
                <StatusBadge tone={PAYMENT_TONE[delivery.payment.status] || 'neutral'}>
                  {delivery.payment.status}
                </StatusBadge>
              </div>
              <div className="mt-2">
                <DetailRow label="Method" value={delivery.payment.method} />
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span className="font-display text-xl font-extrabold text-ink">
                  {formatMoney(delivery.deliveryFee, delivery.currency)}
                </span>
                <StatusBadge tone="pending">Unpaid</StatusBadge>
              </div>
              <p className="mt-2 text-ink-soft">
                Online payment isn’t available yet — this delivery is settled on delivery.
              </p>
            </>
          )}
        </Card>
      </div>

      <Card title="Timeline">
        <StatusTimeline history={delivery.statusHistory} />
      </Card>

      {(showCustomerCancel || showStaffActions) ? (
        <Card title="Actions" icon={RefreshCw}>
          {showStaffActions ? (
            <form onSubmit={submitStatus} className="space-y-4">
              <FormField
                label="Advance status"
                as="select"
                value={nextStatus}
                onChange={(e) => setNextStatus(e.target.value)}
                required
              >
                <option value="">Choose next status…</option>
                {options.map((s) => (
                  <option key={s} value={s}>
                    {statusLabel(s)}
                  </option>
                ))}
              </FormField>
              <FormField
                label="Note"
                hint="Optional. Shown on the timeline."
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
              />
              <Button type="submit" loading={updating} disabled={!nextStatus}>
                Update status
              </Button>
            </form>
          ) : null}

          {showCustomerCancel ? (
            <div className={showStaffActions ? 'mt-6 border-t border-ink/10 pt-6' : ''}>
              {cancelOpen ? (
                <div className="space-y-4">
                  <FormField
                    label="Reason for cancelling"
                    hint="Optional, but it helps us improve."
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                  />
                  <div className="flex gap-3">
                    <Button variant="danger" onClick={submitCancel} loading={cancelling}>
                      Confirm cancellation
                    </Button>
                    <Button variant="ghost" onClick={() => setCancelOpen(false)} disabled={cancelling}>
                      Keep delivery
                    </Button>
                  </div>
                </div>
              ) : (
                <Button variant="danger" onClick={() => setCancelOpen(true)}>
                  <XCircle className="h-4 w-4" aria-hidden="true" />
                  Cancel delivery
                </Button>
              )}
            </div>
          ) : null}
        </Card>
      ) : null}
    </div>
  );
}
