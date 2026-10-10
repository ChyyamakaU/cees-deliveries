import { BadgeCheck, Bike, Phone, Star } from 'lucide-react';
import { titleCase } from '@/lib/format';

export default function RiderProfileCard({ profile }) {
  const user = profile.user || {};
  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'R';

  return (
    <section className="rounded-2xl border border-ink/10 bg-white p-5">
      <div className="flex items-center gap-4">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-brand text-lg font-bold text-white">
          {initials}
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="truncate font-display text-lg font-bold text-ink">
              {user.firstName} {user.lastName}
            </h2>
            {profile.isVerified ? (
              <BadgeCheck className="h-5 w-5 shrink-0 text-brand" aria-label="Verified rider" />
            ) : (
              <span className="shrink-0 rounded-full bg-solar-tint px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-solar-ink">
                Pending
              </span>
            )}
          </div>
          {user.phone ? (
            <a
              href={`tel:${user.phone}`}
              className="mt-0.5 inline-flex items-center gap-1 text-sm text-ink-soft hover:text-brand"
            >
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              {user.phone}
            </a>
          ) : null}
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Rating</dt>
          <dd className="mt-1 flex items-center gap-1 font-display text-lg font-extrabold text-ink">
            <Star className="h-4 w-4 fill-solar text-solar" aria-hidden="true" />
            {Number(profile.rating || 0).toFixed(1)}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Completed</dt>
          <dd className="mt-1 font-display text-lg font-extrabold text-ink">
            {profile.totalDeliveries ?? 0}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Vehicle</dt>
          <dd className="mt-1 flex items-center gap-1.5 font-semibold text-ink">
            <Bike className="h-4 w-4 text-ink-soft" aria-hidden="true" />
            {titleCase(profile.vehicleType)}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Plate</dt>
          <dd className="mt-1 font-semibold text-ink">{profile.vehiclePlateNumber || '—'}</dd>
        </div>
      </dl>
    </section>
  );
}
