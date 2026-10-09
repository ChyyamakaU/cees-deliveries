'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import FormField from '@/components/ui/FormField';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { useAuth } from '@/context/AuthContext';

function extractFieldErrors(error) {
  if (!error) return {};
  if (error.errors && typeof error.errors === 'object') {
    return error.errors;
  }
  return {};
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { login } = useAuth();
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [general, setGeneral] = useState('');
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const redirect = params.get('redirect') || '/#services';

  const handleChange = (field) => (event) => {
    setValues((v) => ({ ...v, [field]: event.target.value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!values.email.trim()) next.email = 'A valid email is required';
    else if (!isEmail(values.email.trim())) next.email = 'A valid email is required';
    if (!values.password) next.password = 'Password is required';
    return next;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validation = validate();
    if (Object.keys(validation).length) {
      setErrors(validation);
      return;
    }

    setLoading(true);
    setGeneral('');
    try {
      await login({
        email: values.email.trim(),
        password: values.password,
      });
      router.push(redirect);
    } catch (err) {
      const fieldErrors = extractFieldErrors(err);
      if (Object.keys(fieldErrors).length) {
        setErrors(fieldErrors);
      }
      setGeneral(err?.message || 'Unable to log in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grid-soft opacity-60" />
      <div className="relative mx-auto max-w-md px-4 py-16 sm:px-6 sm:py-24">
        <div className="rounded-3xl border border-ink/10 bg-white/95 p-8 shadow-xl shadow-ink/5 backdrop-blur-xl sm:p-10">
          <header className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand">
              Welcome back
            </p>
            <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink">
              Log in to Cee&apos;s Deliveries
            </h1>
            <p className="mt-3 text-ink-soft">Manage your bookings and track deliveries.</p>
          </header>

          {general ? (
            <Alert variant="error" className="mt-6">
              {general}
            </Alert>
          ) : null}

          <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
            <FormField
              label="Email"
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange('email')}
              error={errors.email}
              autoComplete="email"
              required
            />
            <FormField
              label="Password"
              name="password"
              type={show ? 'text' : 'password'}
              value={values.password}
              onChange={handleChange('password')}
              error={errors.password}
              autoComplete="current-password"
              required
              hint="Password must be at least 8 characters"
              endAdornment={(
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft transition-colors hover:text-brand"
                  aria-label={show ? 'Hide password' : 'Show password'}
                >
                  {show ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              )}
            />

            <div className="flex items-center justify-end">
              <Link href="/#help" className="text-sm font-semibold text-brand underline-offset-4 hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" size="lg" fullWidth loading={loading}>
              Log in
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-ink-soft">
            New to Cee&apos;s Deliveries?{' '}
            <Link href="/register" className="font-semibold text-brand underline-offset-4 hover:underline">
              Create an account
            </Link>
          </p>

          <p className="mt-6 text-center text-xs text-ink-soft/70">
            By continuing, you agree to our{' '}
            <Link href="/terms" className="underline-offset-4 hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline-offset-4 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
