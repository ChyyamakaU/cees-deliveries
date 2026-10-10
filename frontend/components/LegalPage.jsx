export default function LegalPage({ title, updated, intro, sections }) {
  return (
    <main>
      <section className="bg-lilac/50">
        <div className="mx-auto max-w-3xl px-[55px] py-16 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand">
            Legal
          </p>
          <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 text-ink-soft">{intro}</p>
          <p className="mt-2 text-sm text-ink-soft/80">Last updated {updated}</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-[55px] pb-20">
        <div className="rounded-2xl border border-coral/25 bg-coral-tint p-5 text-sm text-solar-ink">
          <strong className="font-semibold">Placeholder content.</strong> This page is a
          stand-in created for the Cee&apos;s Deliveries demo build. It is not legal advice
          and must be replaced with reviewed copy before launch.
        </div>

        <div className="mt-10 space-y-9">
          {sections.map((section) => (
            <div key={section.heading}>
              <h2 className="font-display text-xl font-bold text-ink">{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="mt-3 leading-relaxed text-ink-soft">
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
