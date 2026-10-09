import { AlertCircle, CheckCircle2, Info, TriangleAlert } from 'lucide-react';

const VARIANTS = {
  info: {
    wrap: 'border-info/25 bg-info-bg text-info',
    Icon: Info,
  },
  success: {
    wrap: 'border-delivered/25 bg-delivered-bg text-delivered',
    Icon: CheckCircle2,
  },
  warning: {
    wrap: 'border-solar/40 bg-solar-tint text-solar-ink',
    Icon: TriangleAlert,
  },
  error: {
    wrap: 'border-failed/25 bg-failed-bg text-failed',
    Icon: AlertCircle,
  },
};

/**
 * Inline feedback banner. `variant` controls colour + icon; error/warning use
 * assertive roles so screen readers announce them promptly.
 */
export default function Alert({ variant = 'info', title, children, className = '' }) {
  const { wrap, Icon } = VARIANTS[variant] || VARIANTS.info;
  const role = variant === 'error' || variant === 'warning' ? 'alert' : 'status';

  return (
    <div
      role={role}
      className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${wrap} ${className}`}
    >
      <Icon className="mt-0.5 h-4.5 w-4.5 shrink-0" aria-hidden="true" />
      <div className="leading-relaxed">
        {title ? <p className="font-bold">{title}</p> : null}
        {children ? <div className={title ? 'mt-0.5' : ''}>{children}</div> : null}
      </div>
    </div>
  );
}
