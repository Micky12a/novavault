import { MARKETS } from '@/config/brand';
import { frenchTypography } from '@/lib/typo';
import type { Market } from '@/types';

export function formatPrice(cents: number, market: Market): string {
  const m = MARKETS[market];
  return new Intl.NumberFormat(m.locale, { style: 'currency', currency: m.currency }).format(cents / 100);
}

export function formatPerPerson(cents: number, serves: number, market: Market): string {
  return formatPrice(Math.ceil(cents / serves), market);
}

export function savingsPercent(price: number, compareAtPrice?: number): number | null {
  if (!compareAtPrice || compareAtPrice <= price) return null;
  return Math.round((1 - price / compareAtPrice) * 100);
}

const fr = frenchTypography;

/** Libellés d’interface par langue (les textes marketing restent dans events.ts) */
const UI = {
  fr: {
    addToCart: 'Ajouter au panier',
    added: 'Ajouté',
    quickAdd: 'Ajout rapide',
    checkout: 'Commander',
    endsIn: 'Fin dans',
    orderWithin: 'Dernière commande dans',
    startsIn: 'Ouverture dans',
    units: { d: 'jours', h: 'h', m: 'min', s: 's' },
    days: 'j',
    soldOut: 'Épuisé',
    joinWaitlist: 'Me prévenir',
    claimed: (pct: number) => fr(`${pct} % réclamés`),
    sellingFast: 'Part vite',
    perPerson: (price: string) => `soit ${price} par personne`,
    youSave: (pct: number) => fr(`-${pct} %`),
    freeShippingLeft: (amount: string) => `Plus que ${amount} pour la livraison offerte`,
    freeShippingUnlocked: 'Livraison offerte débloquée',
    upsellTitle: 'Souvent ajouté avec',
    nextDrop: 'Prochaine vague dans',
    earlyAccess: 'Accès anticipé',
    reviews: 'Avis clients',
    faq: 'Questions fréquentes',
  },
  en: {
    addToCart: 'Add to cart',
    added: 'Added',
    quickAdd: 'Quick add',
    checkout: 'Checkout',
    endsIn: 'Ends in',
    orderWithin: 'Order within',
    startsIn: 'Opens in',
    units: { d: 'days', h: 'hrs', m: 'min', s: 'sec' },
    days: 'd',
    soldOut: 'Sold out',
    joinWaitlist: 'Notify me',
    claimed: (pct: number) => `${pct}% claimed`,
    sellingFast: 'Selling fast',
    perPerson: (price: string) => `just ${price} per person`,
    youSave: (pct: number) => `${pct}% off`,
    freeShippingLeft: (amount: string) => `You’re ${amount} away from free shipping`,
    freeShippingUnlocked: 'You’ve unlocked free shipping',
    upsellTitle: 'Frequently added',
    nextDrop: 'Next drop in',
    earlyAccess: 'Early access',
    reviews: 'Customer reviews',
    faq: 'FAQ',
  },
};

export function t(market: Market) {
  return UI[MARKETS[market].lang];
}
