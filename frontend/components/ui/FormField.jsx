'use client';

import { useId } from 'react';
import { ChevronDown } from 'lucide-react';

const baseControl =
  'w-full rounded-2xl border bg-white px-4 text-lg text-ink shadow-sm outline-none transition-colors placeholder:text-ink-soft/50 disabled:cursor-not-allowed disabled:bg-lilac/50 disabled:text-ink-soft';

function controlClasses(error) {
  return [
    baseControl,
    error
      ? 'border-failed focus:border-failed focus:ring-2 focus:ring-failed/25'
      : 'border-ink/12 focus:border-brand focus:ring-2 focus:ring-brand/20',
  ].join(' ');
}

/**
 * Accessible form control with a label, optional hint and inline error message.
 * Renders an <input>, <textarea> or <select> depending on `as`.
 */
export default function FormField({
  as = 'input',
  label,
  id,
  name,
  error,
  hint,
  required = false,
  className = '',
  children,
  ...props
}) {
  const generatedId = useId();
  const fieldId = id || `field-${name || generatedId}`;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined;

  const shared = {
    id: fieldId,
    name,
    required,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
    className: controlClasses(error),
  };

  return (
    <div className={className}>
      {label ? (
        <label htmlFor={fieldId} className="mb-2 block text-sm font-semibold text-ink">
          {label}
          {required ? <span className="ml-0.5 text-coral">*</span> : null}
        </label>
      ) : null}

      {as === 'textarea' ? (
        <textarea {...shared} rows={4} className={`${controlClasses(error)} py-3`} {...props} />
      ) : as === 'select' ? (
        <div className="relative">
          <select
            {...shared}
            className={`${controlClasses(error)} h-11 appearance-none pr-10 ${
              props.value === '' ? 'text-ink-soft/60' : ''
            }`}
            {...props}
          >
            {children}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft"
            aria-hidden="true"
          />
        </div>
      ) : (
        <div className="relative">
          <input {...shared} type={props.type || 'text'} className={`${controlClasses(error)} h-11 ${props.endAdornment ? 'pr-10' : ''}`} {...props} />
          {props.endAdornment ? props.endAdornment : null}
        </div>
      )}

      {error ? (
        <p id={errorId} className="mt-1.5 text-sm font-medium text-failed">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="mt-1.5 text-sm text-ink-soft">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
