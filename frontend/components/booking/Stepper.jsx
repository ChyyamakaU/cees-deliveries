import { Check } from 'lucide-react';

export default function Stepper({ steps, current, onStepClick }) {
  return (
    <ol className="flex items-center">
      {steps.map((step, index) => {
        const isDone = index < current;
        const isCurrent = index === current;
        const clickable = isDone && typeof onStepClick === 'function';

        return (
          <li key={step.key} className="flex flex-1 items-center last:flex-none">
            <button
              type="button"
              onClick={clickable ? () => onStepClick(index) : undefined}
              disabled={!clickable}
              aria-current={isCurrent ? 'step' : undefined}
              className={`group flex items-center gap-2.5 rounded-full py-1 pr-2 text-left transition-colors ${
                clickable ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              <span
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 text-sm font-bold transition-colors ${
                  isCurrent
                    ? 'border-brand bg-brand text-white'
                    : isDone
                      ? 'border-brand bg-white text-brand'
                      : 'border-ink/15 bg-white text-ink-soft/60'
                }`}
              >
                {isDone ? <Check className="h-4 w-4" aria-hidden="true" /> : index + 1}
              </span>
              <span
                className={`hidden text-sm font-semibold sm:block ${
                  isCurrent ? 'text-ink' : isDone ? 'text-brand' : 'text-ink-soft/60'
                }`}
              >
                {step.label}
              </span>
            </button>

            {index < steps.length - 1 ? (
              <span
                aria-hidden="true"
                className={`mx-2 h-0.5 flex-1 rounded-full transition-colors ${
                  index < current ? 'bg-brand' : 'bg-ink/12'
                }`}
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
