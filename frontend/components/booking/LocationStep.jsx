import { MapPin, PackageCheck } from 'lucide-react';
import FormField from '@/components/ui/FormField';

function AddressGroup({ tone, title, Icon, prefix, values, setField, errors }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5">
      <div className="flex items-center gap-2.5">
        <span
          className={`grid h-9 w-9 place-items-center rounded-xl ${
            tone === 'pickup' ? 'bg-coral-tint text-coral' : 'bg-lilac text-brand'
          }`}
        >
          <Icon className="h-4.5 w-4.5" aria-hidden="true" />
        </span>
        <h3 className="font-display font-bold text-ink">{title}</h3>
      </div>

      <div className="mt-5 space-y-4">
        <FormField
          label="Label"
          name={`${prefix}Label`}
          value={values[`${prefix}Label`]}
          onChange={(e) => setField(`${prefix}Label`, e.target.value)}
          error={errors[`${prefix}Label`]}
          placeholder={tone === 'pickup' ? 'e.g. Home' : 'e.g. Office'}
          required
        />
        <FormField
          label="Address"
          as="textarea"
          rows={2}
          name={`${prefix}Address`}
          value={values[`${prefix}Address`]}
          onChange={(e) => setField(`${prefix}Address`, e.target.value)}
          error={errors[`${prefix}Address`]}
          placeholder="Street, area, city"
          required
        />
        <FormField
          label={tone === 'pickup' ? 'Contact name' : 'Recipient name'}
          name={`${prefix}ContactName`}
          value={values[`${prefix}ContactName`]}
          onChange={(e) => setField(`${prefix}ContactName`, e.target.value)}
          error={errors[`${prefix}ContactName`]}
          required
        />
        <FormField
          label="Contact phone"
          name={`${prefix}ContactPhone`}
          value={values[`${prefix}ContactPhone`]}
          onChange={(e) => setField(`${prefix}ContactPhone`, e.target.value)}
          error={errors[`${prefix}ContactPhone`]}
          placeholder="+234..."
          required
        />
      </div>
    </div>
  );
}

export default function LocationStep({ values, setField, errors }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-5 lg:grid-cols-2">
        <AddressGroup
          tone="pickup"
          title="Pickup"
          Icon={MapPin}
          prefix="pickup"
          values={values}
          setField={setField}
          errors={errors}
        />
        <AddressGroup
          tone="dropoff"
          title="Destination"
          Icon={PackageCheck}
          prefix="dropoff"
          values={values}
          setField={setField}
          errors={errors}
        />
      </div>

      <div className="rounded-2xl border border-ink/10 bg-white p-5">
        <FormField
          label="Approximate trip distance (km)"
          hint="Optional. Used only for the fee estimate; we confirm the final cost."
          type="number"
          min="0"
          step="0.1"
          name="distanceKm"
          value={values.distanceKm}
          onChange={(e) => setField('distanceKm', e.target.value)}
          error={errors.distanceKm}
          placeholder="e.g. 8"
        />
      </div>
    </div>
  );
}
