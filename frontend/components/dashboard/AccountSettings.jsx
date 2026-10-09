'use client';

import { useState } from 'react';
import { User, KeyRound } from 'lucide-react';
import { changePassword, updateProfile } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import FormField from '@/components/ui/FormField';

function fieldErrors(err) {
  return err?.errors || {};
}

function ProfileCard() {
  const { user, refresh } = useAuth();
  const [form, setForm] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    phone: user.phone || '',
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ saving: false, success: '', error: '' });

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (event) => {
    event.preventDefault();
    setStatus({ saving: true, success: '', error: '' });
    setErrors({});
    try {
      await updateProfile(form);
      await refresh();
      setStatus({ saving: false, success: 'Profile updated.', error: '' });
    } catch (err) {
      setErrors(fieldErrors(err));
      setStatus({ saving: false, success: '', error: err.message || 'Could not update your profile.' });
    }
  };

  return (
    <section className="rounded-2xl border border-ink/10 bg-white p-6">
      <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
        <User className="h-5 w-5 text-brand" aria-hidden="true" />
        Profile
      </h2>
      <p className="mt-1 text-sm text-ink-soft">Update how we reach you about your deliveries.</p>

      <form onSubmit={onSubmit} className="mt-5 space-y-4">
        {status.success ? <Alert variant="success">{status.success}</Alert> : null}
        {status.error ? <Alert variant="error">{status.error}</Alert> : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="First name"
            name="firstName"
            value={form.firstName}
            onChange={onChange}
            error={errors.firstName}
            required
          />
          <FormField
            label="Last name"
            name="lastName"
            value={form.lastName}
            onChange={onChange}
            error={errors.lastName}
            required
          />
        </div>
        <FormField
          label="Phone number"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={onChange}
          error={errors.phone}
          hint="Used by riders to coordinate pickup and drop-off."
        />
        <FormField label="Email" value={user.email} disabled hint="Email changes are coming soon." />

        <Button type="submit" loading={status.saving}>
          Save changes
        </Button>
      </form>
    </section>
  );
}

function PasswordCard() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ saving: false, success: '', error: '' });

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    if (form.newPassword !== form.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match.' });
      return;
    }
    setStatus({ saving: true, success: '', error: '' });
    try {
      await changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setStatus({ saving: false, success: 'Password changed.', error: '' });
    } catch (err) {
      setErrors(fieldErrors(err));
      setStatus({ saving: false, success: '', error: err.message || 'Could not change your password.' });
    }
  };

  return (
    <section className="rounded-2xl border border-ink/10 bg-white p-6">
      <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
        <KeyRound className="h-5 w-5 text-brand" aria-hidden="true" />
        Password
      </h2>
      <p className="mt-1 text-sm text-ink-soft">Choose a strong password you don’t use elsewhere.</p>

      <form onSubmit={onSubmit} className="mt-5 space-y-4">
        {status.success ? <Alert variant="success">{status.success}</Alert> : null}
        {status.error ? <Alert variant="error">{status.error}</Alert> : null}

        <FormField
          label="Current password"
          name="currentPassword"
          type="password"
          value={form.currentPassword}
          onChange={onChange}
          error={errors.currentPassword}
          required
        />
        <FormField
          label="New password"
          name="newPassword"
          type="password"
          value={form.newPassword}
          onChange={onChange}
          error={errors.newPassword}
          required
        />
        <FormField
          label="Confirm new password"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={onChange}
          error={errors.confirmPassword}
          required
        />

        <Button type="submit" loading={status.saving}>
          Change password
        </Button>
      </form>
    </section>
  );
}

export default function AccountSettings() {
  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          Settings
        </h1>
        <p className="mt-1 text-ink-soft">Manage your profile and security.</p>
      </header>

      <div className="space-y-6">
        <ProfileCard />
        <PasswordCard />
      </div>
    </div>
  );
}
