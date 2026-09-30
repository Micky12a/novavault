export type Market = 'fr' | 'us';
export type Lang = 'fr' | 'en';

export type EventKey = 'halloween' | 'thanksgiving' | 'black-friday' | 'cyber-monday' | 'noel' | 'nouvel-an';

export type FontKey = 'bungee' | 'anton' | 'playfair' | 'lora' | 'spaceGrotesk' | 'bodoni' | 'inter';

/** Réglages fixes d’un marché (dans le code) */
export interface MarketBasics {
  lang: Lang;
  locale: 'fr-FR' | 'en-US';
  currency: 'EUR' | 'USD';
  timezone: string;
}

/** Réglages modifiables d’un marché (dans l’admin) */
export interface MarketSettings {
  freeShippingThreshold: number; // centimes
  paymentMethods: string[];
  bnpl: string[];
  guarantees: string[];
  usps: { icon: string; title: string; text: string }[];
  faq: { q: string; a: string }[];
  legalLinks: { label: string; href: string }[];
  priceGuaranteeText: string;
}

export type MarketConfig = MarketBasics & MarketSettings;

export interface EventTheme {
  mode: 'dark' | 'light';
  colors: {
    bg: string;
    surface: string;
    text: string;
    muted: string;
    primary: string;
    primaryHover: string;
    onPrimary: string;
    accent: string;
    highlight: string;
  };
  fonts: { display: FontKey; body: FontKey };
}

/** Mécaniques de conversion activables par événement (voir README) */
export interface EventFeatures {
  heroProductId?: string;
  dealDrops?: { at: string; label: string }[];
  earlyAccess?: { opensAt: string; publicAt: string };
  priceGuarantee?: boolean;
  stockClaimed?: boolean;
  waitlist?: boolean;
  sellingFastBadge?: boolean;
  perPersonPricing?: boolean;
  shopTheLook?: { title: string; intro: string; productIds: string[] }[];
  bonuses?: string[];
  giftFinder?: boolean;
  giftFilters?: { budgets: number[]; recipients: string[] };
  teamPicks?: boolean;
  orderCutoff?: { date: string; label: string };
  giftTeaser?: boolean;
  eGiftCard?: boolean;
  challenge?: { name: string; days: number; reward: string };
}

export interface EventConfig {
  id: string;
  event: EventKey;
  market: Market;
  slug: string;
  name: string;
  schedule: { start: string; end: string };
  announcement: { message: string; countdown: boolean };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    cta: { label: string; href: string };
    image: { src: string; alt: string };
  };
  featuredOffers: string[];
  collection: string;
  cart: { upsellProductId?: string; freeShippingThreshold?: number };
  leadCapture: { trigger: 'entry' | 'exit-intent'; title: string; incentive: string; promoCode?: string };
  features: EventFeatures;
  seo: { title: string; description: string };
  theme: EventTheme;
}

export interface Product {
  id: string;
  market: Market;
  name: string;
  collection: string;
  price: number; // centimes
  compareAtPrice?: number;
  image: { src: string; alt: string };
  bundleOf?: { productId: string; qty: number }[];
  serves?: number;
  stock?: { allocated: number; sold: number };
  description?: string;
  recipients?: string[];
  interests?: string[];
  digital?: boolean;
  teamNote?: string;
  active?: boolean;
  sortOrder?: number;
}

export interface Review {
  id?: string;
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  photo?: string;
  verified: boolean;
  collection?: string;
}

/** Ligne de panier : instantané du produit au moment de l’ajout */
export interface CartLine {
  productId: string;
  qty: number;
  name: string;
  price: number;
  image: { src: string; alt: string };
}

export interface LegalPageData {
  slug: string;
  lang: Lang;
  title: string;
  body: string;
}
