import { Check } from 'lucide-react';
import { PACKAGE_SIZES, SERVICE_LIST } from '@/lib/services';

const ACCENTS = {
  coral: 'border-coral/40 bg-coral-tint text-coral',
  solar: 'border-solar/50 bg-solar-tint text-solar-ink',
  violet: 'border-violet/40 bg-lilac text-brand',
  brand: 'border-brand/40 bg-lilac text-brand',
};

export default function ServiceStep({ values, setField, errors }) {
  return (
    <div className="space-y-8">
      <fieldset>
        <legend className="text-sm font-bold text-ink">Delivery category</legend>
        <p className="mt-1 text-sm text-ink-soft">What are we delivering today?</p>
        <div role="radiogroup" aria-label="Delivery category" className="mt-4 grid gap-3 sm:grid-cols-2">
          {SERVICE_LIST.map(({ key, label, blurb, Icon, defaultSize, accent }) => {
            const selected = values.category === key;
            const accentClasses = ACCENTS[accent] || ACCENTS.brand;
            return (
              <button
                key={key}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => {
                  setField('category', key);
                  if (!values.packageSize) setField('packageSize', defaultSize);
                }}
                className={`flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all ${
                  selected
                    ? 'border-brand bg-lilac/70 shadow-sm'
                    : 'border-ink/10 bg-white hover:border-brand/40'
                }`}
              >
                <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl border ${accentClasses}`}>
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block font-display font-bold text-ink">{label}</span>
                  <span className="block text-sm text-ink-soft">{blurb}</span>
                </span>
                {selected ? <Check className="ml-auto h-5 w-5 text-brand" aria-hidden="true" /> : null}
              </button>
            );
          })}
        </div>
        {errors.category ? <p className="mt-2 text-sm font-medium text-failed">{errors.category}</p> : null}
      </fieldset>

      <fieldset>
        <legend className="text-sm font-bold text-ink">Package size</legend>
        <p className="mt-1 text-sm text-ink-soft">This affects the estimated fee.</p>
        <div role="radiogroup" aria-label="Package size" className="mt-4 grid gap-3 sm:grid-cols-3">
          {PACKAGE_SIZES.map(({ value, label, hint }) => {
            const selected = values.packageSize === value;
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setField('packageSize', value)}
                className={`rounded-2xl border-2 p-4 text-left transition-all ${
                  selected
                    ? 'border-brand bg-lilac/70 shadow-sm'
                    : 'border-ink/10 bg-white hover:border-brand/40'
                }`}
              >
                <span className="block font-bold text-ink">{label}</span>
                <span className="mt-0.5 block text-sm text-ink-soft">{hint}</span>
              </button>
            );
          })}
        </div>
        {errors.packageSize ? <p className="mt-2 text-sm font-medium text-failed">{errors.packageSize}</p> : null}
      </fieldset>
    </div>
  );
}
