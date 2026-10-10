'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import FormField from '@/components/ui/FormField';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { useAuth } from '@/context/AuthContext';

const ROLES = [
  { value: 'CUSTOMER', label: 'Customer' },
  { value: 'RIDER', label: 'Rider' },
];

const VEHICLE = [
  { value: '', label: 'Select vehicle type (riders)' },
  { value: 'BIKE', label: 'Bike' },
  { value: 'CAR', label: 'Car' },
  { value: 'VAN', label: 'Van' },
  { value: 'TRUCK', label: 'Truck' },
  { value: 'OTHER', label: 'Other' },
];

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function extractFieldErrors(error) {
  if (!error) return {};
  if (error.errors && typeof error.errors === 'object') return error.errors;
  return {};
}

export default function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { register } = useAuth();
  const redirect = params.get('redirect') || '/#services';
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: params.get('role') === 'RIDER' ? 'RIDER' : 'CUSTOMER',
    vehicleType: '',
    licenseNumber: '',
    vehiclePlateNumber: '',
  });
  const [errors, setErrors] = useState({});
  const [general, setGeneral] = useState('');
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const isRider = values.role === 'RIDER';

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!values.firstName.trim()) next.firstName = 'First name is required';
    if (!values.lastName.trim()) next.lastName = 'Last name is required';
    if (!values.email.trim() || !isEmail(values.email.trim())) next.email = 'A valid email is required';
    if (!values.phone.trim()) next.phone = 'Phone number is required';
    else if (values.phone.trim().length < 7 || values.phone.trim().length > 30) next.phone = 'Phone number looks invalid';
    if (!values.password) next.password = 'Password must be at least 8 characters';
    else if (values.password.length < 8) next.password = 'Password must be at least 8 characters';
    if (!values.confirmPassword) next.confirmPassword = 'Please confirm your password';
    else if (values.confirmPassword !== values.password) next.confirmPassword = 'Passwords do not match';

    if (isRider) {
      if (!values.vehicleType) next.vehicleType = 'Select your vehicle type';
      if (!values.licenseNumber.trim()) next.licenseNumber = 'License number is required';
      if (!values.vehiclePlateNumber.trim()) next.vehiclePlateNumber = 'Vehicle plate number is required';
    }

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
      const payload = {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        password: values.password,
        role: values.role,
      };
      if (isRider) {
        payload.vehicleType = values.vehicleType;
        payload.licenseNumber = values.licenseNumber.trim();
        payload.vehiclePlateNumber = values.vehiclePlateNumber.trim();
      }
      await register(payload);
      router.push(redirect);
    } catch (err) {
      const fieldErrors = extractFieldErrors(err);
      if (Object.keys(fieldErrors).length) {
        setErrors(fieldErrors);
      }
      setGeneral(err?.message || 'Unable to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grid-soft opacity-60" />
      <div className="relative mx-auto max-w-2xl px-[55px] py-16 sm:py-24">
        <div className="rounded-3xl border border-ink/10 bg-white/95 p-8 shadow-xl shadow-ink/5 backdrop-blur-xl sm:p-10">
          <header className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand">
              Get started
            </p>
            <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink">
              Create your Cee&apos;s Deliveries account
            </h1>
            <p className="mt-3 text-ink-soft">Join as a customer or rider.</p>
          </header>

          {general ? (
            <Alert variant="error" className="mt-6">
              {general}
            </Alert>
          ) : null}

          <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                label="First name"
                name="firstName"
                value={values.firstName}
                onChange={handleChange('firstName')}
                error={errors.firstName}
                autoComplete="given-name"
                required
              />
              <FormField
                label="Last name"
                name="lastName"
                value={values.lastName}
                onChange={handleChange('lastName')}
                error={errors.lastName}
                autoComplete="family-name"
                required
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
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
                label="Phone number"
                name="phone"
                value={values.phone}
                onChange={handleChange('phone')}
                error={errors.phone}
                autoComplete="tel"
                required
                hint="Includes international format (e.g. +234...)"
              />
            </div>

            <FormField
              label="I want to join as"
              as="select"
              name="role"
              value={values.role}
              onChange={handleChange('role')}
              error={errors.role}
              required
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </FormField>

            {isRider ? (
              <div className="space-y-5 rounded-2xl border border-brand/15 bg-lilac/60 p-5">
                <p className="text-sm font-semibold text-brand">Rider details</p>
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    label="Vehicle type"
                    as="select"
                    name="vehicleType"
                    value={values.vehicleType}
                    onChange={handleChange('vehicleType')}
                    error={errors.vehicleType}
                    required
                  >
                    {VEHICLE.map((v) => (
                      <option key={v.value} value={v.value}>
                        {v.label}
                      </option>
                    ))}
                  </FormField>
                  <FormField
                    label="License number"
                    name="licenseNumber"
                    value={values.licenseNumber}
                    onChange={handleChange('licenseNumber')}
                    error={errors.licenseNumber}
                    required
                  />
                </div>
                <FormField
                  label="Vehicle plate number"
                  name="vehiclePlateNumber"
                  value={values.vehiclePlateNumber}
                  onChange={handleChange('vehiclePlateNumber')}
                  error={errors.vehiclePlateNumber}
                  required
                />
              </div>
            ) : null}

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                label="Password"
                name="password"
                type={show ? 'text' : 'password'}
                value={values.password}
                onChange={handleChange('password')}
                error={errors.password}
                autoComplete="new-password"
                required
                hint="At least 8 characters"
                endAdornment={(
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft transition-colors hover:text-coral"
                    aria-label={show ? 'Hide password' : 'Show password'}
                  >
                    {show ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                )}
              />
              <FormField
                label="Confirm password"
                name="confirmPassword"
                type={show ? 'text' : 'password'}
                value={values.confirmPassword}
                onChange={handleChange('confirmPassword')}
                error={errors.confirmPassword}
                autoComplete="new-password"
                required
              />
            </div>

            <Button type="submit" size="lg" fullWidth loading={loading}>
              Create account
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-ink-soft">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-brand underline-offset-4 hover:underline">
              Log in
            </Link>
          </p>

          <p className="mt-6 text-center text-xs text-ink-soft/70">
            By creating an account, you agree to our{' '}
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
