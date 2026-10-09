import { statusLabel } from '@/components/ui/StatusBadge';
import { formatDateTime } from '@/lib/format';

export default function StatusTimeline({ history = [] }) {
  if (!history.length) {
    return <p className="text-sm text-ink-soft">No status updates yet.</p>;
  }

  return (
    <ol className="relative space-y-6 border-l-2 border-lilac pl-6">
      {history.map((entry) => (
        <li key={entry.id} className="relative">
          <span
            className="absolute -left-[1.9rem] top-1 grid h-4 w-4 place-items-center rounded-full border-2 border-white bg-brand"
            aria-hidden="true"
          />
          <p className="font-semibold text-ink">{statusLabel(entry.status)}</p>
          {entry.note ? <p className="text-sm text-ink-soft">{entry.note}</p> : null}
          <p className="mt-1 text-xs text-ink-soft/80">
            {formatDateTime(entry.createdAt)}
            {entry.changedBy ? ` · ${entry.changedBy.firstName} ${entry.changedBy.lastName}` : ''}
          </p>
        </li>
      ))}
    </ol>
  );
}
