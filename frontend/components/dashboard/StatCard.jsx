export default function StatCard({ icon: Icon, label, value, tone = 'brand', hint }) {
  const TONES = {
    brand: 'bg-lilac text-brand',
    coral: 'bg-coral-tint text-coral',
    solar: 'bg-solar-tint text-solar-ink',
    delivered: 'bg-delivered-bg text-delivered',
    transit: 'bg-transit-bg text-transit',
    failed: 'bg-failed-bg text-failed',
  };

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-ink-soft">{label}</p>
        {Icon ? (
          <span className={`grid h-9 w-9 place-items-center rounded-xl ${TONES[tone] || TONES.brand}`}>
            <Icon className="h-4.5 w-4.5" aria-hidden="true" />
          </span>
        ) : null}
      </div>
      <p className="mt-3 font-display text-3xl font-extrabold text-ink">{value}</p>
      {hint ? <p className="mt-1 text-xs text-ink-soft">{hint}</p> : null}
    </div>
  );
}
