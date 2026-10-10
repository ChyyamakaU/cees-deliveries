'use client';

import { useCallback, useEffect, useState } from 'react';
import { Search, Users } from 'lucide-react';
import { listAdminUsers, updateUserStatus } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import StatusBadge from '@/components/ui/StatusBadge';
import Alert from '@/components/ui/Alert';
import EmptyState from '@/components/ui/EmptyState';
import Pagination from '@/components/ui/Pagination';
import { LoadingState } from '@/components/ui/Skeleton';

const LIMIT = 12;

const ROLE_TONE = { CUSTOMER: 'brand', RIDER: 'info', ADMIN: 'brand' };
const STATUS_TONE = { ACTIVE: 'delivered', INACTIVE: 'neutral', SUSPENDED: 'failed' };
const STATUS_OPTIONS = ['ACTIVE', 'INACTIVE', 'SUSPENDED'];
const ROLE_FILTERS = [
  { value: '', label: 'All roles' },
  { value: 'CUSTOMER', label: 'Customers' },
  { value: 'RIDER', label: 'Riders' },
  { value: 'ADMIN', label: 'Admins' },
];

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [state, setState] = useState({ loading: true, error: '', items: [], meta: null });
  const [busyId, setBusyId] = useState(null);
  const [notice, setNotice] = useState('');

  const load = useCallback(() => {
    let active = true;
    setState((s) => ({ ...s, loading: true, error: '' }));
    listAdminUsers({ role, status, search, page, limit: LIMIT })
      .then((res) => {
        if (active) setState({ loading: false, error: '', items: res.data, meta: res.meta });
      })
      .catch((err) => {
        if (active) setState({ loading: false, error: err.message || 'Could not load users.', items: [], meta: null });
      });
    return () => {
      active = false;
    };
  }, [role, status, search, page]);

  useEffect(() => load(), [load]);

  const changeStatus = async (target, nextStatus) => {
    setBusyId(target.id);
    setNotice('');
    try {
      const updated = await updateUserStatus(target.id, nextStatus);
      setState((s) => ({
        ...s,
        items: s.items.map((item) => (item.id === updated.id ? { ...item, ...updated } : item)),
      }));
      setNotice(`${updated.firstName}'s status is now ${updated.status.toLowerCase()}.`);
      setTimeout(() => setNotice(''), 4000);
    } catch (err) {
      setNotice(err.message || 'Could not update status.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          Users
        </h1>
        <p className="mt-1 text-ink-soft">Everyone with an account on the platform.</p>
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
            placeholder="Search by name, email or phone"
            aria-label="Search users"
            className="h-11 w-full rounded-2xl border border-ink/12 bg-white pl-10 pr-4 text-sm text-ink shadow-sm outline-none transition-colors placeholder:text-ink-soft/50 focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>
        <button
          type="submit"
          className="h-11 rounded-full border border-ink/12 bg-white px-5 text-sm font-semibold text-ink transition-colors hover:border-coral/40 hover:text-coral"
        >
          Search
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {ROLE_FILTERS.map((item) => (
          <button
            key={item.value || 'all'}
            type="button"
            onClick={() => {
              setRole(item.value);
              setPage(1);
            }}
            aria-pressed={role === item.value}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              role === item.value
                ? 'bg-coral text-white'
                : 'border border-ink/12 bg-white text-ink-soft hover:border-coral/40 hover:text-coral'
            }`}
          >
            {item.label}
          </button>
        ))}
        <span className="mx-1 hidden w-px bg-ink/10 sm:block" aria-hidden="true" />
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          aria-label="Filter by status"
          className="h-10 rounded-full border border-ink/12 bg-white px-4 text-sm font-semibold text-ink-soft outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {notice ? (
        <div className="mt-4">
          <Alert variant="info">{notice}</Alert>
        </div>
      ) : null}

      <div className="mt-5">
        {state.loading ? (
          <LoadingState label="Loading users…" />
        ) : state.error ? (
          <Alert variant="error">{state.error}</Alert>
        ) : state.items.length ? (
          <>
            <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white">
              <div className="divide-y divide-ink/8">
                {state.items.map((user) => {
                  const isSelf = user.id === currentUser?.id;
                  return (
                    <div
                      key={user.id}
                      className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-ink">
                            {user.firstName} {user.lastName}
                            {isSelf ? <span className="ml-2 text-xs text-ink-soft">(you)</span> : null}
                          </p>
                          <StatusBadge tone={ROLE_TONE[user.role] || 'brand'}>{user.role}</StatusBadge>
                        </div>
                        <p className="truncate text-sm text-ink-soft">{user.email}</p>
                        {user.phone ? <p className="text-sm text-ink-soft">{user.phone}</p> : null}
                      </div>

                      <div className="flex items-center gap-3">
                        <StatusBadge tone={STATUS_TONE[user.status] || 'neutral'}>
                          {user.status}
                        </StatusBadge>
                        <select
                          value={user.status}
                          disabled={isSelf || busyId === user.id}
                          onChange={(e) => changeStatus(user, e.target.value)}
                          aria-label={`Change status for ${user.firstName}`}
                          className="h-9 rounded-full border border-ink/12 bg-white px-3 text-sm font-semibold text-ink outline-none transition-colors hover:border-brand/40 focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <Pagination meta={state.meta} onPage={setPage} />
          </>
        ) : (
          <EmptyState
            icon={Users}
            title="No users found"
            description={search || role || status ? 'Try clearing your filters.' : 'No users yet.'}
          />
        )}
      </div>
    </div>
  );
}
