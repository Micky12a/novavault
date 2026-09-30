'use client';

import { useEffect, useState } from 'react';
import Countdown from '@/components/ui/Countdown';
import { useMarket } from '@/components/market/MarketProvider';
import { MARKETS } from '@/config/brand';
import { t } from '@/lib/market';

/** Frise des vagues d’offres : la ligne se remplit au fil de la semaine */
export default function DealDrops({ drops }: { drops: { at: string; label: string }[] }) {
  const market = useMarket();
  const fr = market === 'fr';
  const ui = t(market);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 60000);
    return () => window.clearInterval(id);
  }, []);

  const times = drops.map((d) => new Date(d.at).getTime());
  const next = now === null ? undefined : drops.find((_, i) => times[i] > now);
  const reached = now === null ? 0 : times.filter((x) => x <= now).length;
  const fill = drops.length > 1 ? Math.max(0, (reached - 1) / (drops.length - 1)) * 100 : reached ? 100 : 0;
  const fmt = new Intl.DateTimeFormat(MARKETS[market].locale, { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit', timeZone: MARKETS[market].timezone });

  return (
    <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6">
      <div className="rounded-3xl bg-ev-surface p-6 sm:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="display-title font-display text-3xl sm:text-4xl">{fr ? 'Les vagues d’offres' : 'Deal drops'}</h2>
          {next && <Countdown target={next.at} label={ui.nextDrop} className="font-semibold text-ev-highlight" />}
        </div>
        <div className="relative mt-8">
          <div className="absolute left-0 right-0 top-3 hidden h-0.5 bg-ev-muted/25 sm:block" aria-hidden="true">
            <div className="h-full bg-ev-primary transition-[width] duration-1000" style={{ width: `${fill}%` }} />
          </div>
          <ol className="grid gap-6 sm:grid-cols-3">
          {drops.map((d, i) => {
            const live = now !== null && times[i] <= now;
            const isNext = next?.at === d.at;
            return (
              <li key={d.at} className="relative">
                <span className={`relative z-10 block size-6 rounded-full border-4 border-ev-surface ${live ? 'bg-ev-primary' : isNext ? 'live-dot bg-ev-highlight' : 'bg-ev-muted/40'}`} aria-hidden="true" />
                <p className="mt-3 font-semibold">{d.label}</p>
                <p className="mt-1 text-sm capitalize text-ev-muted">{fmt.format(new Date(d.at))}</p>
                {live && <p className="mt-1 text-sm font-semibold text-ev-highlight">{fr ? 'En ligne' : 'Live now'}</p>}
              </li>
            );
          })}
          </ol>
        </div>
      </div>
    </section>
  );
}
