'use client';

import { useState } from 'react';
import { CheckCircle2, Copy, Check, Search, Plus } from 'lucide-react';
import Button from '@/components/ui/Button';
import StatusBadge from '@/components/ui/StatusBadge';

function formatMoney(amount, currency = 'NGN') {
  try {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `${currency} ${Number(amount || 0).toLocaleString()}`;
  }
}

export default function SuccessStep({ delivery, onReset }) {
  const [copied, setCopied] = useState(false);
  const code = delivery?.trackingCode;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="text-center">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-delivered-bg text-delivered">
        <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
      </span>

      <h2 className="mt-5 font-display text-2xl font-extrabold text-ink sm:text-3xl">
        Delivery requested
      </h2>
      <p className="mx-auto mt-3 max-w-md text-ink-soft">
        We&apos;ve received your request and it&apos;s awaiting confirmation. Save your tracking
        code to follow its progress.
      </p>

      <div className="mx-auto mt-7 max-w-sm rounded-2xl border border-ink/10 bg-white p-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
          Tracking code
        </p>
        <div className="mt-2 flex items-center justify-center gap-3">
          <span className="font-display text-2xl font-extrabold tracking-wider text-brand">
            {code}
          </span>
          <button
            type="button"
            onClick={copy}
            className="grid h-9 w-9 place-items-center rounded-xl border border-ink/12 text-ink-soft transition-colors hover:border-brand/40 hover:text-brand"
            aria-label="Copy tracking code"
          >
            {copied ? (
              <Check className="h-4 w-4 text-delivered" aria-hidden="true" />
            ) : (
              <Copy className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
        <div className="mt-4 flex items-center justify-center gap-2 border-t border-ink/10 pt-4 text-sm">
          <StatusBadge status={delivery?.status} />
          <span className="text-ink-soft">Estimated fee {formatMoney(delivery?.deliveryFee, delivery?.currency)}</span>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button href={`/?code=${code}#track`} variant="primary" size="lg">
          <Search className="h-4 w-4" aria-hidden="true" />
          Track this delivery
        </Button>
        <Button onClick={onReset} variant="secondary" size="lg">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Book another
        </Button>
      </div>
    </div>
  );
}
