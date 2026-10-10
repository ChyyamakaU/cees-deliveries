'use client';

import { useEffect, useState } from 'react';
import { Package, PackageCheck, Truck, Users, Bike, Wallet } from 'lucide-react';
import { getAdminDashboard } from '@/lib/api';
import StatCard from '@/components/dashboard/StatCard';
import StatusBadge, { statusLabel } from '@/components/ui/StatusBadge';
import Alert from '@/components/ui/Alert';
import { LoadingState } from '@/components/ui/Skeleton';
import { formatMoney } from '@/lib/format';

const DELIVERY_ORDER = [
  'PENDING',
  'CONFIRMED',
  'ASSIGNED',
  'PICKED_UP',
  'IN_TRANSIT',
  'DELIVERED',
  'CANCELLED',
];

function Panel({ title, children }) {
  return (
    <section className="rounded-2xl border border-ink/10 bg-white p-5">
      <h2 className="font-display font-bold text-ink">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Bar({ label, value, max, tone = 'brand' }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-ink-soft">{label}</span>
        <span className="font-bold text-ink">{value}</span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-lilac">
        <div className={`h-full rounded-full ${tone}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [state, setState] = useState({ loading: true, error: '', stats: null });

  useEffect(() => {
    let active = true;
    getAdminDashboard()
      .then((stats) => {
        if (active) setState({ loading: false, error: '', stats });
      })
      .catch((err) => {
        if (active) setState({ loading: false, error: err.message || 'Could not load stats.', stats: null });
      });
    return () => {
      active = false;
    };
  }, []);

  if (state.loading) return <LoadingState label="Loading dashboard…" />;
  if (state.error) return <Alert variant="error">{state.error}</Alert>;
  if (!state.stats) return null;

  const { users, riders, deliveries, payments } = state.stats;
  const maxStatus = Math.max(1, ...DELIVERY_ORDER.map((s) => deliveries.byStatus[s] || 0));

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          Overview
        </h1>
        <p className="mt-1 text-ink-soft">Platform activity at a glance.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard icon={Users} label="Total users" value={users.total} tone="brand" />
        <StatCard icon={Package} label="Total deliveries" value={deliveries.total} tone="transit" />
        <StatCard icon={Truck} label="Active deliveries" value={deliveries.active} tone="solar" />
        <StatCard
          icon={Bike}
          label="Verified riders"
          value={`${riders.verified}/${riders.total}`}
          tone="delivered"
        />
        <StatCard
          icon={PackageCheck}
          label="Completed payments"
          value={payments.successfulCount}
          tone="brand"
        />
        <StatCard
          icon={Wallet}
          label="Revenue"
          value={formatMoney(payments.totalRevenue)}
          tone="delivered"
        />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Panel title="Deliveries by status">
          <div className="space-y-4">
            {DELIVERY_ORDER.map((status) => (
              <Bar
                key={status}
                label={statusLabel(status)}
                value={deliveries.byStatus[status] || 0}
                max={maxStatus}
                tone="bg-brand"
              />
            ))}
          </div>
        </Panel>

        <div className="space-y-5">
          <Panel title="Users by role">
            <div className="space-y-4">
              <Bar label="Customers" value={users.byRole.customers} max={users.total || 1} tone="bg-brand" />
              <Bar label="Riders" value={users.byRole.riders} max={users.total || 1} tone="bg-coral" />
              <Bar label="Admins" value={users.byRole.admins} max={users.total || 1} tone="bg-violet" />
            </div>
          </Panel>

          <Panel title="Riders by availability">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-delivered-bg px-3 py-1.5 text-sm font-bold text-delivered">
                {riders.byAvailability.available} available
              </span>
              <span className="rounded-full bg-solar-tint px-3 py-1.5 text-sm font-bold text-solar-ink">
                {riders.byAvailability.busy} busy
              </span>
              <span className="rounded-full bg-lilac px-3 py-1.5 text-sm font-bold text-ink-soft">
                {riders.byAvailability.offline} offline
              </span>
            </div>
          </Panel>

          <Panel title="Payments">
            <div className="flex flex-wrap gap-2">
              {Object.keys(payments.byStatus).length ? (
                Object.entries(payments.byStatus).map(([status, count]) => (
                  <span key={status} className="flex items-center gap-2 text-sm">
                    <StatusBadge
                      tone={
                        status === 'SUCCESSFUL'
                          ? 'delivered'
                          : status === 'PENDING'
                            ? 'pending'
                            : status === 'REFUNDED'
                              ? 'info'
                              : 'failed'
                      }
                    >
                      {status}
                    </StatusBadge>
                    <span className="font-bold text-ink">{count}</span>
                  </span>
                ))
              ) : (
                <p className="text-sm text-ink-soft">No payments recorded.</p>
              )}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
