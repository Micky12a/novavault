import 'server-only';
import { cache } from 'react';
import { MARKETS } from '@/config/brand';
import { db } from '@/lib/db';
import { withFrenchTypography } from '@/lib/typo';
import type { EventConfig, LegalPageData, Market, MarketConfig, MarketSettings, Product, Review } from '@/types';

/* Toutes les lectures du site public passent par ici. La typographie française est appliquée
   à l’affichage : dans l’admin, tu saisis le texte normalement. */

const frTypo = <T,>(market: Market, v: T): T => (market === 'fr' ? withFrenchTypography(v) : v);

type ProductRow = Awaited<ReturnType<typeof db.product.findMany>>[number];

export function rowToProduct(r: ProductRow): Product {
  const market = r.market as Market;
  const p: Product = {
    id: r.id,
    market,
    collection: r.collection,
    name: r.name,
    description: r.description ?? undefined,
    price: r.price,
    compareAtPrice: r.compareAtPrice ?? undefined,
    image: { src: r.imageUrl, alt: r.imageAlt },
    serves: r.serves ?? undefined,
    stock: r.stockAllocated ? { allocated: r.stockAllocated, sold: r.stockSold ?? 0 } : undefined,
    recipients: r.recipients,
    interests: r.interests,
    digital: r.digital,
    teamNote: r.teamNote ?? undefined,
    bundleOf: (r.bundleOf as Product['bundleOf']) ?? undefined,
    active: r.active,
    sortOrder: r.sortOrder,
  };
  if (market !== 'fr') return p;
  return {
    ...p,
    name: withFrenchTypography(p.name),
    description: p.description && withFrenchTypography(p.description),
    teamNote: p.teamNote && withFrenchTypography(p.teamNote),
    image: { ...p.image, alt: withFrenchTypography(p.image.alt) },
  };
}

export const getEvents = cache(async (): Promise<EventConfig[]> => {
  const rows = await db.event.findMany();
  return rows.map((r) => {
    const e = r.data as unknown as EventConfig;
    return frTypo(e.market, e);
  });
});

export const getEventBySlug = cache(async (slug: string): Promise<EventConfig | undefined> => {
  return (await getEvents()).find((e) => e.slug === slug);
});

export const getProductsByCollection = cache(async (collection: string): Promise<Product[]> => {
  const rows = await db.product.findMany({ where: { collection, active: true }, orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] });
  return rows.map(rowToProduct);
});

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return [];
  const rows = await db.product.findMany({ where: { id: { in: ids }, active: true } });
  const byId = new Map(rows.map((r) => [r.id, rowToProduct(r)]));
  return ids.map((id) => byId.get(id)).filter((p): p is Product => !!p);
}

export const getMarketConfig = cache(async (market: Market): Promise<MarketConfig> => {
  const row = await db.marketSetting.findUnique({ where: { market } });
  const settings = (row?.data ?? {}) as unknown as MarketSettings;
  return { ...MARKETS[market], ...frTypo(market, settings) };
});

export const getReviews = cache(async (collection: string): Promise<Review[]> => {
  const rows = await db.review.findMany({
    where: { published: true, OR: [{ collection: null }, { collection }] },
    orderBy: { createdAt: 'desc' },
    take: 9,
  });
  return rows.map((r) => ({
    id: r.id,
    author: r.author,
    rating: Math.min(5, Math.max(1, r.rating)) as Review['rating'],
    text: r.text,
    photo: r.photoUrl ?? undefined,
    verified: r.verified,
    collection: r.collection ?? undefined,
  }));
});

export const getRatingSummary = cache(async (): Promise<{ value: number; count: number } | null> => {
  const agg = await db.review.aggregate({ where: { published: true, verified: true }, _avg: { rating: true }, _count: true });
  if (!agg._count || agg._count < 5 || !agg._avg.rating) return null; // pas de note affichée sous 5 avis vérifiés
  return { value: Math.round(agg._avg.rating * 10) / 10, count: agg._count };
});

export async function getLegalPage(slug: string): Promise<LegalPageData | null> {
  const row = await db.legalPage.findUnique({ where: { slug } });
  if (!row) return null;
  const lang = row.lang === 'en' ? 'en' : 'fr';
  const page = { slug: row.slug, lang, title: row.title, body: row.body } as LegalPageData;
  return lang === 'fr' ? withFrenchTypography(page) : page;
}
