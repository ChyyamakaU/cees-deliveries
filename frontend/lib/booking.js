export const STEPS = [
  { key: 'service', label: 'Service' },
  { key: 'locations', label: 'Locations' },
  { key: 'package', label: 'Package' },
  { key: 'review', label: 'Review' },
];

export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isPhone(value) {
  const digits = value.replace(/[^\d]/g, '');
  return digits.length >= 7 && value.length <= 30;
}

export const emptyBooking = {
  category: '',
  packageSize: '',
  packageDescription: '',
  packageWeight: '',
  distanceKm: '',
  pickupLabel: '',
  pickupAddress: '',
  pickupContactName: '',
  pickupContactPhone: '',
  dropoffLabel: '',
  dropoffAddress: '',
  dropoffContactName: '',
  dropoffContactPhone: '',
  scheduledPickupAt: '',
  notes: '',
};

/** Mirrors the backend validators so users get instant, inline feedback. */
export function validateStep(stepKey, values) {
  const errors = {};

  if (stepKey === 'service') {
    if (!values.category) errors.category = 'Choose a delivery category';
    if (!values.packageSize) errors.packageSize = 'Choose a package size';
  }

  if (stepKey === 'locations') {
    if (!values.pickupLabel.trim()) errors.pickupLabel = 'Pickup label is required';
    if (!values.pickupAddress.trim()) errors.pickupAddress = 'Pickup address is required';
    if (!values.pickupContactName.trim()) errors.pickupContactName = 'Pickup contact name is required';
    if (!values.pickupContactPhone.trim()) errors.pickupContactPhone = 'Pickup contact phone is required';
    else if (!isPhone(values.pickupContactPhone.trim())) errors.pickupContactPhone = 'Phone number looks invalid';

    if (!values.dropoffLabel.trim()) errors.dropoffLabel = 'Destination label is required';
    if (!values.dropoffAddress.trim()) errors.dropoffAddress = 'Destination address is required';
    if (!values.dropoffContactName.trim()) errors.dropoffContactName = 'Recipient name is required';
    if (!values.dropoffContactPhone.trim()) errors.dropoffContactPhone = 'Recipient phone is required';
    else if (!isPhone(values.dropoffContactPhone.trim())) errors.dropoffContactPhone = 'Phone number looks invalid';

    if (values.distanceKm !== '' && (Number.isNaN(Number(values.distanceKm)) || Number(values.distanceKm) < 0)) {
      errors.distanceKm = 'Distance must be a positive number';
    }
  }

  if (stepKey === 'package') {
    if (!values.packageDescription.trim()) errors.packageDescription = 'Describe what you are sending';
    if (values.packageWeight !== '' && (Number.isNaN(Number(values.packageWeight)) || Number(values.packageWeight) < 0)) {
      errors.packageWeight = 'Weight must be a positive number';
    }
    if (values.notes.length > 1000) errors.notes = 'Keep instructions under 1000 characters';
  }

  return errors;
}

export function toPayload(values) {
  const payload = {
    pickupLabel: values.pickupLabel.trim(),
    pickupAddress: values.pickupAddress.trim(),
    pickupContactName: values.pickupContactName.trim(),
    pickupContactPhone: values.pickupContactPhone.trim(),
    dropoffLabel: values.dropoffLabel.trim(),
    dropoffAddress: values.dropoffAddress.trim(),
    dropoffContactName: values.dropoffContactName.trim(),
    dropoffContactPhone: values.dropoffContactPhone.trim(),
    packageDescription: values.packageDescription.trim(),
    packageSize: values.packageSize,
    category: values.category,
  };

  if (values.packageWeight !== '') payload.packageWeight = Number(values.packageWeight);
  if (values.distanceKm !== '') payload.distanceKm = Number(values.distanceKm);
  if (values.scheduledPickupAt) payload.scheduledPickupAt = new Date(values.scheduledPickupAt).toISOString();
  if (values.notes.trim()) payload.notes = values.notes.trim();

  return payload;
}
