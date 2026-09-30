import Link from 'next/link';
import { ArrowUpRight, Mail, Package, Receipt, Star } from 'lucide-react';
import { PageTitle } from '@/components/admin/ui';
import { MARKETS } from '@/config/brand';
import { db } from '@/lib/db';
import { getEventStatus } from '@/lib/events';
import { formatPrice } from '@/lib/market';
import type { EventConfig } from '@/types';

export const metadata = { title: 'Accueil' };

const STATUS = { live: 'En ligne', upcoming: 'À venir', ended: 'Terminé' } as const;

export default async function Dashboard() {
  const weekAgo = new Date(Date.now() - 7 * 86400000);
  const [products, subscribers, newSubs, orders, reviews, eventRows] = await Promise.all([
    db.product.count({ where: { active: true } }),
    db.subscriber.count(),
    db.subscriber.count({ where: { createdAt: { gte: weekAgo } } }),
    db.order.findMany({ where: { status: 'paid' }, select: { amountTotal: true, currency: true } }),
    db.review.count({ where: { published: true } }),
    db.event.findMany(),
  ]);
  const events: EventConfig[] = eventRows.map((r: { data: unknown }) => r.data as EventConfig).sort((a, b) => +new Date(a.schedule.start) - +new Date(b.schedule.start));
  const revenueEur = orders.filter((o) => o.currency === 'eur').reduce((s, o) => s + o.amountTotal, 0);
  const revenueUsd = orders.filter((o) => o.currency === 'usd').reduce((s, o) => s + o.amountTotal, 0);

  const stats = [
    { label: 'Commandes', value: String(orders.length), sub: `${formatPrice(revenueEur, 'fr')} et ${formatPrice(revenueUsd, 'us')}`, icon: Receipt, href: '/admin/commandes' },
    { label: 'Inscrits', value: String(subscribers), sub: `+${newSubs} cette semaine`, icon: Mail, href: '/admin/inscrits' },
    { label: 'Produits en ligne', value: String(products), sub: 'Tous marchés', icon: Package, href: '/admin/produits' },
    { label: 'Avis publiés', value: String(reviews), sub: 'Avis réels', icon: Star, href: '/admin/avis' },
  ];

  return (
    <>
      <PageTitle title="Bonjour" intro="Voici où en est NovaVault." />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(({ label, value, sub, icon: Icon, href }, i) => (
          <Link key={label} href={href} className="fade-up group rounded-3xl border border-ev-muted/15 bg-ev-surface p-5 transition-colors hover:border-ev-primary/60" style={{ ['--d' as string]: `${i * 70}ms` }}>
            <Icon size={20} className="text-ev-highlight" aria-hidden="true" />
            <p className="mt-4 font-display text-3xl tabular-nums sm:text-4xl">{value}</p>
            <p className="text-sm font-medium">{label}</p>
            <p className="mt-1 text-xs text-ev-muted">{sub}</p>
          </Link>
        ))}
      </div>

      <h2 className="mb-4 mt-12 font-display text-2xl">Les 12 pages</h2>
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {events.map((e) => {
          const status = getEventStatus(e);
          const fmt = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', timeZone: MARKETS[e.market].timezone });
          return (
            <li key={e.id}>
              <Link
                href={`/admin/evenements/${e.id}`}
                className="group flex items-center gap-4 rounded-2xl border border-ev-muted/15 p-4 transition-colors hover:border-ev-primary/60"
              >
                <span className="size-10 shrink-0 rounded-xl" style={{ background: `linear-gradient(135deg, ${e.theme.colors.primary}, ${e.theme.colors.bg})` }} aria-hidden="true" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{e.name}</span>
                  <span className="text-xs text-ev-muted">
                    {STATUS[status]}, du {fmt.format(new Date(e.schedule.start))} au {fmt.format(new Date(e.schedule.end))}
                  </span>
                </span>
                <ArrowUpRight size={18} className="text-ev-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
