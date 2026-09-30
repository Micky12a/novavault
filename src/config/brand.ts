import type { EventTheme, Market, MarketBasics } from '@/types';

/** Identité fixe de la boutique. Le contenu modifiable (produits, textes, FAQ…) vit dans l’admin. */
export const BRAND = {
  name: 'NovaVault',
  url: 'https://getnovavault.com',
  contactEmail: 'contact@getnovavault.com',
  tagline: 'Les meilleures offres de chaque saison, choisies une par une.',
};

export const MARKETS: Record<Market, MarketBasics> = {
  fr: { lang: 'fr', locale: 'fr-FR', currency: 'EUR', timezone: 'Europe/Paris' },
  us: { lang: 'en', locale: 'en-US', currency: 'USD', timezone: 'America/New_York' },
};

export const BRAND_THEME: EventTheme = {
  mode: 'dark',
  colors: {
    bg: '#0E0F1A',
    surface: '#181A2B',
    text: '#F4F4F8',
    muted: '#A4A7BD',
    primary: '#7C83FF',
    primaryHover: '#666EF0',
    onPrimary: '#0E0F1A',
    accent: '#E9C46A',
    highlight: '#7C83FF',
  },
  fonts: { display: 'spaceGrotesk', body: 'inter' },
};

export const TRACKING = {
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID,
  tiktokPixelId: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID,
  gaId: process.env.NEXT_PUBLIC_GA_ID,
};
