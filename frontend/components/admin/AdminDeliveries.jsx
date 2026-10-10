'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, Search } from 'lucide-react';
import { listAdminDeliveries } from '@/lib/api';
import { STATUS_FILTERS } from '@/lib/deliveryStatus';
import { formatDate, formatMoney } from '@/lib/format';
import StatusBadge from '@/components/ui/StatusBadge';
import AssignRider from './AssignRider';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import EmptyState from '@/components/ui/EmptyState';
import Pagination from '@/components/ui/Pagination';
import { LoadingState } from '@/components/ui/Skeleton';

const LIMIT = 10;

export default function AdminDeliveries() {
  const [status, setStatus] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [state, setState] = useState({ loading: true, error: '', items: [], meta: null });
  const [notice, setNotice] = useState('');

  const load = useCallback(() => {
    let active = true;
    setState((s) => ({ ...s, loading: true, error: '' }));
    listAdminDeliveries({ status, search, page, limit: LIMIT })
      .then((res) => {
        if (active) setState({ loading: false, error: '', items: res.data, meta: res.meta });
      })
      .catch((err) => {
        if (active) setState({ loading: false, error: err.message || 'Could not load deliveries.', items: [], meta: null });
      });
    return () => {
      active = false;
    };
  }, [status, search, page]);

  useEffect(() => load(), [load]);

  const onSearch = (event) => {
    event.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  };

  const onAssigned = (updated) => {
    setState((s) => ({ ...s, items: s.items.map((d) => (d.id === updated.id ? updated : d)) }));
    setNotice(`Rider assigned to ${updated.trackingCode}.`);
    setTimeout(() => setNotice(''), 4000);
  };

  const canAssign = (delivery) => ['CONFIRMED', 'ASSIGNED'].includes(delivery.status);

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          Deliveries
        </h1>
        <p className="mt-1 text-ink-soft">Every delivery on the platform.</p>
      </header>

      <form onSubmit={onSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" aria-hidden="true" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by tracking code"
            aria-label="Search by tracking code"
            className="h-11 w-full rounded-2xl border border-ink/12 bg-white pl-10 pr-4 text-sm text-ink shadow-sm outline-none transition-colors placeholder:text-ink-soft/50 focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>
        <Button type="submit" variant="secondary">
          Search
        </Button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter.value || 'all'}
            type="button"
            onClick={() => {
              setStatus(filter.value);
              setPage(1);
            }}
            aria-pressed={status === filter.value}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              status === filter.value
                ? 'bg-coral text-white'
                : 'border border-ink/12 bg-white text-ink-soft hover:border-coral/40 hover:text-coral'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {notice ? (
        <div className="mt-4">
          <Alert variant="success">{notice}</Alert>
        </div>
      ) : null}

      <div className="mt-5">
        {state.loading ? (
          <LoadingState label="Loading deliveries…" />
        ) : state.error ? (
          <Alert variant="error">{state.error}</Alert>
        ) : state.items.length ? (
          <>
            <div className="space-y-3">
              {state.items.map((delivery) => (
                <article key={delivery.id} className="rounded-2xl border border-ink/10 bg-white p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/dashboard/deliveries/${delivery.id}`}
                          className="font-display text-sm font-extrabold tracking-wide text-brand hover:underline"
                        >
                          {delivery.trackingCode}
                        </Link>
                        <StatusBadge status={delivery.status} />
                      </div>
                      <p className="mt-2 truncate text-sm font-semibold text-ink">
                        {delivery.pickupLabel} <span className="text-ink-soft">→</span> {delivery.dropoffLabel}
                      </p>
                      <p className="truncate text-sm text-ink-soft">{delivery.packageDescription}</p>
                      <p className="mt-1 text-xs text-ink-soft">
                        Customer: {delivery.customer ? `${delivery.customer.firstName} ${delivery.customer.lastName}` : '—'} ·
                        {' '}
                        {formatDate(delivery.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-display font-extrabold text-ink">
                        {formatMoney(delivery.deliveryFee, delivery.currency)}
                      </p>
                      <p className="mt-1 text-xs text-ink-soft">
                        Rider: {delivery.rider ? `${delivery.rider.firstName} ${delivery.rider.lastName}` : 'Unassigned'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-ink/8 pt-4">
                    <Button href={`/dashboard/deliveries/${delivery.id}`} variant="ghost" size="sm">
                      View details
                    </Button>
                    {canAssign(delivery) ? (
                      <AssignRider delivery={delivery} onAssigned={onAssigned} />
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
            <Pagination meta={state.meta} onPage={setPage} />
          </>
        ) : (
          <EmptyState
            icon={Package}
            title="No deliveries found"
            description={search || status ? 'Try clearing your filters.' : 'No deliveries have been booked yet.'}
          />
        )}
      </div>
    </div>
  );
}
