import { Receipt } from 'lucide-react';
import { PageTitle } from '@/components/admin/ui';
import { db } from '@/lib/db';
import { formatPrice } from '@/lib/market';

export const metadata = { title: 'Commandes' };

const STATUS: Record<string, string> = { paid: 'Payée', refunded: 'Remboursée', pending: 'En attente' };

export default async function OrdersPage() {
  const orders = await db.order.findMany({ orderBy: { createdAt: 'desc' }, take: 200 });
  const date = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Europe/Paris' });

  return (
    <>
      <PageTitle title="Commandes" intro="Enregistrées automatiquement dès que Stripe confirme un paiement." />
      {orders.length === 0 ? (
        <div className="grid place-items-center rounded-3xl border border-dashed border-ev-muted/30 px-6 py-16 text-center">
          <Receipt size={36} className="text-ev-highlight" aria-hidden="true" />
          <p className="mt-4 font-display text-xl">Aucune commande pour l’instant</p>
          <p className="mt-1 max-w-sm text-sm text-ev-muted">Elles apparaîtront ici dès que le paiement Stripe sera branché et que les premières ventes tomberont.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {orders.map((o) => {
            const items = (o.items as { name: string; qty: number }[]) ?? [];
            return (
              <li key={o.id} className="rounded-2xl border border-ev-muted/15 bg-ev-surface p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-display text-xl tabular-nums">{formatPrice(o.amountTotal, o.currency === 'usd' ? 'us' : 'fr')}</p>
                  <span className="rounded-full bg-ev-bg px-3 py-1 text-xs">{STATUS[o.status] ?? o.status}</span>
                </div>
                <p className="mt-1 text-sm text-ev-muted">
                  {date.format(o.createdAt)}, {o.email ?? 'e-mail inconnu'}, {o.market === 'us' ? 'États-Unis' : 'France'}
                </p>
                <p className="mt-2 text-sm">{items.map((i) => `${i.qty} × ${i.name}`).join(', ')}</p>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
