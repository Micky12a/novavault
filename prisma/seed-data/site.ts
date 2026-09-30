import type { Market, MarketSettings } from '../../src/types';

/** Réglages initiaux par marché, modifiables ensuite dans Admin > Réglages */
export const SEED_SETTINGS: Record<Market, MarketSettings> = {
  fr: {
    freeShippingThreshold: 5000,
    paymentMethods: ['cb', 'visa', 'mastercard', 'apple-pay', 'google-pay', 'paypal'],
    bnpl: ['klarna'],
    guarantees: ['Satisfait ou remboursé 30 jours', 'Paiement 100 % sécurisé', 'Retours gratuits'],
    usps: [
      { icon: 'Truck', title: 'Livraison express', text: 'Expédition sous 24 h' },
      { icon: 'RotateCcw', title: 'Satisfait ou remboursé', text: '30 jours pour changer d’avis' },
      { icon: 'ShieldCheck', title: 'Paiement sécurisé', text: 'CB, Apple Pay, Google Pay, PayPal, paiement en 3 fois' },
      { icon: 'Headphones', title: 'Service client', text: 'Réponse sous 24 h, 7 j/7' },
    ],
    faq: [
      { q: 'Quels sont les délais de livraison ?', a: 'À compléter dans l’admin.' },
      { q: 'Comment retourner un article ?', a: 'À compléter dans l’admin.' },
      { q: 'Puis-je payer en plusieurs fois ?', a: 'À compléter dans l’admin.' },
    ],
    legalLinks: [
      { label: 'CGV', href: '/cgv' },
      { label: 'Mentions légales', href: '/mentions-legales' },
      { label: 'Politique de retour', href: '/retours' },
      { label: 'Confidentialité et cookies', href: '/confidentialite' },
    ],
    priceGuaranteeText: 'Garantie prix : si le prix baisse avant la fin de l’opération, on vous rembourse la différence.',
  },
  us: {
    freeShippingThreshold: 5000,
    paymentMethods: ['visa', 'mastercard', 'amex', 'apple-pay', 'google-pay', 'paypal'],
    bnpl: ['klarna'],
    guarantees: ['30-day money-back guarantee', 'Secure checkout', 'Tracked delivery'],
    usps: [
      { icon: 'Truck', title: 'Tracked delivery', text: 'Ships within 24 hours' },
      { icon: 'RotateCcw', title: 'Money-back guarantee', text: '30 days to change your mind' },
      { icon: 'ShieldCheck', title: 'Secure checkout', text: 'Apple Pay, Google Pay, PayPal, pay in 4' },
      { icon: 'Headphones', title: 'Customer care', text: 'Replies within 24 hours, 7 days a week' },
    ],
    faq: [
      { q: 'How long does shipping to the US take?', a: 'To be completed in the admin.' },
      { q: 'Will I pay customs duties?', a: 'To be completed in the admin.' },
      { q: 'How do returns work?', a: 'To be completed in the admin.' },
    ],
    legalLinks: [
      { label: 'Terms of Sale', href: '/en/terms' },
      { label: 'Privacy Policy', href: '/en/privacy' },
      { label: 'Returns & Refunds', href: '/en/returns' },
      { label: 'Shipping & Duties', href: '/en/shipping' },
    ],
    priceGuaranteeText: 'Price guarantee: if the price drops before the sale ends, we refund the difference.',
  },
};

export const SEED_LEGAL_PAGES = [
  { slug: 'cgv', lang: 'fr', title: 'Conditions générales de vente' },
  { slug: 'mentions-legales', lang: 'fr', title: 'Mentions légales' },
  { slug: 'retours', lang: 'fr', title: 'Politique de retour' },
  { slug: 'confidentialite', lang: 'fr', title: 'Confidentialité et cookies' },
  { slug: 'en/terms', lang: 'en', title: 'Terms of Sale' },
  { slug: 'en/privacy', lang: 'en', title: 'Privacy Policy' },
  { slug: 'en/returns', lang: 'en', title: 'Returns & Refunds' },
  { slug: 'en/shipping', lang: 'en', title: 'Shipping & Duties' },
] as const;
