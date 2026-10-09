export default function EmptyState({ icon: Icon, title, description, action, className = '' }) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-3xl border border-dashed border-ink/15 bg-white/60 px-6 py-14 text-center ${className}`}
    >
      {Icon ? (
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-lilac text-brand">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
      ) : null}
      <h3 className="mt-5 font-display text-lg font-bold text-ink">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">{description}</p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
