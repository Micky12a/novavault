import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { PageTitle } from '@/components/admin/ui';
import { MARKETS } from '@/config/brand';
import { db } from '@/lib/db';
import { getEventStatus } from '@/lib/events';
import type { EventConfig } from '@/types';

export const metadata = { title: 'Événements' };

const STATUS = { live: 'En ligne', upcoming: 'À venir', ended: 'Terminé' } as const;
const DOT = { live: 'bg-emerald-400', upcoming: 'bg-amber-300', ended: 'bg-ev-muted/50' } as const;

export default async function EventsPage() {
  const rows = await db.event.findMany();
  const events: EventConfig[] = rows.map((r: { data: unknown }) => r.data as EventConfig).sort((a, b) => +new Date(a.schedule.start) - +new Date(b.schedule.start));

  return (
    <>
      <PageTitle title="Événements" intro="Les 12 pages de la campagne. Touche une page pour modifier ses textes, ses dates et ses offres." />
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {events.map((e) => {
          const status = getEventStatus(e);
          const c = e.theme.colors;
          const fmt = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', timeZone: MARKETS[e.market].timezone });
          return (
            <li key={e.id}>
              <Link href={`/admin/evenements/${e.id}`} className="group block overflow-hidden rounded-3xl border border-ev-muted/15 transition-transform duration-300 hover:-translate-y-1">
                <div className="relative h-28 p-4" style={{ background: `linear-gradient(135deg, ${c.bg} 30%, ${c.primary})`, color: c.text }}>
                  <p className="font-display text-xl leading-tight">{e.hero.title}</p>
                  <ArrowUpRight className="absolute right-4 top-4 opacity-70" size={18} aria-hidden="true" />
                </div>
                <div className="bg-ev-surface p-4">
                  <p className="font-medium">{e.name}</p>
                  <p className="mt-1 flex items-center gap-2 text-xs text-ev-muted">
                    <span className={`size-2 rounded-full ${DOT[status]}`} aria-hidden="true" />
                    {STATUS[status]}, du {fmt.format(new Date(e.schedule.start))} au {fmt.format(new Date(e.schedule.end))}
                    {e.market === 'us' && ', US'}
                  </p>
                  <p className="mt-1 text-xs text-ev-muted">/{e.slug}</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
