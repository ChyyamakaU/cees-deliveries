'use client';

import { useCallback, useEffect, useState } from 'react';
import { BadgeCheck, Bike, Search } from 'lucide-react';
import { listAdminRiders, verifyRider } from '@/lib/api';
import { titleCase } from '@/lib/format';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import EmptyState from '@/components/ui/EmptyState';
import Pagination from '@/components/ui/Pagination';
import { LoadingState } from '@/components/ui/Skeleton';

const LIMIT = 10;

const AVAILABILITY_TONE = {
  AVAILABLE: 'bg-delivered-bg text-delivered',
  BUSY: 'bg-solar-tint text-solar-ink',
  OFFLINE: 'bg-lilac text-ink-soft',
};

const VERIFY_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'true', label: 'Verified' },
  { value: 'false', label: 'Pending' },
];

export default function AdminRiders() {
  const [filter, setFilter] = useState('all');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [state, setState] = useState({ loading: true, error: '', items: [], meta: null });
  const [busyId, setBusyId] = useState(null);
  const [notice, setNotice] = useState('');

  const load = useCallback(() => {
    let active = true;
    setState((s) => ({ ...s, loading: true, error: '' }));
    listAdminRiders({
      page,
      limit: LIMIT,
      search,
      isVerified: filter === 'all' ? undefined : filter === 'true',
    })
      .then((res) => {
        if (active) setState({ loading: false, error: '', items: res.data, meta: res.meta });
      })
      .catch((err) => {
        if (active) setState({ loading: false, error: err.message || 'Could not load riders.', items: [], meta: null });
      });
    return () => {
      active = false;
    };
  }, [filter, search, page]);

  useEffect(() => load(), [load]);

  const toggleVerify = async (rider) => {
    setBusyId(rider.userId);
    setNotice('');
    try {
      const updated = await verifyRider(rider.userId, !rider.isVerified);
      setState((s) => ({
        ...s,
        items: s.items.map((item) => (item.userId === updated.userId ? updated : item)),
      }));
      setNotice(
        `${updated.user?.firstName || 'Rider'} is now ${updated.isVerified ? 'verified' : 'unverified'}.`
      );
      setTimeout(() => setNotice(''), 4000);
    } catch (err) {
      setNotice(err.message || 'Could not update verification.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          Riders
        </h1>
        <p className="mt-1 text-ink-soft">Verify riders so they can take jobs.</p>
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSearch(searchInput.trim());
          setPage(1);
        }}
        className="flex gap-2"
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" aria-hidden="true" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search riders by name or email"
            aria-label="Search riders"
            className="h-11 w-full rounded-2xl border border-ink/12 bg-white pl-10 pr-4 text-sm text-ink shadow-sm outline-none transition-colors placeholder:text-ink-soft/50 focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>
        <Button type="submit" variant="secondary">
          Search
        </Button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {VERIFY_FILTERS.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => {
              setFilter(item.value);
              setPage(1);
            }}
            aria-pressed={filter === item.value}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              filter === item.value
                ? 'bg-coral text-white'
                : 'border border-ink/12 bg-white text-ink-soft hover:border-coral/40 hover:text-coral'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {notice ? (
        <div className="mt-4">
          <Alert variant="info">{notice}</Alert>
        </div>
      ) : null}

      <div className="mt-5">
        {state.loading ? (
          <LoadingState label="Loading riders…" />
        ) : state.error ? (
          <Alert variant="error">{state.error}</Alert>
        ) : state.items.length ? (
          <>
            <div className="space-y-3">
              {state.items.map((rider) => (
                <article
                  key={rider.userId}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-ink/10 bg-white p-5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand text-sm font-bold text-white">
                      {rider.user?.firstName?.[0]}
                      {rider.user?.lastName?.[0]}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-semibold text-ink">
                          {rider.user?.firstName} {rider.user?.lastName}
                        </p>
                        {rider.isVerified ? (
                          <BadgeCheck className="h-4 w-4 shrink-0 text-brand" aria-label="Verified" />
                        ) : null}
                      </div>
                      <p className="truncate text-sm text-ink-soft">{rider.user?.email}</p>
                      <p className="mt-1 flex items-center gap-2 text-xs text-ink-soft">
                        <span className="inline-flex items-center gap-1">
                          <Bike className="h-3.5 w-3.5" aria-hidden="true" />
                          {titleCase(rider.vehicleType)}
                          {rider.vehiclePlateNumber ? ` · ${rider.vehiclePlateNumber}` : ''}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 font-bold uppercase tracking-wide ${
                            AVAILABILITY_TONE[rider.availability] || 'bg-lilac text-ink-soft'
                          }`}
                        >
                          {rider.availability}
                        </span>
                      </p>
                    </div>
                  </div>

                  <Button
                    variant={rider.isVerified ? 'secondary' : 'primary'}
                    size="sm"
                    loading={busyId === rider.userId}
                    onClick={() => toggleVerify(rider)}
                  >
                    {rider.isVerified ? 'Unverify' : 'Verify rider'}
                  </Button>
                </article>
              ))}
            </div>
            <Pagination meta={state.meta} onPage={setPage} />
          </>
        ) : (
          <EmptyState
            icon={Bike}
            title="No riders found"
            description={search || filter !== 'all' ? 'Try clearing your filters.' : 'No riders have signed up yet.'}
          />
        )}
      </div>
    </div>
  );
}
