import type { EventConfig } from '../../src/types';

/**
 * Données initiales des 12 landings (6 événements × 2 variantes), chargées par `npm run db:seed`.
 * Ensuite, tout se modifie depuis l’admin.
 * Marché FR (Europe/Paris) sauf Thanksgiving, ciblé US (America/New_York, en anglais, en USD).
 * Fuseaux : Paris +02:00 jusqu’au 24 oct. 2026 puis +01:00 ; New York -04:00 jusqu’au 31 oct. puis -05:00.
 * Dates de début, cut-offs et ids produits : propositions à valider avec la logistique.
 */
export const SEED_EVENTS: Record<string, EventConfig> = {
  // ─── HALLOWEEN (FR) · Noir / Orange brûlé / Violet nuit / Vert néon
  'halloween-1': {
    id: 'halloween-1',
    event: 'halloween',
    market: 'fr',
    slug: 'halloween',
    name: 'Déco et costumes d’Halloween',
    schedule: { start: '2026-10-15T00:00:00+02:00', end: '2026-10-31T23:59:59+01:00' },
    announcement: { message: 'Offres d’Halloween : jusqu’à -50 % jusqu’au 31 octobre', countdown: true },
    hero: {
      badge: 'Édition limitée Halloween',
      title: 'Une soirée d’Halloween qui fait vraiment frissonner',
      subtitle: 'Déco et costumes livrés en 48 h, pour être prêt bien avant le 31.',
      cta: { label: 'Je prépare ma soirée', href: '#offres' },
      image: { src: '/images/halloween/hero.webp', alt: 'Salon décoré pour Halloween' },
    },
    featuredOffers: ['hw-pack-deco', 'hw-costume'],
    collection: 'halloween-deco-costumes',
    cart: { upsellProductId: 'hw-bougies' },
    leadCapture: { trigger: 'exit-intent', title: 'Attendez ! Un petit sort pour vous', incentive: '-10 % sur votre commande', promoCode: 'BOO10' },
    features: {
      heroProductId: 'hw-star', // la « pièce star » de la saison, façon Skelly
      waitlist: true,
      orderCutoff: { date: '2026-10-28T12:00:00+01:00', label: 'Commandez avant le 28 octobre midi pour être livré avant Halloween' },
    },
    seo: { title: 'Halloween : déco et costumes jusqu’à -50 %', description: 'Déco et costumes d’Halloween livrés en 48 h.' },
    theme: {
      mode: 'dark',
      colors: { bg: '#0B0810', surface: '#1A1224', text: '#FFFFFF', muted: '#B8AFC4', primary: '#CC5500', primaryHover: '#B34A00', onPrimary: '#FFFFFF', accent: '#4B1D7A', highlight: '#39FF14' },
      fonts: { display: 'bungee', body: 'inter' },
    },
  },
  'halloween-2': {
    id: 'halloween-2',
    event: 'halloween',
    market: 'fr',
    slug: 'halloween/deals',
    name: 'Vente flash accessoires d’Halloween',
    schedule: { start: '2026-10-24T00:00:00+02:00', end: '2026-10-31T23:59:59+01:00' },
    announcement: { message: 'Vente flash Halloween : expédition sous 24 h', countdown: true },
    hero: {
      badge: 'Vente flash',
      title: 'Les accessoires d’Halloween à prix cassés',
      subtitle: 'Une sélection limitée, expédiée sous 24 h pour arriver avant le 31.',
      cta: { label: 'Voir les offres', href: '#offres' },
      image: { src: '/images/halloween/deals-hero.webp', alt: 'Accessoires d’Halloween' },
    },
    featuredOffers: ['hw-pack-accessoires', 'hw-masque'],
    collection: 'halloween-accessoires',
    cart: { upsellProductId: 'hw-maquillage' },
    leadCapture: { trigger: 'exit-intent', title: 'Ne partez pas les mains vides', incentive: '-10 % sur votre commande', promoCode: 'FLASH10' },
    features: {
      stockClaimed: true,
      waitlist: true,
      orderCutoff: { date: '2026-10-29T12:00:00+01:00', label: 'Commandez avant le 29 octobre midi : expédition express, livré avant le 31' },
    },
    seo: { title: 'Vente flash Halloween', description: 'Accessoires d’Halloween à prix cassés, expédiés sous 24 h.' },
    theme: {
      mode: 'dark',
      colors: { bg: '#0A0710', surface: '#171022', text: '#FFFFFF', muted: '#B8AFC4', primary: '#39FF14', primaryHover: '#2FD611', onPrimary: '#000000', accent: '#8B5CF6', highlight: '#FF7A1A' },
      fonts: { display: 'bungee', body: 'inter' },
    },
  },

  // ─── THANKSGIVING (US) · Terracotta / Crème / Vert forêt / Ocre — pages en anglais, prix en USD
  'thanksgiving-1': {
    id: 'thanksgiving-1',
    event: 'thanksgiving',
    market: 'us',
    slug: 'thanksgiving',
    name: 'Thanksgiving Kitchen & Table',
    // Fin = cut-off de livraison avant le jeudi 26 nov. (à caler avec le délai d’acheminement vers les US)
    schedule: { start: '2026-10-26T00:00:00-04:00', end: '2026-11-19T23:59:59-05:00' },
    announcement: { message: 'Free shipping on orders over $50. Order by Nov 19 for Thanksgiving delivery.', countdown: true },
    hero: {
      badge: 'The Thanksgiving Edit',
      title: 'Host a stress-free Thanksgiving, from the table to the pie',
      subtitle: 'Tableware, cookware and hosting essentials, delivered before the big day.',
      cta: { label: 'Shop the Thanksgiving table', href: '#offers' },
      image: { src: '/images/thanksgiving/hero.webp', alt: 'A Thanksgiving table set for eight' },
    },
    featuredOffers: ['tg-host-kit-8', 'tg-dutch-oven'],
    collection: 'thanksgiving-kitchen',
    cart: { upsellProductId: 'tg-napkins' },
    leadCapture: { trigger: 'exit-intent', title: 'Before you go, a little thank-you', incentive: '10% off your first order', promoCode: 'THANKS10' },
    features: {
      perPersonPricing: true, // « Host Kit for 8 : just $X per guest », façon Walmart / Target
      shopTheLook: [
        { title: 'The Host Kit: a table for 8', intro: 'Everything you need to set a beautiful table for eight, in one click.', productIds: ['tg-host-kit-8'] },
        { title: 'The Pie Station', intro: 'Bakeware and serving pieces for the dessert table.', productIds: ['tg-pie-dish', 'tg-cake-server', 'tg-cooling-rack'] },
      ],
      orderCutoff: { date: '2026-11-19T23:59:59-05:00', label: 'Order by Nov 19 to get it before Thanksgiving' },
    },
    seo: { title: 'Thanksgiving Tableware & Hosting Essentials', description: 'Everything to host Thanksgiving, delivered before the big day. Free shipping over $50.' },
    theme: {
      mode: 'light',
      colors: { bg: '#FBF6EE', surface: '#FFFFFF', text: '#2B211A', muted: '#6B5B4E', primary: '#B5552F', primaryHover: '#9A4526', onPrimary: '#FFFFFF', accent: '#2F4A2A', highlight: '#C8912E' },
      fonts: { display: 'playfair', body: 'inter' },
    },
  },
  'thanksgiving-2': {
    id: 'thanksgiving-2',
    event: 'thanksgiving',
    market: 'us',
    slug: 'thanksgiving/deals',
    name: 'Thanksgiving Gifts & Cozy Bundles',
    schedule: { start: '2026-10-26T00:00:00-04:00', end: '2026-11-26T23:59:59-05:00' },
    announcement: { message: 'Buy 2, get the 3rd 50% off on Thanksgiving gift bundles', countdown: true },
    hero: {
      badge: 'Family Bundle Deal',
      title: 'Cozy gifts for everyone at your table',
      subtitle: 'Hostess gifts and comfort bundles: buy 2, get the 3rd 50% off.',
      cta: { label: 'Shop the bundles', href: '#offers' },
      image: { src: '/images/thanksgiving/deals-hero.webp', alt: 'Throw blankets and gift boxes by the fireplace' },
    },
    featuredOffers: ['tg-cozy-bundle', 'tg-throw'],
    collection: 'thanksgiving-gifts',
    cart: { upsellProductId: 'tg-candle' },
    leadCapture: { trigger: 'exit-intent', title: 'Still looking for a hostess gift?', incentive: '10% off your first order', promoCode: 'FAMILY10' },
    features: {
      sellingFastBadge: true,
      orderCutoff: { date: '2026-11-19T23:59:59-05:00', label: 'Order by Nov 19 to gift it on Thanksgiving Day' },
    },
    seo: { title: 'Thanksgiving Gift Bundles: Buy 2, Get the 3rd 50% Off', description: 'Hostess gifts and cozy bundles for Thanksgiving.' },
    theme: {
      mode: 'light',
      colors: { bg: '#F5EFE6', surface: '#FFFFFF', text: '#1F2937', muted: '#6B5B4E', primary: '#2F4A2A', primaryHover: '#243A20', onPrimary: '#FFFFFF', accent: '#B5552F', highlight: '#C8912E' },
      fonts: { display: 'playfair', body: 'inter' },
    },
  },

  // ─── BLACK FRIDAY (FR) · Noir #000 / Rouge vif / Jaune-Vert néon
  'black-friday-1': {
    id: 'black-friday-1',
    event: 'black-friday',
    market: 'fr',
    slug: 'black-friday',
    name: 'Black Friday high-tech',
    schedule: { start: '2026-11-20T00:00:00+01:00', end: '2026-11-27T23:59:59+01:00' },
    announcement: { message: 'Black Friday : jusqu’à -70 % sur la high-tech', countdown: true },
    hero: {
      badge: 'Jusqu’à -70 %',
      title: 'Les prix les plus bas de l’année sur la high-tech',
      subtitle: 'Nouvelles offres à chaque vague, garantie prix et retours gratuits sous 30 jours.',
      cta: { label: 'J’en profite', href: '#offres' },
      image: { src: '/images/black-friday/hero.webp', alt: 'Gadgets high-tech' },
    },
    featuredOffers: ['bf-pack-audio', 'bf-ecouteurs'],
    collection: 'black-friday-tech',
    cart: { upsellProductId: 'bf-cable' },
    leadCapture: { trigger: 'entry', title: 'Soyez prévenu avant chaque vague', incentive: 'Alerte e-mail 1 h avant chaque nouvelle vague d’offres' },
    features: {
      dealDrops: [
        { at: '2026-11-20T09:00:00+01:00', label: 'Vague 1, le lancement' },
        { at: '2026-11-24T09:00:00+01:00', label: 'Vague 2, la mi-semaine' },
        { at: '2026-11-27T00:00:00+01:00', label: 'Vague 3, le Black Friday' },
      ],
      priceGuarantee: true, // lève le frein « j’attends que ce soit moins cher » (Best Buy)
      stockClaimed: true,
      waitlist: true,
    },
    seo: { title: 'Black Friday : jusqu’à -70 % sur la high-tech', description: 'Offres par vagues, garantie prix, stocks limités.' },
    theme: {
      mode: 'dark',
      colors: { bg: '#000000', surface: '#111111', text: '#FFFFFF', muted: '#A1A1AA', primary: '#FF1F1F', primaryHover: '#E01010', onPrimary: '#FFFFFF', accent: '#E6FF00', highlight: '#39FF14' },
      fonts: { display: 'anton', body: 'inter' },
    },
  },
  'black-friday-2': {
    id: 'black-friday-2',
    event: 'black-friday',
    market: 'fr',
    slug: 'black-friday/vip',
    name: 'Black Friday VIP',
    schedule: { start: '2026-11-19T00:00:00+01:00', end: '2026-11-27T23:59:59+01:00' },
    announcement: { message: 'Accès VIP : -60 % immédiat au panier', countdown: true },
    hero: {
      badge: 'Accès anticipé',
      title: 'Les best-sellers à -60 %, 24 h avant tout le monde',
      subtitle: 'Ventes flash réservées aux inscrits, jusqu’à rupture de stock.',
      cta: { label: 'Accéder aux ventes VIP', href: '#offres' },
      image: { src: '/images/black-friday/vip-hero.webp', alt: 'Best-sellers en édition limitée' },
    },
    featuredOffers: ['bf-pack-bestseller', 'bf-bestseller'],
    collection: 'black-friday-bestsellers',
    cart: { upsellProductId: 'bf-etui' },
    leadCapture: { trigger: 'entry', title: 'Rejoignez la liste VIP NovaVault', incentive: 'Accès 24 h avant l’ouverture publique' },
    features: {
      earlyAccess: { opensAt: '2026-11-19T09:00:00+01:00', publicAt: '2026-11-20T09:00:00+01:00' },
      priceGuarantee: true,
      stockClaimed: true,
      waitlist: true,
    },
    seo: { title: 'Black Friday VIP : -60 % sur les best-sellers', description: 'Accès anticipé de 24 h aux ventes flash Black Friday.' },
    theme: {
      mode: 'dark',
      colors: { bg: '#000000', surface: '#111111', text: '#FFFFFF', muted: '#A1A1AA', primary: '#E6FF00', primaryHover: '#CCE600', onPrimary: '#000000', accent: '#FF1F1F', highlight: '#39FF14' },
      fonts: { display: 'anton', body: 'inter' },
    },
  },

  // ─── CYBER MONDAY (FR) · Bleu électrique / Cyber-violet / Fond clair ou sombre
  'cyber-monday-1': {
    id: 'cyber-monday-1',
    event: 'cyber-monday',
    market: 'fr',
    slug: 'cyber-monday',
    name: 'Cyber Monday maison connectée',
    schedule: { start: '2026-11-28T00:00:00+01:00', end: '2026-11-30T23:59:59+01:00' },
    announcement: { message: 'Cyber Monday : offres exclusivement en ligne', countdown: true },
    hero: {
      badge: 'Tech deals',
      title: 'Votre maison connectée, au meilleur prix de l’année',
      subtitle: 'Domotique, audio et accessoires tech : offres uniquement en ligne.',
      cta: { label: 'Voir les offres tech', href: '#offres' },
      image: { src: '/images/cyber-monday/hero.webp', alt: 'Salon équipé d’objets connectés' },
    },
    featuredOffers: ['cm-pack-smarthome', 'cm-enceinte'],
    collection: 'cyber-monday-smarthome',
    cart: { upsellProductId: 'cm-ampoule' },
    leadCapture: { trigger: 'exit-intent', title: 'Encore une offre pour vous', incentive: '-10 % sur votre commande', promoCode: 'CYBER10' },
    features: {
      heroProductId: 'cm-star', // l’appareil phare en hero, façon Amazon
      priceGuarantee: true,
      stockClaimed: true,
    },
    seo: { title: 'Cyber Monday : tech et maison connectée', description: 'Les meilleures offres high-tech, exclusivement en ligne.' },
    theme: {
      mode: 'dark',
      colors: { bg: '#070B1A', surface: '#10172E', text: '#FFFFFF', muted: '#94A3B8', primary: '#1F51FF', primaryHover: '#1A43D6', onPrimary: '#FFFFFF', accent: '#9D4EDD', highlight: '#00E5FF' },
      fonts: { display: 'spaceGrotesk', body: 'inter' },
    },
  },
  'cyber-monday-2': {
    id: 'cyber-monday-2',
    event: 'cyber-monday',
    market: 'fr',
    slug: 'cyber-monday/deals',
    name: 'Cyber Monday produits digitaux',
    schedule: { start: '2026-11-30T00:00:00+01:00', end: '2026-11-30T23:59:59+01:00' },
    announcement: { message: 'Fin du Cyber Monday ce soir à minuit', countdown: true },
    hero: {
      badge: 'Dernière chance',
      title: 'Dernières heures pour vos e-deals à prix Cyber Monday',
      subtitle: 'Produits digitaux, abonnements et e-cartes cadeaux, disponibles immédiatement.',
      cta: { label: 'Voir les e-deals', href: '#offres' },
      image: { src: '/images/cyber-monday/deals-hero.webp', alt: 'Produits digitaux sur smartphone' },
    },
    featuredOffers: ['cm-pack-digital', 'cm-ecarte'],
    collection: 'cyber-monday-digital',
    cart: { upsellProductId: 'cm-ebook' },
    leadCapture: { trigger: 'exit-intent', title: 'Dernière chance', incentive: '-10 % sur votre commande', promoCode: 'LAST10' },
    features: {
      // Minuteur + bouton + garantie + bonus dans le même écran (Hostinger)
      bonuses: ['Accès immédiat après paiement', 'Mises à jour incluses', 'Garantie satisfait ou remboursé 30 jours'],
    },
    seo: { title: 'Cyber Monday : e-deals jusqu’à minuit', description: 'Produits digitaux et e-cartes cadeaux à prix Cyber Monday.' },
    theme: {
      mode: 'light',
      colors: { bg: '#F5F7FF', surface: '#FFFFFF', text: '#0B1030', muted: '#5B6480', primary: '#7B2FF7', primaryHover: '#6A22DB', onPrimary: '#FFFFFF', accent: '#1F51FF', highlight: '#00B8D9' },
      fonts: { display: 'spaceGrotesk', body: 'inter' },
    },
  },

  // ─── NOËL (FR) · Rouge Noël / Vert sapin / Doré / Blanc neige
  'noel-1': {
    id: 'noel-1',
    event: 'noel',
    market: 'fr',
    slug: 'noel',
    name: 'Guide cadeaux de Noël',
    schedule: { start: '2026-12-01T00:00:00+01:00', end: '2026-12-20T12:00:00+01:00' },
    announcement: { message: 'Livraison garantie avant Noël pour toute commande avant le 20 décembre midi', countdown: true },
    hero: {
      badge: 'Guide cadeaux NovaVault',
      title: 'Le cadeau parfait pour chacun, quel que soit votre budget',
      subtitle: 'Répondez à 3 questions ou choisissez un budget : on s’occupe du reste.',
      cta: { label: 'Trouver le bon cadeau', href: '#gift-finder' },
      image: { src: '/images/noel/hero.webp', alt: 'Cadeaux emballés au pied du sapin' },
    },
    featuredOffers: ['nl-coffret', 'nl-cadeau-20'],
    collection: 'noel-guide-cadeaux',
    cart: { upsellProductId: 'nl-papier-cadeau' },
    leadCapture: { trigger: 'exit-intent', title: 'Un cadeau pour vous aussi', incentive: '-10 % sur votre commande', promoCode: 'NOEL10' },
    features: {
      giftFinder: true, // quiz : pour qui ? quelle occasion ? quels goûts ? (Etsy, Uncommon Goods)
      giftFilters: {
        budgets: [2000, 5000, 10000],
        recipients: ['Pour elle', 'Pour lui', 'Enfants', 'Ados', 'Parents', 'Collègues'],
      },
      teamPicks: true, // « Ce que l’équipe offre cette année » (Nordstrom)
      orderCutoff: { date: '2026-12-20T12:00:00+01:00', label: 'Commandez avant le 20 décembre midi pour être livré avant Noël' },
    },
    seo: { title: 'Idées cadeaux de Noël par budget', description: 'Quiz cadeau, idées à moins de 20, 50 et 100 €, livrées avant Noël.' },
    theme: {
      mode: 'light',
      colors: { bg: '#FBF8F3', surface: '#FFFFFF', text: '#1C2A1E', muted: '#5E6B60', primary: '#B3121F', primaryHover: '#940F19', onPrimary: '#FFFFFF', accent: '#1E4D2B', highlight: '#C9A227' },
      fonts: { display: 'lora', body: 'inter' },
    },
  },
  'noel-2': {
    id: 'noel-2',
    event: 'noel',
    market: 'fr',
    slug: 'noel/express',
    name: 'Noël express, dernière minute',
    schedule: { start: '2026-12-15T00:00:00+01:00', end: '2026-12-24T18:00:00+01:00' },
    announcement: { message: 'Expédition prioritaire offerte sur toute la sélection express', countdown: true },
    hero: {
      badge: 'Livraison express',
      title: 'Un oubli ? Votre cadeau sous le sapin en 48 h',
      subtitle: 'Uniquement des articles livrables avant Noël, et une e-carte cadeau instantanée en dernier recours.',
      cta: { label: 'Commander en express', href: '#offres' },
      image: { src: '/images/noel/express-hero.webp', alt: 'Colis cadeau livré devant une porte' },
    },
    featuredOffers: ['nl-coffret-express', 'nl-ecarte'],
    collection: 'noel-express',
    cart: { upsellProductId: 'nl-carte-voeux' },
    leadCapture: { trigger: 'exit-intent', title: 'Toujours pas trouvé ?', incentive: 'Notre sélection express par e-mail' },
    features: {
      orderCutoff: { date: '2026-12-22T12:00:00+01:00', label: 'Commandez avant le 22 décembre midi : livré avant Noël' },
      giftTeaser: true, // e-mail d’aperçu au destinataire si retard (Etsy)
      eGiftCard: true, // la page reste en ligne jusqu’au 24 à 18 h pour les e-cartes
    },
    seo: { title: 'Cadeaux de Noël de dernière minute', description: 'Livraison express 48 h offerte, e-carte cadeau instantanée.' },
    theme: {
      mode: 'dark',
      colors: { bg: '#0F291E', surface: '#183B2B', text: '#FFFFFF', muted: '#B7C9BE', primary: '#D4AF37', primaryHover: '#B5942B', onPrimary: '#000000', accent: '#B3121F', highlight: '#FFFFFF' },
      fonts: { display: 'lora', body: 'inter' },
    },
  },

  // ─── NOUVEL AN (FR) · Noir & Or / Argent / Étincelles
  'nouvel-an-1': {
    id: 'nouvel-an-1',
    event: 'nouvel-an',
    market: 'fr',
    slug: 'nouvel-an',
    name: 'Réveillon du Nouvel An',
    schedule: { start: '2026-12-21T00:00:00+01:00', end: '2026-12-29T23:59:59+01:00' },
    announcement: { message: 'Offres réveillon : livraison garantie avant le 31', countdown: true },
    hero: {
      badge: 'Collection réveillon',
      title: 'Brillez au réveillon, sans vous ruiner',
      subtitle: 'Tenues, accessoires et déco de fête livrés avant le 31 décembre.',
      cta: { label: 'Je prépare mon réveillon', href: '#offres' },
      image: { src: '/images/nouvel-an/hero.webp', alt: 'Tenue de soirée et coupes de champagne' },
    },
    featuredOffers: ['na-pack-soiree', 'na-accessoire'],
    collection: 'nouvel-an-party',
    cart: { upsellProductId: 'na-paillettes' },
    leadCapture: { trigger: 'exit-intent', title: 'Un dernier éclat ?', incentive: '-10 % sur votre commande', promoCode: 'REVEILLON10' },
    features: {
      shopTheLook: [
        { title: 'Le look réveillon en 5 pièces', intro: 'Une tenue complète, prête à porter le 31.', productIds: ['na-look-1'] },
        { title: 'La table de fête', intro: 'Déco et art de la table pour recevoir.', productIds: ['na-deco-table'] },
      ],
      sellingFastBadge: true,
      orderCutoff: { date: '2026-12-29T23:59:59+01:00', label: 'Commandez avant le 29 décembre pour être livré avant le réveillon' },
    },
    seo: { title: 'Réveillon du Nouvel An : tenues et déco', description: 'Tenues et déco de fête livrées avant le 31 décembre.' },
    theme: {
      mode: 'dark',
      colors: { bg: '#0A0A0A', surface: '#151515', text: '#FFFFFF', muted: '#A3A3A3', primary: '#D4AF37', primaryHover: '#B8962E', onPrimary: '#000000', accent: '#C0C0C0', highlight: '#F5E6B8' },
      fonts: { display: 'bodoni', body: 'inter' },
    },
  },
  'nouvel-an-2': {
    id: 'nouvel-an-2',
    event: 'nouvel-an',
    market: 'fr',
    slug: 'nouvel-an/resolution',
    name: 'Résolutions 2027',
    schedule: { start: '2026-12-26T00:00:00+01:00', end: '2027-01-10T23:59:59+01:00' },
    announcement: { message: 'Nouvelle année : -30 % sur la sélection bien-être', countdown: true },
    hero: {
      badge: 'Résolutions 2027',
      title: 'Tenez enfin vos résolutions en 2027',
      subtitle: 'Relevez le Défi 30 jours NovaVault : on vous équipe, on vous récompense.',
      cta: { label: 'Je relève le défi', href: '#defi' },
      image: { src: '/images/nouvel-an/resolution-hero.webp', alt: 'Tapis de yoga et gourde au lever du soleil' },
    },
    featuredOffers: ['na-pack-fitness', 'na-tapis'],
    collection: 'nouvel-an-resolutions',
    cart: { upsellProductId: 'na-gourde' },
    leadCapture: { trigger: 'exit-intent', title: 'Commencez l’année du bon pied', incentive: '-10 % sur votre commande', promoCode: 'NEW2027' },
    features: {
      // Engagement symbolique façon Gymshark66 / Decathlon : le droit de rétractation reste intact
      challenge: {
        name: 'Défi 30 jours NovaVault',
        days: 30,
        reward: 'Un code -15 % sur votre prochaine commande si vous gardez votre achat au-delà du délai de rétractation',
      },
    },
    seo: { title: 'Résolutions 2027 : fitness et bien-être', description: 'Relevez le Défi 30 jours NovaVault, -30 % sur la sélection.' },
    theme: {
      mode: 'dark',
      colors: { bg: '#0A0A0A', surface: '#151515', text: '#FFFFFF', muted: '#A3A3A3', primary: '#C0C0C0', primaryHover: '#A8A8A8', onPrimary: '#000000', accent: '#D4AF37', highlight: '#F5E6B8' },
      fonts: { display: 'bodoni', body: 'inter' },
    },
  },
};

