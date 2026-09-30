import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import EmailCapture from '@/components/marketing/EmailCapture';
import { BRAND } from '@/config/brand';
import type { EventConfig } from '@/types';

/** Après la fin : on garde l’URL et on renvoie vers l’événement suivant du même marché */
export default function EventEnded({ config, next }: { config: EventConfig; next?: EventConfig }) {
  const fr = config.market === 'fr';
  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center px-4 py-16 sm:px-6">
      <Link href="/" className="font-display text-xl">
        {BRAND.name}
      </Link>
      <h1 className="mt-12 font-display text-4xl leading-tight sm:text-5xl">{fr ? 'Cette opération est terminée' : 'This sale has ended'}</h1>
      <p className="mt-3 text-ev-muted">{config.name}</p>
      {next ? (
        <Link href={`/${next.slug}`} className="group mt-10 block rounded-3xl bg-ev-surface p-6 transition-colors hover:bg-ev-surface/70">
          <p className="text-sm text-ev-muted">{fr ? 'La suite vous attend' : 'Up next'}</p>
          <p className="mt-1 flex items-center justify-between gap-4 font-display text-2xl">
            {next.name}
            <ArrowRight className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </p>
        </Link>
      ) : (
        <>
          <p className="mt-8 text-ev-muted">{fr ? 'Inscrivez-vous pour être prévenu de la prochaine opération.' : 'Sign up to hear about our next sale first.'}</p>
          <div className="mt-4">
            <EmailCapture source="ended" eventId={config.id} />
          </div>
        </>
      )}
    </main>
  );
}
