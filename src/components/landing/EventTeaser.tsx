import Image from 'next/image';
import Link from 'next/link';
import EventAmbience from '@/components/effects/EventAmbience';
import EmailCapture from '@/components/marketing/EmailCapture';
import FlipCountdown from '@/components/ui/FlipCountdown';
import { BRAND } from '@/config/brand';
import type { EventConfig } from '@/types';

/** Avant l’ouverture : ambiance de l’événement, compte à rebours et liste d’attente */
export default function EventTeaser({ config }: { config: EventConfig }) {
  const fr = config.market === 'fr';
  return (
    <main className="relative isolate flex min-h-dvh items-center overflow-hidden">
      <Image src={config.hero.image.src} alt={config.hero.image.alt} fill priority sizes="100vw" className="-z-20 object-cover opacity-40" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ev-bg via-ev-bg/85 to-ev-bg/40" />
      <div className="-z-10">
        <EventAmbience event={config.event} />
      </div>
      <div className="mx-auto w-full max-w-3xl px-4 py-16 text-center sm:px-6">
        <Link href="/" className="font-display text-xl">
          {BRAND.name}
        </Link>
        <p className="mt-12 text-sm font-medium text-ev-highlight">{config.hero.badge}</p>
        <h1 className="hero-title display-title mt-3 font-display text-[clamp(2.4rem,6vw,4.5rem)] leading-[0.98]">{config.hero.title}</h1>
        <div className="mt-10 flex justify-center">
          <FlipCountdown target={config.schedule.start} label={fr ? 'Ouverture dans' : 'Opens in'} />
        </div>
        <p className="mx-auto mt-10 max-w-prose text-ev-muted">
          {fr ? 'Inscrivez-vous pour être prévenu à l’ouverture et accéder aux offres avant tout le monde.' : 'Sign up to be notified when it opens and get first access to the deals.'}
        </p>
        <div className="mt-5 flex justify-center text-left">
          <EmailCapture source="teaser" eventId={config.id} cta={fr ? 'Me prévenir' : 'Notify me'} />
        </div>
      </div>
    </main>
  );
}
