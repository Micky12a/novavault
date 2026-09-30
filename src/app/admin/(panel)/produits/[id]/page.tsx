import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import ProductForm from '@/components/admin/ProductForm';
import { PageTitle } from '@/components/admin/ui';
import { db } from '@/lib/db';
import type { EventConfig } from '@/types';

export const metadata = { title: 'Produit' };

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ cree?: string }> };

export default async function ProductPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { cree } = await searchParams;
  const isNew = id === 'nouveau';
  const [product, all, events] = await Promise.all([
    isNew ? null : db.product.findUnique({ where: { id } }),
    db.product.findMany({ select: { id: true, name: true, market: true }, orderBy: { name: 'asc' } }),
    db.event.findMany(),
  ]);
  if (!isNew && !product) notFound();

  // Collections proposées : celles des 12 pages, avec leur marché
  type CollectionOption = { id: string; market: string; label: string };
  const collections: CollectionOption[] = [
    ...new Map<string, CollectionOption>(
      events.map((e: { data: unknown }) => {
        const d = e.data as EventConfig;
        return [d.collection, { id: d.collection, market: d.market, label: `${d.collection} (${d.name})` }] as [string, CollectionOption];
      }),
    ).values(),
  ];

  return (
    <>
      <Link href="/admin/produits" className="mb-4 inline-flex items-center gap-2 text-sm text-ev-muted hover:text-ev-text">
        <ArrowLeft size={16} aria-hidden="true" /> Produits
      </Link>
      <PageTitle title={isNew ? 'Nouveau produit' : (product?.name ?? '')} />
      <ProductForm
        product={product ? { ...product, bundleOf: (product.bundleOf as { productId: string; qty: number }[] | null) ?? [] } : null}
        allProducts={all.filter((p) => p.id !== id)}
        collections={collections}
        justCreated={cree === '1'}
      />
    </>
  );
}
