'use client';

import { useState } from 'react';
import { CheckCircle2, PowerOff, Truck } from 'lucide-react';
import { updateRiderAvailability } from '@/lib/api';
import Alert from '@/components/ui/Alert';

const OPTIONS = [
  {
    value: 'AVAILABLE',
    label: 'Available',
    hint: 'Ready to receive jobs',
    icon: CheckCircle2,
    active: 'bg-delivered text-white shadow-lg shadow-delivered/25',
  },
  {
    value: 'BUSY',
    label: 'Busy',
    hint: 'On a delivery',
    icon: Truck,
    active: 'bg-solar-deep text-white shadow-lg shadow-solar-deep/25',
  },
  {
    value: 'OFFLINE',
    label: 'Offline',
    hint: 'Not taking jobs',
    icon: PowerOff,
    active: 'bg-ink text-white shadow-lg shadow-ink/20',
  },
];

export default function AvailabilityControl({ profile, onChange }) {
  const [saving, setSaving] = useState('');
  const [error, setError] = useState('');

  const select = async (value) => {
    if (value === profile.availability || saving) return;
    setSaving(value);
    setError('');
    try {
      const updated = await updateRiderAvailability(value);
      onChange(updated);
    } catch (err) {
      setError(err.message || 'Could not update your availability.');
    } finally {
      setSaving('');
    }
  };

  return (
    <section className="rounded-2xl border border-ink/10 bg-white p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-ink">Availability</h2>
          <p className="text-sm text-ink-soft">Tell us whether you can take jobs.</p>
        </div>
      </div>

      {!profile.isVerified ? (
        <div className="mt-4">
          <Alert variant="warning">
            Your rider account is awaiting verification. You can set your availability once an admin
            verifies you.
          </Alert>
        </div>
      ) : null}

      {error ? (
        <div className="mt-4">
          <Alert variant="error">{error}</Alert>
        </div>
      ) : null}

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {OPTIONS.map((option) => {
          const Icon = option.icon;
          const isActive = profile.availability === option.value;
          const isSaving = saving === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => select(option.value)}
              disabled={!profile.isVerified || Boolean(saving)}
              aria-pressed={isActive}
              className={`flex flex-col items-start gap-1.5 rounded-2xl border px-4 py-3 text-left transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
                isActive
                  ? `${option.active} border-transparent`
                  : 'border-ink/12 bg-white text-ink hover:border-brand/40'
              }`}
            >
              <span className="flex items-center gap-2 text-sm font-bold">
                <Icon className="h-4 w-4" aria-hidden="true" />
                {option.label}
                {isSaving ? <span className="text-xs font-medium opacity-80">saving…</span> : null}
              </span>
              <span className={`text-xs ${isActive ? 'text-white/80' : 'text-ink-soft'}`}>
                {option.hint}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
