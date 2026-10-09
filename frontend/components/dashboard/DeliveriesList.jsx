'use client';

import { useCallback, useEffect, useState } from 'react';
import { Package, Search } from 'lucide-react';
import { listDeliveries } from '@/lib/api';
import { STATUS_FILTERS } from '@/lib/deliveryStatus';
import DeliveryCard from './DeliveryCard';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import EmptyState from '@/components/ui/EmptyState';
import Pagination from '@/components/ui/Pagination';
import { LoadingState } from '@/components/ui/Skeleton';

const LIMIT = 8;

export default function DeliveriesList() {
  const [status, setStatus] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [state, setState] = useState({ loading: true, error: '', items: [], meta: null });

  const load = useCallback(() => {
    let active = true;
    setState((s) => ({ ...s, loading: true, error: '' }));
    listDeliveries({ status, search, page, limit: LIMIT })
      .then((res) => {
        if (!active) return;
        setState({ loading: false, error: '', items: res.data, meta: res.meta });
      })
      .catch((err) => {
        if (active) setState({ loading: false, error: err.message || 'Could not load deliveries.', items: [], meta: null });
      });
    return () => {
      active = false;
    };
  }, [status, search, page]);

  useEffect(() => load(), [load]);

  const onFilter = (value) => {
    setStatus(value);
    setPage(1);
  };

  const onSearch = (event) => {
    event.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  };

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          Deliveries
        </h1>
        <p className="mt-1 text-ink-soft">Every delivery tied to your account.</p>
      </header>

      <div className="space-y-4">
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

        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.value || 'all'}
              type="button"
              onClick={() => onFilter(filter.value)}
              aria-pressed={status === filter.value}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                status === filter.value
                  ? 'bg-brand text-white'
                  : 'border border-ink/12 bg-white text-ink-soft hover:border-brand/40 hover:text-brand'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {state.loading ? (
          <LoadingState label="Loading deliveries…" />
        ) : state.error ? (
          <Alert variant="error">{state.error}</Alert>
        ) : state.items.length ? (
          <>
            <div className="space-y-3">
              {state.items.map((delivery) => (
                <DeliveryCard key={delivery.id} delivery={delivery} />
              ))}
            </div>
            <Pagination meta={state.meta} onPage={setPage} />
          </>
        ) : (
          <EmptyState
            icon={Package}
            title="Nothing to show"
            description={
              search || status
                ? 'No deliveries match these filters. Try clearing them.'
                : 'Book your first delivery to see it here.'
            }
            action={<Button href="/book">Book a delivery</Button>}
          />
        )}
      </div>
    </div>
  );
}
