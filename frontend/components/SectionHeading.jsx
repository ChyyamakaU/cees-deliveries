export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  light = false,
  className = '',
}) {
  const alignment = align === 'left' ? 'items-start text-left' : 'items-center text-center';

  return (
    <div className={`flex flex-col ${alignment} ${className}`}>
      {eyebrow ? (
        <span
          className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] ${
            light ? 'bg-white/15 text-white' : 'bg-lilac text-brand'
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${light ? 'bg-solar' : 'bg-coral'}`} />
          {eyebrow}
        </span>
      ) : null}

      {title ? (
        <h2
          className={`mt-5 font-display text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-4xl lg:text-[2.75rem] ${
            light ? 'text-white' : 'text-ink'
          }`}
        >
          {title}
        </h2>
      ) : null}

      {subtitle ? (
        <p
          className={`mt-4 max-w-2xl text-base leading-relaxed sm:text-lg ${
            light ? 'text-white/80' : 'text-ink-soft'
          }`}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
