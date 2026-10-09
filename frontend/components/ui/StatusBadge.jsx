/**
 * Delivery status is a controlled vocabulary. Each status maps to a tone from the
 * functional palette, kept deliberately distinct from the brand purple/coral.
 */
const STATUS = {
  PENDING: { label: 'Pending', tone: 'pending' },
  CONFIRMED: { label: 'Confirmed', tone: 'info' },
  ASSIGNED: { label: 'Assigned', tone: 'info' },
  PICKED_UP: { label: 'Picked up', tone: 'transit' },
  IN_TRANSIT: { label: 'In transit', tone: 'transit' },
  DELIVERED: { label: 'Delivered', tone: 'delivered' },
  CANCELLED: { label: 'Cancelled', tone: 'failed' },
  FAILED: { label: 'Failed', tone: 'failed' },
};

const TONES = {
  neutral: 'bg-lilac text-ink-soft',
  brand: 'bg-brand/12 text-brand',
  pending: 'bg-pending-bg text-pending',
  info: 'bg-info-bg text-info',
  transit: 'bg-transit-bg text-transit',
  delivered: 'bg-delivered-bg text-delivered',
  failed: 'bg-failed-bg text-failed',
};

export function statusLabel(status) {
  return STATUS[status]?.label || status || 'Unknown';
}

/**
 * Pill that renders a delivery status (or an explicit tone/label). Status
 * colours stay distinguishable from the brand identity.
 */
export default function StatusBadge({ status, tone, children, className = '', dot = false }) {
  const resolved = status ? STATUS[status] : null;
  const resolvedTone = tone || resolved?.tone || 'neutral';
  const label = children || resolved?.label || status;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
        TONES[resolvedTone] || TONES.neutral
      } ${className}`}
    >
      {dot ? <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" /> : null}
      {label}
    </span>
  );
}
