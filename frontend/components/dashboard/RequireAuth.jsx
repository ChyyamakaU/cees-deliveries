'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldX } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { LoadingState } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';

export default function RequireAuth({ children, roles }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace('/login?redirect=/dashboard');
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="mx-auto max-w-3xl px-[55px] py-24">
        <LoadingState label="Loading your account…" />
      </div>
    );
  }

  if (roles && !roles.includes(user.role)) {
    return (
      <div className="mx-auto max-w-3xl px-[55px] py-24">
        <EmptyState
          icon={ShieldX}
          title="You don’t have access to this area"
          description="This section is only available to certain account types. Head back to your dashboard to continue."
          action={<Button href="/dashboard">Back to dashboard</Button>}
        />
      </div>
    );
  }

  return children;
}
