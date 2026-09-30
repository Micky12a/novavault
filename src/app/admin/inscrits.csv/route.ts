import { getAdmin } from '@/lib/auth';
import { db } from '@/lib/db';

/** Export CSV des inscrits (ouvrable dans Excel), réservé à l’admin */
export async function GET(req: Request) {
  if (!(await getAdmin())) return new Response('Non autorisé', { status: 401 });
  const source = new URL(req.url).searchParams.get('source') || undefined;
  const subs = await db.subscriber.findMany({ where: source ? { source } : {}, orderBy: { createdAt: 'desc' } });
  const esc = (v: string | null) => `"${(v ?? '').replace(/"/g, '""')}"`;
  const rows = [
    'email;source;evenement;produit;date',
    ...subs.map((s) => [esc(s.email), esc(s.source), esc(s.eventId), esc(s.productId), esc(s.createdAt.toISOString())].join(';')),
  ];
  return new Response('\uFEFF' + rows.join('\n'), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="novavault-inscrits${source ? `-${source}` : ''}.csv"`,
    },
  });
}
