'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, Package, PackageCheck, Truck, XCircle, Bike, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { listDeliveries } from '@/lib/api';
import StatCard from './StatCard';
import DeliveryCard from './DeliveryCard';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import EmptyState from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/Skeleton';

function CustomerOverview({ user }) {
  const [state, setState] = useState({ loading: true, error: '', stats: null, recent: [] });

  useEffect(() => {
    let active = true;
    Promise.all([
      listDeliveries({ page: 1, limit: 1 }),
      listDeliveries({ status: 'DELIVERED', page: 1, limit: 1 }),
      listDeliveries({ status: 'CANCELLED', page: 1, limit: 1 }),
      listDeliveries({ page: 1, limit: 5 }),
    ])
      .then(([total, delivered, cancelled, recent]) => {
        if (!active) return;
        const t = total.meta?.total ?? 0;
        const d = delivered.meta?.total ?? 0;
        const c = cancelled.meta?.total ?? 0;
        setState({
          loading: false,
          error: '',
          stats: { total: t, delivered: d, cancelled: c, active: Math.max(t - d - c, 0) },
          recent: recent.data,
        });
      })
      .catch((err) => {
        if (active) setState({ loading: false, error: err.message || 'Could not load your dashboard.', stats: null, recent: [] });
      });
    return () => {
      active = false;
    };
  }, []);

  if (state.loading) return <LoadingState label="Loading your deliveries…" />;

  return (
    <div className="space-y-8">
      {state.error ? <Alert variant="error">{state.error}</Alert> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Package} label="Total deliveries" value={state.stats?.total ?? 0} tone="brand" />
        <StatCard icon={Truck} label="Active" value={state.stats?.active ?? 0} tone="transit" />
        <StatCard icon={PackageCheck} label="Delivered" value={state.stats?.delivered ?? 0} tone="delivered" />
        <StatCard icon={XCircle} label="Cancelled" value={state.stats?.cancelled ?? 0} tone="failed" />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-ink">Recent deliveries</h2>
          <Button href="/dashboard/deliveries" variant="ghost" size="sm">
            View all
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>

        {state.recent.length ? (
          <div className="mt-4 space-y-3">
            {state.recent.map((delivery) => (
              <DeliveryCard key={delivery.id} delivery={delivery} />
            ))}
          </div>
        ) : (
          <div className="mt-4">
            <EmptyState
              icon={Package}
              title="No deliveries yet"
              description={`Welcome, ${user.firstName}. Book your first delivery and it will show up here.`}
              action={<Button href="/book">Book a delivery</Button>}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function RoleConsoleCard({ user }) {
  const isRider = user.role === 'RIDER';
  return (
    <div className="rounded-3xl border border-ink/10 bg-white p-8 text-center">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand text-white shadow-lg shadow-brand/25">
        {isRider ? <Bike className="h-6 w-6" /> : <ShieldCheck className="h-6 w-6" />}
      </span>
      <h2 className="mt-5 font-display text-xl font-bold text-ink">
        {isRider ? 'Rider hub' : 'Admin console'}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-ink-soft">
        {isRider
          ? 'Manage your availability, browse available jobs and update deliveries you are carrying.'
          : 'Review platform stats, manage riders and oversee every delivery in one place.'}
      </p>
      <div className="mt-6 flex justify-center">
        <Button href={isRider ? '/rider' : '/admin'} size="lg">
          Open {isRider ? 'rider hub' : 'admin console'}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}

export default function DashboardOverview() {
  const { user } = useAuth();

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          Hello, {user.firstName}
        </h1>
        <p className="mt-1 text-ink-soft">
          {user.role === 'CUSTOMER'
            ? 'Here is a snapshot of your deliveries.'
            : `Signed in as ${user.role.toLowerCase()}.`}
        </p>
      </header>

      {user.role === 'CUSTOMER' ? <CustomerOverview user={user} /> : <RoleConsoleCard user={user} />}
    </div>
  );
}
