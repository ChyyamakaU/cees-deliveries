'use client';

import { useEffect, useState } from 'react';
import { UserPlus, X } from 'lucide-react';
import { assignDeliveryRider, listAdminRiders } from '@/lib/api';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import FormField from '@/components/ui/FormField';

export default function AssignRider({ delivery, onAssigned }) {
  const [open, setOpen] = useState(false);
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [riderId, setRiderId] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    let active = true;
    setLoading(true);
    setError('');
    listAdminRiders({ isVerified: true, limit: 100 })
      .then((res) => {
        if (active) setRiders(res.data);
      })
      .catch((err) => {
        if (active) setError(err.message || 'Could not load riders.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [open]);

  const submit = async (event) => {
    event.preventDefault();
    if (!riderId) return;
    setSaving(true);
    setError('');
    try {
      const updated = await assignDeliveryRider(delivery.id, riderId, note.trim() || undefined);
      onAssigned(updated);
      setOpen(false);
      setRiderId('');
      setNote('');
    } catch (err) {
      setError(err.message || 'Could not assign this rider.');
    } finally {
      setSaving(false);
    }
  };

  if (!open) {
    return (
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
        <UserPlus className="h-4 w-4" aria-hidden="true" />
        {delivery.rider ? 'Reassign' : 'Assign rider'}
      </Button>
    );
  }

  return (
    <form onSubmit={submit} className="mt-3 rounded-2xl border border-brand/30 bg-lilac/40 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-ink">Assign a rider</p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="grid h-7 w-7 place-items-center rounded-lg text-ink-soft hover:bg-white hover:text-coral"
          aria-label="Cancel assignment"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {error ? (
        <div className="mt-3">
          <Alert variant="error">{error}</Alert>
        </div>
      ) : null}

      <div className="mt-3 space-y-3">
        <FormField
          label="Rider"
          as="select"
          value={riderId}
          onChange={(e) => setRiderId(e.target.value)}
          disabled={loading}
          required
        >
          <option value="">{loading ? 'Loading riders…' : 'Choose a verified rider…'}</option>
          {riders.map((rider) => (
            <option key={rider.userId} value={rider.userId}>
              {rider.user?.firstName} {rider.user?.lastName} · {rider.availability.toLowerCase()}
            </option>
          ))}
        </FormField>

        <FormField
          label="Note"
          hint="Optional note added to the timeline."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <Button type="submit" size="sm" loading={saving} disabled={!riderId}>
          Confirm assignment
        </Button>
      </div>
    </form>
  );
}
