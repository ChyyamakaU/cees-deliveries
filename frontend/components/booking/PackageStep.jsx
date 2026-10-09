import FormField from '@/components/ui/FormField';
import { getService } from '@/lib/services';

export default function PackageStep({ values, setField, errors }) {
  const service = getService(values.category);

  return (
    <div className="space-y-6">
      <FormField
        label="Item or order description"
        as="textarea"
        rows={3}
        name="packageDescription"
        value={values.packageDescription}
        onChange={(e) => setField('packageDescription', e.target.value)}
        error={errors.packageDescription}
        placeholder={service?.descriptionPlaceholder || 'What are we delivering?'}
        required
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          label="Weight (kg)"
          hint="Optional"
          type="number"
          min="0"
          step="0.1"
          name="packageWeight"
          value={values.packageWeight}
          onChange={(e) => setField('packageWeight', e.target.value)}
          error={errors.packageWeight}
          placeholder="e.g. 2.5"
        />
        <FormField
          label="Preferred delivery time"
          hint="Optional. Leave blank for as soon as possible."
          type="datetime-local"
          name="scheduledPickupAt"
          value={values.scheduledPickupAt}
          onChange={(e) => setField('scheduledPickupAt', e.target.value)}
        />
      </div>

      <FormField
        label="Special instructions"
        hint="Optional. Gate codes, landmarks, handling notes."
        as="textarea"
        rows={3}
        name="notes"
        value={values.notes}
        onChange={(e) => setField('notes', e.target.value)}
        error={errors.notes}
        placeholder="Anything the rider should know?"
      />
    </div>
  );
}
