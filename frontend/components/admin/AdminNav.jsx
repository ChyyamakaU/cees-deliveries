'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Bike, Users } from 'lucide-react';

const LINKS = [
  { key: 'overview', label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { key: 'deliveries', label: 'Deliveries', href: '/admin/deliveries', icon: Package },
  { key: 'riders', label: 'Riders', href: '/admin/riders', icon: Bike },
  { key: 'users', label: 'Users', href: '/admin/users', icon: Users },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin" className="lg:sticky lg:top-24">
      <ul className="flex gap-1 overflow-x-auto lg:flex-col">
        {LINKS.map(({ key, label, href, icon: Icon }) => {
          const active = pathname === href || (href !== '/admin' && pathname.startsWith(href));
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
