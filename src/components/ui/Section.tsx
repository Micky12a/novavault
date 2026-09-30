import type { ReactNode } from 'react';

export default function Section({
  id,
  title,
  intro,
  aside,
  children,
  className = '',
}: {
  id?: string;
  title?: string;
  intro?: string;
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`mx-auto w-full max-w-7xl scroll-mt-32 px-4 py-14 sm:px-6 sm:py-20 ${className}`}>
      {(title || intro || aside) && (
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
          <div>
            {title && <h2 className="display-title max-w-3xl font-display text-3xl leading-[1.05] sm:text-5xl">{title}</h2>}
            {intro && <p className="mt-3 max-w-prose text-ev-muted sm:text-lg">{intro}</p>}
          </div>
          {aside}
        </div>
      )}
      {children}
    </section>
  );
}
