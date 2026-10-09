'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, BadgeCheck, LockKeyhole } from 'lucide-react';
import Stepper from './Stepper';
import ServiceStep from './ServiceStep';
import LocationStep from './LocationStep';
import PackageStep from './PackageStep';
import ReviewStep from './ReviewStep';
import SuccessStep from './SuccessStep';
import { STEPS, emptyBooking, toPayload, validateStep } from '@/lib/booking';
import { getService } from '@/lib/services';
import { apiRequest } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { LoadingState } from '@/components/ui/Skeleton';

function stepForField(field) {
  if (field.startsWith('pickup') || field.startsWith('dropoff') || field === 'distanceKm') return 1;
  if (field.startsWith('package') || field === 'notes' || field === 'scheduledPickupAt') return 2;
  return 0;
}

function SignInGate({ serviceKey }) {
  const query = serviceKey ? `?service=${serviceKey}` : '';
  const redirect = encodeURIComponent(`/book${query}`);
  return (
    <div className="mx-auto max-w-md rounded-3xl border border-ink/10 bg-white/95 p-8 text-center shadow-xl shadow-ink/5 sm:p-10">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand to-violet text-white shadow-lg shadow-brand/25">
        <LockKeyhole className="h-6 w-6" aria-hidden="true" />
      </span>
      <h1 className="mt-6 font-display text-2xl font-extrabold text-ink">Sign in to book</h1>
      <p className="mt-3 text-ink-soft">
        You need an account to book and track a delivery. It only takes a minute.
      </p>
      <div className="mt-7 flex flex-col gap-3">
        <Button href={`/login?redirect=${redirect}`} size="lg" fullWidth>
          Log in to continue
        </Button>
        <Button href={`/register?redirect=${redirect}`} variant="secondary" size="lg" fullWidth>
          Create an account
        </Button>
      </div>
    </div>
  );
}

export default function BookingFlow() {
  const params = useSearchParams();
  const initialService = params.get('service');
  const { user, loading } = useAuth();

  const [step, setStep] = useState(0);
  const [values, setValues] = useState(() => {
    const base = { ...emptyBooking };
    const service = getService(initialService);
    if (service) {
      base.category = service.key;
      base.packageSize = service.defaultSize;
    }
    return base;
  });
  const [errors, setErrors] = useState({});
  const [quote, setQuote] = useState(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [created, setCreated] = useState(null);

  const setField = useCallback((name, value) => {
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((e) => (e[name] ? { ...e, [name]: undefined } : e));
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step, created]);

  useEffect(() => {
    if (step !== 3 || !user) return undefined;
    let active = true;
    setQuoteLoading(true);
    setQuoteError('');
    const body = { packageSize: values.packageSize };
    if (values.distanceKm !== '') body.distanceKm = Number(values.distanceKm);

    apiRequest('/deliveries/quote', { method: 'POST', body: JSON.stringify(body) })
      .then((data) => {
        if (active) setQuote(data);
      })
      .catch((err) => {
        if (!active) return;
        setQuote(null);
        setQuoteError(
          err.code === 'NETWORK'
            ? 'We couldn\u2019t reach the pricing service. Your fee will be confirmed when the delivery is accepted.'
            : err.message || 'We couldn\u2019t calculate an estimate right now.'
        );
      })
      .finally(() => {
        if (active) setQuoteLoading(false);
      });

    return () => {
      active = false;
    };
  }, [step, user, values.packageSize, values.distanceKm]);

  const goNext = () => {
    const stepErrors = validateStep(STEPS[step].key, values);
    if (Object.keys(stepErrors).length) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const reset = () => {
    setValues({ ...emptyBooking });
    setErrors({});
    setQuote(null);
    setQuoteError('');
    setSubmitError('');
    setCreated(null);
    setStep(0);
  };

  const submit = async () => {
    setSubmitting(true);
    setSubmitError('');
    try {
      const delivery = await apiRequest('/deliveries', {
        method: 'POST',
        body: JSON.stringify(toPayload(values)),
      });
      setCreated(delivery);
    } catch (err) {
      if (err.errors && typeof err.errors === 'object') {
        setErrors(err.errors);
        const firstField = Object.keys(err.errors)[0];
        if (firstField) setStep(stepForField(firstField));
      }
      setSubmitError(err.message || 'We couldn\u2019t create your delivery. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <LoadingState label="Checking your session…" />
      </div>
    );
  }

  if (!user) {
    return (
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grid-soft opacity-60" />
        <div className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
          <SignInGate serviceKey={getService(initialService)?.key} />
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grid-soft opacity-60" />

      <div className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <header className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand">
            Book a delivery
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            {created ? 'Request received' : 'Book your delivery in a few steps'}
          </h1>
        </header>

        {created ? (
          <div className="mt-12">
            <SuccessStep delivery={created} onReset={reset} />
          </div>
        ) : (
          <>
            <div className="mt-10 rounded-2xl border border-ink/10 bg-white/80 p-4 backdrop-blur sm:p-5">
              <Stepper steps={STEPS} current={step} onStepClick={setStep} />
            </div>

            <div className="mt-8 rounded-3xl border border-ink/10 bg-vanilla/60 p-5 backdrop-blur sm:p-8">
              {step === 0 ? <ServiceStep values={values} setField={setField} errors={errors} /> : null}
              {step === 1 ? <LocationStep values={values} setField={setField} errors={errors} /> : null}
              {step === 2 ? <PackageStep values={values} setField={setField} errors={errors} /> : null}
              {step === 3 ? (
                <ReviewStep
                  values={values}
                  quote={quote}
                  quoteLoading={quoteLoading}
                  quoteError={quoteError}
                  onEdit={setStep}
                />
              ) : null}
            </div>

            {submitError ? (
              <Alert variant="error" className="mt-6">
                {submitError}
              </Alert>
            ) : null}

            <div className="mt-6 flex items-center justify-between gap-3">
              {step > 0 ? (
                <Button variant="ghost" onClick={goBack} disabled={submitting}>
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  Back
                </Button>
              ) : (
                <span />
              )}

              {step < STEPS.length - 1 ? (
                <Button onClick={goNext} size="lg">
                  Continue
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              ) : (
                <Button onClick={submit} variant="accent" size="lg" loading={submitting}>
                  <BadgeCheck className="h-4 w-4" aria-hidden="true" />
                  Confirm &amp; book
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
