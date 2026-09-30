import type { Metadata } from 'next';
import { BRAND, MARKETS } from '@/config/brand';
import type { EventConfig } from '@/types';

export function buildEventMetadata(cfg: EventConfig): Metadata {
  const url = `${BRAND.url}/${cfg.slug}`;
  return {
    title: cfg.seo.title,
    description: cfg.seo.description,
    alternates: { canonical: url },
    openGraph: {
      title: cfg.seo.title,
      description: cfg.seo.description,
      url,
      siteName: BRAND.name,
      locale: MARKETS[cfg.market].locale.replace('-', '_'),
      type: 'website',
      images: [{ url: cfg.hero.image.src, alt: cfg.hero.image.alt }],
    },
  };
}
