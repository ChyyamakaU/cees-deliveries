import Link from 'next/link';
import Spinner from './Spinner';

const VARIANTS = {
  primary: 'bg-brand text-white shadow-lg shadow-brand/25 hover:bg-brand-dark hover:shadow-brand/35',
  accent: 'bg-coral text-white shadow-lg shadow-coral/25 hover:bg-coral-dark hover:shadow-coral/35',
  secondary: 'border border-ink/12 bg-white text-ink hover:border-brand/40 hover:text-brand',
  subtle: 'bg-lilac text-brand hover:bg-brand hover:text-white',
  ghost: 'text-ink hover:bg-lilac hover:text-brand',
  dark: 'bg-ink text-white hover:bg-brand',
  danger: 'bg-failed-bg text-failed hover:bg-failed hover:text-white',
};

const SIZES = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
};

/**
 * Single call-to-action component for the whole app. Renders a Next.js Link
 * when `href` is provided, otherwise a native button. Coral/purple variants are
 * reserved for primary actions; loading and disabled states are visually distinct.
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  type = 'button',
  loading = false,
  disabled = false,
  fullWidth = false,
  className = '',
  ...props
}) {
  const isDisabled = disabled || loading;

  const classes = [
    'inline-flex items-center justify-center gap-2 rounded-full font-bold',
    'transition-all duration-200 focus-visible:outline-none focus-visible:ring-2',
    'focus-visible:ring-brand/50 focus-visible:ring-offset-2 focus-visible:ring-offset-vanilla',
    'disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none disabled:hover:translate-y-0',
    VARIANTS[variant] || VARIANTS.primary,
    SIZES[size] || SIZES.md,
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {loading ? <Spinner className="h-4 w-4" /> : null}
      {children}
    </>
  );

  if (href && !isDisabled) {
    return (
      <Link href={href} className={classes} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} disabled={isDisabled} aria-busy={loading} {...props}>
      {content}
    </button>
  );
}
