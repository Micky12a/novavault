import { Download, Trash2 } from 'lucide-react';
import { PageTitle } from '@/components/admin/ui';
import { deleteSubscriber } from '@/app/admin/actions';
import { db } from '@/lib/db';

export const metadata = { title: 'Inscrits' };

const SOURCES: Record<string, string> = {
  'lead-popup': 'Pop-up',
  teaser: 'Avant ouverture',
  hub: 'Accueil',
  waitlist: 'Liste d’attente',
  challenge: 'Défi 30 jours',
  ended: 'Après la fin',
};

export default async function SubscribersPage({ searchParams }: { searchParams: Promise<{ source?: string }> }) {
  const { source = '' } = await searchParams;
  const [subs, counts] = await Promise.all([
    db.subscriber.findMany({ where: source ? { source } : {}, orderBy: { createdAt: 'desc' }, take: 500 }),
    db.subscriber.groupBy({ by: ['source'], _count: true }),
  ]);
  const date = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeZone: 'Europe/Paris' });

  return (
    <>
      <PageTitle
        title="Inscrits"
        intro="Les e-mails collectés sur le site. Resend s’en servira pour les envois."
        action={
          <a href={`/admin/inscrits.csv${source ? `?source=${source}` : ''}`} className="btn-quick w-auto px-5">
            <Download size={16} aria-hidden="true" /> Exporter en CSV
          </a>
        }
      />
      <nav className="mb-6 flex flex-wrap gap-2">
        <a href="/admin/inscrits" className={`rounded-full border px-3.5 py-1.5 text-sm ${!source ? 'border-ev-primary bg-ev-primary text-ev-on-primary' : 'border-ev-muted/30'}`}>
          Tous ({counts.reduce((n, c) => n + c._count, 0)})
        </a>
        {counts.map((c) => (
          <a
            key={c.source}
            href={`/admin/inscrits?source=${c.source}`}
            className={`rounded-full border px-3.5 py-1.5 text-sm ${source === c.source ? 'border-ev-primary bg-ev-primary text-ev-on-primary' : 'border-ev-muted/30'}`}
          >
            {SOURCES[c.source] ?? c.source} ({c._count})
          </a>
        ))}
      </nav>
      {subs.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-ev-muted/30 p-10 text-center text-ev-muted">Aucun inscrit pour l’instant.</p>
      ) : (
        <ul className="divide-y divide-ev-muted/15 rounded-3xl border border-ev-muted/15 bg-ev-surface">
          {subs.map((s) => (
            <li key={s.id} className="flex items-center gap-3 px-4 py-3">
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">{s.email}</span>
                <span className="text-xs text-ev-muted">
                  {SOURCES[s.source] ?? s.source}
                  {s.eventId ? `, ${s.eventId}` : ''}
                  {s.productId ? `, ${s.productId}` : ''}, le {date.format(s.createdAt)}
                </span>
              </span>
              <form action={deleteSubscriber}>
                <input type="hidden" name="id" value={s.id} />
                <button type="submit" className="rounded-full p-2.5 text-ev-muted hover:text-red-400" aria-label={`Supprimer ${s.email}`}>
                  <Trash2 size={16} />
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
