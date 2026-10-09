'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, ChevronDown, LogOut, Menu, User, X } from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '@/context/AuthContext';

const NAV_LINKS = [
  { label: 'Home', href: '/#home' },
  { label: 'Services', href: '/#services' },
  { label: 'Track Delivery', href: '/#track' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Help', href: '/#help' },
];

function initials(user) {
  const first = user?.firstName?.[0] || '';
  const last = user?.lastName?.[0] || '';
  return `${first}${last}`.toUpperCase() || 'U';
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const accountRef = useRef(null);
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onPointerDown = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) setMenuOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setOpen(false);
    router.push('/');
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-ink/8 bg-vanilla/85 shadow-[0_10px_40px_-24px_rgba(33,29,53,0.4)] backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="mx-12 flex h-[72px] max-w-[100rem] items-center justify-between gap-6 px-4 sm:px-6">
        <Logo />

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="group relative rounded-full px-4 py-2 text-lg font-semibold text-ink-soft transition-colors hover:text-brand"
              >
                {link.label}
                <span className="absolute inset-x-4 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-gradient-to-r from-brand to-violet transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
          {loading ? (
            <span className="h-10 w-28 animate-pulse rounded-full bg-ink/5" aria-hidden="true" />
          ) : user ? (
            <div className="relative" ref={accountRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                className="flex items-center gap-2 rounded-full border border-ink/10 bg-white py-1.5 pl-1.5 pr-3 text-sm font-semibold text-ink shadow-sm transition-colors hover:border-brand/40"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-brand to-violet text-xs font-bold text-white">
                  {initials(user)}
                </span>
                <span className="max-w-[7rem] truncate">{user.firstName}</span>
                <ChevronDown
                  className={`h-4 w-4 text-ink-soft transition-transform ${menuOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>

              {menuOpen ? (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border border-ink/10 bg-white p-1.5 shadow-xl shadow-ink/10"
                >
                  <div className="rounded-xl bg-lilac/60 px-4 py-3">
                    <p className="truncate font-semibold text-ink">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="truncate text-sm text-ink-soft">{user.email}</p>
                    <span className="mt-2 inline-block rounded-full bg-white px-2.5 py-0.5 text-[0.7rem] font-bold uppercase tracking-wide text-brand">
                      {user.role}
                    </span>
                  </div>
                  <div className="mt-1.5 rounded-xl px-4 py-3 text-sm text-ink-soft">
                    Dashboard coming soon.
                  </div>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="mt-1 flex w-full items-center gap-2 rounded-xl px-4 py-3 text-left text-sm font-semibold text-ink transition-colors hover:bg-failed-bg hover:text-failed"
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    Log out
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-4 py-2 text-lg font-semibold text-ink transition-colors hover:text-brand"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="group inline-flex items-center gap-1.5 rounded-full bg-coral px-5 py-2.5 text-lg font-bold text-white shadow-lg shadow-coral/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-coral-dark hover:shadow-xl hover:shadow-coral/40"
              >
                Get Started
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          className="grid h-11 w-11 place-items-center rounded-2xl border border-ink/10 bg-white text-ink shadow-sm transition-colors hover:border-brand/30 hover:text-brand lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <div
        className={`overflow-hidden border-ink/8 bg-vanilla/95 backdrop-blur-xl transition-[max-height,opacity] duration-300 ease-out lg:hidden ${
          open ? 'max-h-[34rem] border-t opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="mx-auto max-w-[100rem] space-y-1 px-4 py-4 sm:px-6">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-2xl px-4 py-3 text-base font-semibold text-ink transition-colors hover:bg-lilac hover:text-brand"
              >
                {link.label}
              </Link>
            </li>
          ))}

          <li className="pt-3">
            {user ? (
              <div className="space-y-3 rounded-2xl bg-white p-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-brand to-violet text-sm font-bold text-white">
                    {initials(user)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-ink">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="truncate text-sm text-ink-soft">{user.email}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-ink px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-brand"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  Log out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-full border border-ink/12 px-4 py-3 text-center font-semibold text-ink transition-colors hover:border-brand/40 hover:text-brand"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-full bg-coral px-4 py-3 text-center font-bold text-white shadow-lg shadow-coral/30"
                >
                  Get Started
                </Link>
              </div>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
}
