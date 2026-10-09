export function formatMoney(amount, currency = 'NGN') {
  const value = Number(amount || 0);
  try {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${currency} ${value.toLocaleString()}`;
  }
}

export function formatDate(value) {
  if (!value) return '—';
  try {
    return new Intl.DateTimeFormat('en-NG', { dateStyle: 'medium' }).format(new Date(value));
  } catch {
    return '—';
  }
}

export function formatDateTime(value) {
  if (!value) return '—';
  try {
    return new Intl.DateTimeFormat('en-NG', { dateStyle: 'medium', timeStyle: 'short' }).format(
      new Date(value)
    );
  } catch {
    return '—';
  }
}

export function titleCase(value) {
  if (!value) return '';
  return value
    .toString()
    .toLowerCase()
    .replace(/(^|\s|_)\S/g, (c) => c.toUpperCase())
    .replace(/_/g, ' ');
}
