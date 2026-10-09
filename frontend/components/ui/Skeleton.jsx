/** Lightweight skeleton block used while real content is loading. */
export default function Skeleton({ className = 'h-4 w-full', rounded = 'rounded-full' }) {
  return (
    <span
      className={`block animate-pulse bg-ink/10 ${rounded} ${className}`}
      aria-hidden="true"
    />
  );
}

/** Convenience wrapper announcing a busy region to assistive tech. */
export function LoadingState({ label = 'Loading…', className = '' }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center gap-3 py-12 text-sm font-medium text-ink-soft ${className}`}
    >
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-brand/30 border-t-brand" />
      {label}
    </div>
  );
}
