'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Settings, Bike, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const ICONS = {
  overview: LayoutDashboard,
  deliveries: Package,
  jobs: Bike,
  admin: ShieldCheck,
  settings: Settings,
};

export default function DashboardNav() {
  const { user } = useAuth();
  const pathname = usePathname();

  const links = [
    { key: 'overview', label: 'Overview', href: '/dashboard' },
    { key: 'deliveries', label: 'Deliveries', href: '/dashboard/deliveries' },
  ];
  if (user?.role === 'RIDER') links.push({ key: 'jobs', label: 'Rider hub', href: '/rider' });
  if (user?.role === 'ADMIN') links.push({ key: 'admin', label: 'Admin console', href: '/admin' });
  links.push({ key: 'settings', label: 'Settings', href: '/dashboard/settings' });

  return (
    <nav aria-label="Dashboard" className="lg:sticky lg:top-24">
      <ul className="flex gap-1 overflow-x-auto lg:flex-col">
        {links.map(({ key, label, href }) => {
          const Icon = ICONS[key];
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <li key={key} className="shrink-0">
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-2.5 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-coral text-white shadow-lg shadow-coral/25'
                    : 'text-ink-soft hover:bg-coral-tint hover:text-coral'
                }`}
              >
                <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
