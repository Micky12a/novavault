import { ShieldCheck, Star } from 'lucide-react';

/** Bloc 3 : garanties toujours, note moyenne seulement à partir de 5 avis vérifiés */
export default function TrustBanner({ rating, guarantees, lang }: { rating: { value: number; count: number } | null; guarantees: string[]; lang: 'fr' | 'en' }) {
  const fr = lang === 'fr';
  return (
    <section aria-label={fr ? 'Nos garanties' : 'Our guarantees'} className="border-b border-ev-muted/10">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-4 py-5 text-sm sm:px-6">
        {rating && (
          <p className="flex items-center gap-1.5 font-semibold">
            <span className="flex text-ev-highlight" aria-hidden="true">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} size={15} className={i < Math.round(rating.value) ? 'fill-current' : 'opacity-30'} />
              ))}
            </span>
            {rating.value.toLocaleString(fr ? 'fr-FR' : 'en-US')}/5
            <span className="font-normal text-ev-muted">
              ({rating.count} {fr ? 'avis vérifiés' : 'verified reviews'})
            </span>
          </p>
        )}
        {guarantees.map((g) => (
          <p key={g} className="flex items-center gap-2">
            <ShieldCheck size={17} aria-hidden="true" className="text-ev-highlight" />
            {g}
          </p>
        ))}
      </div>
    </section>
  );
}
