import Image from 'next/image';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { PageTitle } from '@/components/admin/ui';
import { db } from '@/lib/db';
import { formatPrice } from '@/lib/market';
import type { Market } from '@/types';

export const metadata = { title: 'Produits' };

type Props = { searchParams: Promise<{ q?: string; collection?: string }> };

export default async function ProductsPage({ searchParams }: Props) {
  const { q = '', collection = '' } = await searchParams;
  const [products, collections] = await Promise.all([
    db.product.findMany({
      where: {
        ...(collection ? { collection } : {}),
        ...(q ? { OR: [{ name: { contains: q, mode: 'insensitive' } }, { id: { contains: q.toLowerCase() } }] } : {}),
      },
      orderBy: [{ collection: 'asc' }, { sortOrder: 'asc' }],
    }),
    db.product.findMany({ distinct: ['collection'], select: { collection: true }, orderBy: { collection: 'asc' } }),
  ]);

  return (
    <>
      <PageTitle
        title="Produits"
        intro={`${products.length} produit${products.length > 1 ? 's' : ''}`}
        action={
          <Link href="/admin/produits/nouveau" className="btn-primary">
            <Plus size={18} aria-hidden="true" /> Nouveau produit
          </Link>
        }
      />

      <form className="mb-6 flex flex-wrap gap-2">
        <input name="q" defaultValue={q} placeholder="Rechercher un produit" className="field min-w-0 flex-1" />
        <select name="collection" defaultValue={collection} className="field">
          <option value="">Toutes les collections</option>
          {collections.map((c) => (
            <option key={c.collection} value={c.collection}>
              {c.collection}
            </option>
          ))}
        </select>
        <button type="submit" className="btn-quick w-auto px-5">
          Filtrer
        </button>
      </form>

      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((p) => (
          <li key={p.id}>
            <Link href={`/admin/produits/${p.id}`} className="flex gap-4 rounded-2xl border border-ev-muted/15 bg-ev-surface p-3 transition-colors hover:border-ev-primary/60">
              <Image src={p.imageUrl} alt="" width={80} height={80} className="size-20 shrink-0 rounded-xl object-cover" />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">{p.name}</span>
                <span className="block text-sm">
                  {formatPrice(p.price, p.market as Market)}
                  {p.compareAtPrice && <s className="ml-2 text-ev-muted">{formatPrice(p.compareAtPrice, p.market as Market)}</s>}
                </span>
                <span className="mt-1 flex flex-wrap gap-1.5 text-xs">
                  <span className="rounded-full bg-ev-bg px-2 py-0.5 text-ev-muted">{p.collection}</span>
                  {!p.active && <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-red-300">Masqué</span>}
                  {p.market === 'us' && <span className="rounded-full bg-ev-bg px-2 py-0.5 text-ev-muted">US</span>}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
