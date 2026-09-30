import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import EventAmbience from '@/components/effects/EventAmbience';
import EmailCapture from '@/components/marketing/EmailCapture';
import EventThemeProvider from '@/components/theme/EventThemeProvider';
import Marquee from '@/components/ui/Marquee';
import Reveal from '@/components/ui/Reveal';
import { BRAND, BRAND_THEME, MARKETS } from '@/config/brand';
import { getEvents, getMarketConfig } from '@/lib/data';
import { getEventStatus } from '@/lib/events';
import type { EventConfig } from '@/types';

export const revalidate = 3600;

function dates(e: EventConfig) {
  const m = MARKETS[e.market];
  const fmt = new Intl.DateTimeFormat(m.locale, { day: 'numeric', month: 'long', timeZone: m.timezone });
  return m.lang === 'fr'
    ? `Du ${fmt.format(new Date(e.schedule.start))} au ${fmt.format(new Date(e.schedule.end))}`
    : `${fmt.format(new Date(e.schedule.start))} to ${fmt.format(new Date(e.schedule.end))}`;
}

/** Tuile aux couleurs de l’événement : l’aperçu donne envie avant même de cliquer */
function EventTile({ e, big = false }: { e: EventConfig; big?: boolean }) {
  const live = getEventStatus(e) === 'live';
  const c = e.theme.colors;
  return (
    <Link
      href={`/${e.slug}`}
      className={`group relative isolate flex flex-col justify-end overflow-hidden rounded-3xl p-5 sm:p-6 ${big ? 'min-h-[26rem] sm:col-span-2' : 'min-h-[20rem]'}`}
      style={{ background: c.bg, color: c.text }}
    >
      <Image src={e.hero.image.src} alt={e.hero.image.alt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="-z-20 object-cover opacity-60 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" />
      <div className="absolute inset-0 -z-10" style={{ background: `linear-gradient(to top, ${c.bg} 15%, transparent 75%)` }} />
      <p className="flex items-center gap-2 text-sm font-medium">
        {live && <span className="live-dot size-2 rounded-full" style={{ background: c.highlight }} aria-hidden="true" />}
        {live ? (e.market === 'us' ? 'Live now' : 'En ce moment') : dates(e)}
      </p>
      <p className={`mt-2 font-display leading-tight ${big ? 'text-4xl sm:text-5xl' : 'text-2xl'}`}>{e.name}</p>
      <span
        className="absolute right-5 top-5 grid size-11 place-items-center rounded-full transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        style={{ background: c.primary, color: c.onPrimary }}
        aria-hidden="true"
      >
        <ArrowUpRight size={20} />
      </span>
    </Link>
  );
}

/** Accueil NovaVault : opérations en cours d’abord, puis à venir. Les pages terminées disparaissent. */
export default async function Home() {
  const events = await getEvents();
  const fr = events.filter((e) => e.market === 'fr' && getEventStatus(e) !== 'ended').sort((a, b) => +new Date(a.schedule.start) - +new Date(b.schedule.start));
  const live = fr.filter((e) => getEventStatus(e) === 'live');
  const upcoming = fr.filter((e) => getEventStatus(e) === 'upcoming');
  const us = events.filter((e) => e.market === 'us' && getEventStatus(e) !== 'ended');
  const legal = (await getMarketConfig('fr')).legalLinks;

  return (
    <EventThemeProvider theme={BRAND_THEME} lang="fr" event="nouvel-an">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6">
        <p className="font-display text-2xl">{BRAND.name}</p>
      </header>

      <main>
        <section className="hero relative isolate overflow-hidden">
          <div className="-z-10 opacity-70">
            <EventAmbience event="nouvel-an" />
          </div>
          <div className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 sm:pb-24 sm:pt-20">
            <h1 className="hero-title max-w-5xl font-display text-[clamp(2.8rem,8vw,6.5rem)] leading-[0.92] tracking-tight">
              {BRAND.tagline.split(' ').map((w, i, arr) => (
                <span key={i} className="hero-word">
                  <span style={{ ['--i' as string]: i }}>{w}</span>
                  {i < arr.length - 1 && ' '}
                </span>
              ))}
            </h1>
            <p className="fade-up mt-6 max-w-xl text-lg text-ev-muted" style={{ ['--d' as string]: '900ms' }}>
              Halloween, Black Friday, Cyber Monday, Noël, Nouvel An : une boutique dédiée à chaque temps fort, avec des offres qui changent au fil de la saison.
            </p>
          </div>
        </section>

        <div className="border-y border-ev-muted/15 py-4" aria-hidden="true">
          <Marquee speed={45}>
            {['Halloween', 'Black Friday', 'Cyber Monday', 'Noël', 'Nouvel An', 'Résolutions 2027'].map((name) => (
              <span key={name} className="flex items-center whitespace-nowrap px-8 font-display text-3xl text-ev-muted sm:text-5xl">
                {name}
                <svg viewBox="0 0 12 12" className="ml-16 size-4 fill-ev-accent">
                  <path d="M6 0l1.8 4.2L12 6 7.8 7.8 6 12 4.2 7.8 0 6l4.2-1.8z" />
                </svg>
              </span>
            ))}
          </Marquee>
        </div>

        <div className="mx-auto max-w-7xl space-y-16 px-4 py-16 sm:px-6">
          {live.length > 0 && (
            <section aria-labelledby="live">
              <h2 id="live" className="font-display text-3xl sm:text-4xl">En ce moment</h2>
              <Reveal className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {live.map((e, i) => (
                  <EventTile key={e.id} e={e} big={i === 0} />
                ))}
              </Reveal>
            </section>
          )}

          {upcoming.length > 0 && (
            <section aria-labelledby="soon">
              <h2 id="soon" className="font-display text-3xl sm:text-4xl">Bientôt</h2>
              <Reveal className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {upcoming.map((e) => (
                  <EventTile key={e.id} e={e} />
                ))}
              </Reveal>
            </section>
          )}

          <section className="grid gap-6 rounded-3xl bg-ev-surface p-6 sm:p-10 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="font-display text-3xl">Ne ratez aucune ouverture</h2>
              <p className="mt-2 text-ev-muted">Un e-mail à l’ouverture de chaque opération, et l’accès VIP au Black Friday 24 h avant tout le monde.</p>
            </div>
            <EmailCapture source="hub" />
          </section>

          {us.length > 0 && (
            <section lang="en" aria-labelledby="us">
              <h2 id="us" className="font-display text-3xl sm:text-4xl">Shopping from the US?</h2>
              <Reveal className="mt-8 grid gap-4 sm:grid-cols-2">
                {us.map((e) => (
                  <EventTile key={e.id} e={e} />
                ))}
              </Reveal>
            </section>
          )}
        </div>
      </main>

      <footer className="border-t border-ev-muted/15 px-4 py-8 text-center text-sm text-ev-muted">
        <nav className="flex flex-wrap justify-center gap-5">
          {legal.map((l) => (
            <Link key={l.href} href={l.href} className="hover:underline">
              {l.label}
            </Link>
          ))}
        </nav>
        <p className="mt-4">© {new Date().getFullYear()} {BRAND.name}</p>
      </footer>
    </EventThemeProvider>
  );
}
