'use client';

import { useCallback, useEffect, useState } from 'react';
import { PackageOpen, RefreshCw } from 'lucide-react';
import { acceptRiderJob, listRiderJobs } from '@/lib/api';
import RiderJobCard from './RiderJobCard';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import EmptyState from '@/components/ui/EmptyState';
import Pagination from '@/components/ui/Pagination';
import { LoadingState } from '@/components/ui/Skeleton';

const LIMIT = 8;

export default function JobsPanel({ canAccept, onAccepted }) {
  const [page, setPage] = useState(1);
  const [state, setState] = useState({ loading: true, error: '', items: [], meta: null });
  const [acceptingId, setAcceptingId] = useState(null);
  const [acceptError, setAcceptError] = useState('');

  const load = useCallback(() => {
    let active = true;
    setState((s) => ({ ...s, loading: true, error: '' }));
    listRiderJobs({ page, limit: LIMIT })
      .then((res) => {
        if (active) setState({ loading: false, error: '', items: res.data, meta: res.meta });
      })
      .catch((err) => {
        if (active) setState({ loading: false, error: err.message || 'Could not load jobs.', items: [], meta: null });
      });
    return () => {
      active = false;
    };
  }, [page]);

  useEffect(() => load(), [load]);

  const accept = async (job) => {
    setAcceptingId(job.id);
    setAcceptError('');
    try {
      await acceptRiderJob(job.id);
      setState((s) => ({
        ...s,
        items: s.items.filter((item) => item.id !== job.id),
        meta: s.meta ? { ...s.meta, total: Math.max((s.meta.total || 1) - 1, 0) } : s.meta,
      }));
      if (onAccepted) onAccepted(job);
    } catch (err) {
      setAcceptError(err.message || 'Could not accept this job.');
    } finally {
      setAcceptingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-ink-soft">Confirmed deliveries waiting for a rider.</p>
        <Button variant="ghost" size="sm" onClick={load}>
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Refresh
        </Button>
      </div>

      {acceptError ? (
        <div className="mt-4">
          <Alert variant="error">{acceptError}</Alert>
        </div>
      ) : null}

      <div className="mt-4">
        {state.loading ? (
          <LoadingState label="Loading available jobs…" />
        ) : state.error ? (
          <Alert variant="error">{state.error}</Alert>
        ) : state.items.length ? (
          <>
            <div className="space-y-3">
              {state.items.map((job) => (
                <RiderJobCard
                  key={job.id}
                  job={job}
                  canAccept={canAccept}
                  accepting={acceptingId === job.id}
                  onAccept={accept}
                />
              ))}
            </div>
            <Pagination meta={state.meta} onPage={setPage} />
          </>
        ) : (
          <EmptyState
            icon={PackageOpen}
            title="No open jobs right now"
            description="New confirmed deliveries will appear here. Check back soon."
          />
        )}
      </div>
    </div>
  );
}
