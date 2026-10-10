'use client';

import { useCallback, useEffect, useState } from 'react';
import { PackageSearch, Truck, History } from 'lucide-react';
import { getRiderProfile } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import AvailabilityControl from './AvailabilityControl';
import RiderProfileCard from './RiderProfileCard';
import JobsPanel from './JobsPanel';
import RiderDeliveriesPanel from './RiderDeliveriesPanel';
import Alert from '@/components/ui/Alert';
import { LoadingState } from '@/components/ui/Skeleton';

const TABS = [
  { key: 'jobs', label: 'Available jobs', icon: PackageSearch },
  { key: 'deliveries', label: 'My deliveries', icon: Truck },
  { key: 'history', label: 'History', icon: History },
];

export default function RiderHub() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('jobs');
  const [reloadKey, setReloadKey] = useState(0);

  const loadProfile = useCallback(() => {
    let active = true;
    setLoading(true);
    getRiderProfile()
      .then((data) => {
        if (!active) return;
        setProfile(data);
        setError('');
      })
      .catch((err) => {
        if (active) setError(err.message || 'Could not load your rider profile.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => loadProfile(), [loadProfile]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl">
        <LoadingState label="Loading your rider hub…" />
      </div>
    );
  }

  if (error || !profile) {
    return <Alert variant="error">{error || 'Rider profile unavailable.'}</Alert>;
  }

  const canAccept = profile.isVerified === true && profile.availability === 'AVAILABLE';

  const onAccepted = () => {
    setReloadKey((k) => k + 1);
    loadProfile();
    setTab('deliveries');
  };

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          Rider hub
        </h1>
        <p className="mt-1 text-ink-soft">
          Welcome back, {user.firstName}. Manage your availability and deliveries.
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="space-y-5">
          <div className="rounded-2xl border border-ink/10 bg-white p-1.5">
            <div className="flex gap-1 overflow-x-auto">
              {TABS.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTab(key)}
                  aria-pressed={tab === key}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                    tab === key ? 'bg-coral text-white' : 'text-ink-soft hover:bg-coral-tint hover:text-coral'
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-ink/10 bg-white p-5">
            {tab === 'jobs' ? <JobsPanel canAccept={canAccept} onAccepted={onAccepted} /> : null}
            {tab === 'deliveries' ? <RiderDeliveriesPanel reloadKey={reloadKey} /> : null}
            {tab === 'history' ? <RiderDeliveriesPanel history /> : null}
          </div>
        </div>

        <div className="space-y-5">
          <RiderProfileCard profile={profile} />
          <AvailabilityControl profile={profile} onChange={setProfile} />
        </div>
      </div>
    </div>
  );
}
