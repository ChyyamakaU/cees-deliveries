'use client';

import { useCallback, useEffect, useState } from 'react';
import { Package } from 'lucide-react';
import { listRiderDeliveries, listRiderHistory } from '@/lib/api';
import { STATUS_FILTERS } from '@/lib/deliveryStatus';
import DeliveryCard from '@/components/dashboard/DeliveryCard';
import Alert from '@/components/ui/Alert';
import EmptyState from '@/components/ui/EmptyState';
import Pagination from '@/components/ui/Pagination';
import { LoadingState } from '@/components/ui/Skeleton';

const LIMIT = 8;

export default function RiderDeliveriesPanel({ history = false, reloadKey = 0 }) {
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [state, setState] = useState({ loading: true, error: '', items: [], meta: null });

  const load = useCallback(() => {
    let active = true;
    setState((s) => ({ ...s, loading: true, error: '' }));
    const request = history
      ? listRiderHistory({ page, limit: LIMIT })
      : listRiderDeliveries({ status, page, limit: LIMIT });
    request
      .then((res) => {
        if (active) setState({ loading: false, error: '', items: res.data, meta: res.meta });
      })
      .catch((err) => {
        if (active) setState({ loading: false, error: err.message || 'Could not load deliveries.', items: [], meta: null });
      });
    return () => {
      active = false;
    };
  }, [history, status, page, reloadKey]);

  useEffect(() => load(), [load]);

  return (
    <div>
      {!history ? (
        <div className="flex flex-wrap gap-2">
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
      ) : null}

      <div className={history ? '' : 'mt-5'}>
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
            title={history ? 'No completed deliveries yet' : 'No deliveries here'}
            description={
              history
                ? 'Delivered and cancelled jobs will appear in your history.'
                : 'Accept a job from the Jobs tab and it will show up here.'
            }
          />
        )}
      </div>
    </div>
  );
}
