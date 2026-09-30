import type { Market, Product } from '../../src/types';

/**
 * CATALOGUE DE DÉMONSTRATION — noms, prix et visuels à remplacer en phase 1 (choix des produits).
 * Prix en centimes. compareAtPrice = prix réellement pratiqué avant l’opération (Omnibus / FTC) :
 * ne l’indique que si c’est vrai. Le champ `stock` (jauge « X % réclamés ») est volontairement
 * absent : ne le renseigne qu’avec le stock réel alloué à l’offre.
 */
type Extra = Partial<Omit<Product, 'id' | 'market' | 'name' | 'collection' | 'price' | 'image'>>;

const p = (
  id: string,
  market: Market,
  collection: string,
  name: string,
  price: number,
  compareAtPrice?: number,
  extra: Extra = {},
): Product => ({
    id,
    market,
    collection,
    name,
    price,
    compareAtPrice,
    image: { src: `/images/products/${id}.webp`, alt: name },
    ...extra,
});

export const SEED_PRODUCTS: Product[] = [
  // ─── Halloween — déco & costumes
  p('hw-star', 'fr', 'halloween-deco-costumes', 'Squelette géant articulé 1,8 m', 8900, 12900, {
    description: 'La pièce star de la saison : yeux lumineux, pose ajustable, montage en 10 minutes.',
  }),
  p('hw-pack-deco', 'fr', 'halloween-deco-costumes', 'Pack déco salon hanté', 4900, 7400, {
    description: 'Guirlande, toiles, 3 citrouilles LED et bougies : tout le salon en une commande.',
    bundleOf: [
      { productId: 'hw-guirlande', qty: 1 },
      { productId: 'hw-toiles', qty: 1 },
      { productId: 'hw-citrouilles', qty: 1 },
      { productId: 'hw-bougies', qty: 1 },
    ],
  }),
  p('hw-costume', 'fr', 'halloween-deco-costumes', 'Costume sorcière de minuit', 3490, 4990),
  p('hw-guirlande', 'fr', 'halloween-deco-costumes', 'Guirlande chauves-souris LED', 1490),
  p('hw-citrouilles', 'fr', 'halloween-deco-costumes', 'Lot de 3 citrouilles LED', 1990, 2490),
  p('hw-toiles', 'fr', 'halloween-deco-costumes', 'Toiles d’araignée XXL', 790),
  p('hw-bougies', 'fr', 'halloween-deco-costumes', 'Bougies LED flamme vacillante, lot de 6', 990),

  // ─── Halloween — accessoires
  p('hw-pack-accessoires', 'fr', 'halloween-accessoires', 'Kit accessoires complet', 2990, 4270, {
    description: 'Masque, maquillage, perruque et chapeau : un costume complet en un clic.',
    bundleOf: [
      { productId: 'hw-masque', qty: 1 },
      { productId: 'hw-maquillage', qty: 1 },
      { productId: 'hw-perruque', qty: 1 },
      { productId: 'hw-chapeau', qty: 1 },
    ],
  }),
  p('hw-masque', 'fr', 'halloween-accessoires', 'Masque vénitien noir', 1290, 1690),
  p('hw-maquillage', 'fr', 'halloween-accessoires', 'Palette maquillage effets spéciaux', 890),
  p('hw-perruque', 'fr', 'halloween-accessoires', 'Perruque argentée', 1190),
  p('hw-chapeau', 'fr', 'halloween-accessoires', 'Chapeau de sorcière en feutre', 990),
  p('hw-cape', 'fr', 'halloween-accessoires', 'Cape à capuche velours', 1990, 2490),

  // ─── Thanksgiving (US) — kitchen & table
  p('tg-host-kit-8', 'us', 'thanksgiving-kitchen', 'The Host Kit, a table for 8', 14900, 19900, {
    description: 'Runner, 8 napkins, carving set, gravy boat and pie dish: a full table in one click.',
    serves: 8,
    bundleOf: [
      { productId: 'tg-table-runner', qty: 1 },
      { productId: 'tg-napkins', qty: 2 },
      { productId: 'tg-carving-set', qty: 1 },
      { productId: 'tg-gravy-boat', qty: 1 },
      { productId: 'tg-pie-dish', qty: 1 },
    ],
  }),
  p('tg-dutch-oven', 'us', 'thanksgiving-kitchen', 'Enameled Dutch oven, 6 qt', 8900, 11900, { serves: 8 }),
  p('tg-carving-set', 'us', 'thanksgiving-kitchen', 'Walnut carving set', 5900),
  p('tg-gravy-boat', 'us', 'thanksgiving-kitchen', 'Stoneware gravy boat', 2400),
  p('tg-pie-dish', 'us', 'thanksgiving-kitchen', 'Fluted ceramic pie dish', 2900),
  p('tg-cake-server', 'us', 'thanksgiving-kitchen', 'Brass pie server', 1800),
  p('tg-cooling-rack', 'us', 'thanksgiving-kitchen', 'Stackable cooling racks, set of 3', 2200),
  p('tg-napkins', 'us', 'thanksgiving-kitchen', 'Linen napkins, set of 4', 1900),
  p('tg-table-runner', 'us', 'thanksgiving-kitchen', 'Harvest linen table runner', 3200),

  // ─── Thanksgiving (US) — gifts & cozy
  p('tg-cozy-bundle', 'us', 'thanksgiving-gifts', 'The Cozy Bundle', 7900, 10700, {
    description: 'Knit throw, candle and a pair of stoneware mugs: the perfect hostess gift.',
    bundleOf: [
      { productId: 'tg-throw', qty: 1 },
      { productId: 'tg-candle', qty: 1 },
      { productId: 'tg-mug-set', qty: 1 },
    ],
  }),
  p('tg-throw', 'us', 'thanksgiving-gifts', 'Chunky knit throw', 5900),
  p('tg-candle', 'us', 'thanksgiving-gifts', 'Maple & cedar candle', 2200),
  p('tg-mug-set', 'us', 'thanksgiving-gifts', 'Stoneware mugs, set of 2', 2600),
  p('tg-socks', 'us', 'thanksgiving-gifts', 'Cabin socks, gift box', 1800),

  // ─── Black Friday — high-tech
  p('bf-pack-audio', 'fr', 'black-friday-tech', 'Pack audio : écouteurs + enceinte', 8900, 15800, {
    description: 'Écouteurs à réduction de bruit et enceinte étanche, le duo pour la maison et les trajets.',
    bundleOf: [
      { productId: 'bf-ecouteurs', qty: 1 },
      { productId: 'bf-enceinte', qty: 1 },
    ],
  }),
  p('bf-ecouteurs', 'fr', 'black-friday-tech', 'Écouteurs à réduction de bruit', 4900, 8900),
  p('bf-enceinte', 'fr', 'black-friday-tech', 'Enceinte Bluetooth étanche', 3900, 6900),
  p('bf-montre', 'fr', 'black-friday-tech', 'Montre connectée sport', 5900, 9900),
  p('bf-chargeur', 'fr', 'black-friday-tech', 'Chargeur rapide 65 W', 2490, 3990),
  p('bf-powerbank', 'fr', 'black-friday-tech', 'Batterie externe 20 000 mAh', 1990, 3490),
  p('bf-cable', 'fr', 'black-friday-tech', 'Câble USB-C tressé 2 m', 790),

  // ─── Black Friday — VIP best-sellers
  p('bf-pack-bestseller', 'fr', 'black-friday-bestsellers', 'Pack best-sellers bureau', 6900, 12900, {
    description: 'Lampe LED, trépied et étui : nos trois meilleures ventes de l’année.',
    bundleOf: [
      { productId: 'bf-lampe', qty: 1 },
      { productId: 'bf-trepied', qty: 1 },
      { productId: 'bf-etui', qty: 1 },
    ],
  }),
  p('bf-bestseller', 'fr', 'black-friday-bestsellers', 'Lampe de bureau LED sans fil', 3900, 7900),
  p('bf-lampe', 'fr', 'black-friday-bestsellers', 'Ring light 26 cm', 2490, 4490),
  p('bf-trepied', 'fr', 'black-friday-bestsellers', 'Trépied smartphone extensible', 1990, 3490),
  p('bf-etui', 'fr', 'black-friday-bestsellers', 'Étui de rangement tech', 1290),

  // ─── Cyber Monday — smart home
  p('cm-star', 'fr', 'cyber-monday-smarthome', 'Hub maison connectée', 6900, 11900, {
    description: 'Pilotez lumières, prises et caméras depuis une seule app, à la voix ou à distance.',
  }),
  p('cm-pack-smarthome', 'fr', 'cyber-monday-smarthome', 'Pack démarrage maison connectée', 9900, 17600, {
    description: 'Hub, 2 ampoules et 2 prises : une pièce entièrement connectée en 15 minutes.',
    bundleOf: [
      { productId: 'cm-star', qty: 1 },
      { productId: 'cm-ampoule', qty: 2 },
      { productId: 'cm-prise', qty: 2 },
    ],
  }),
  p('cm-enceinte', 'fr', 'cyber-monday-smarthome', 'Enceinte intelligente', 4900, 7900),
  p('cm-ampoule', 'fr', 'cyber-monday-smarthome', 'Ampoule connectée couleur', 1290, 1990),
  p('cm-prise', 'fr', 'cyber-monday-smarthome', 'Prise connectée avec suivi conso', 1490, 2290),
  p('cm-camera', 'fr', 'cyber-monday-smarthome', 'Caméra intérieure 2K', 3990, 5990),

  // ─── Cyber Monday — produits digitaux
  p('cm-pack-digital', 'fr', 'cyber-monday-digital', 'Pack créateur digital', 4900, 12900, {
    description: 'Formation, e-book et 3 mois d’abonnement : tout pour lancer votre projet en ligne.',
    digital: true,
    bundleOf: [
      { productId: 'cm-formation', qty: 1 },
      { productId: 'cm-ebook', qty: 1 },
      { productId: 'cm-abonnement', qty: 1 },
    ],
  }),
  p('cm-ecarte', 'fr', 'cyber-monday-digital', 'E-carte cadeau NovaVault 50 €', 5000, undefined, { digital: true }),
  p('cm-formation', 'fr', 'cyber-monday-digital', 'Formation vidéo « Lancer sa boutique »', 2900, 7900, { digital: true }),
  p('cm-ebook', 'fr', 'cyber-monday-digital', 'E-book « 50 idées de contenus »', 900, 1900, { digital: true }),
  p('cm-abonnement', 'fr', 'cyber-monday-digital', 'Abonnement outils 3 mois', 1900, 3900, { digital: true }),

  // ─── Noël — guide cadeaux
  p('nl-coffret', 'fr', 'noel-guide-cadeaux', 'Coffret bien-être', 3900, 5200, {
    description: 'Bougie, plaid et thé de Noël, emballé et prêt à offrir.',
    recipients: ['Pour elle', 'Parents', 'Collègues'],
    interests: ['Bien-être', 'Maison'],
    teamNote: 'Celui que j’offre à ma mère cette année.',
    bundleOf: [
      { productId: 'nl-bougie', qty: 1 },
      { productId: 'nl-plaid', qty: 1 },
    ],
  }),
  p('nl-cadeau-20', 'fr', 'noel-guide-cadeaux', 'Carnet en cuir gravé', 1900, undefined, {
    recipients: ['Pour lui', 'Pour elle', 'Collègues', 'Ados'],
    interests: ['Écriture', 'Voyage'],
  }),
  p('nl-plaid', 'fr', 'noel-guide-cadeaux', 'Plaid en laine douce', 3490, undefined, {
    recipients: ['Parents', 'Pour elle'],
    interests: ['Maison', 'Bien-être'],
  }),
  p('nl-casque', 'fr', 'noel-guide-cadeaux', 'Casque audio sans fil', 7900, 9900, {
    recipients: ['Ados', 'Pour lui'],
    interests: ['Musique', 'Tech'],
    teamNote: 'Pour mon petit frère, qui ne quitte jamais sa musique.',
  }),
  p('nl-jeu', 'fr', 'noel-guide-cadeaux', 'Jeu de société familial', 2990, undefined, {
    recipients: ['Enfants', 'Parents', 'Ados'],
    interests: ['Jeux'],
    teamNote: 'Parfait pour l’après-midi du 25.',
  }),
  p('nl-bougie', 'fr', 'noel-guide-cadeaux', 'Bougie parfumée sapin & cannelle', 1490, undefined, {
    recipients: ['Collègues', 'Pour elle'],
    interests: ['Maison'],
  }),
  p('nl-montre', 'fr', 'noel-guide-cadeaux', 'Montre minimaliste', 8900, undefined, {
    recipients: ['Pour lui', 'Pour elle'],
    interests: ['Mode'],
  }),
  p('nl-carnet', 'fr', 'noel-guide-cadeaux', 'Kit dessin pour enfants', 1790, undefined, {
    recipients: ['Enfants'],
    interests: ['Créatif'],
  }),
  p('nl-papier-cadeau', 'fr', 'noel-guide-cadeaux', 'Emballage cadeau premium', 390),

  // ─── Noël — express
  p('nl-coffret-express', 'fr', 'noel-express', 'Coffret gourmand express', 2990, 3790, {
    description: 'Expédié sous 24 h, livré en 48 h, emballage cadeau inclus.',
  }),
  p('nl-chocolats', 'fr', 'noel-express', 'Assortiment de chocolats', 1990),
  p('nl-ecarte', 'fr', 'noel-express', 'E-carte cadeau NovaVault', 3000, undefined, {
    description: 'Envoyée par e-mail en quelques minutes, même le 24 décembre.',
    digital: true,
  }),
  p('nl-carte-voeux', 'fr', 'noel-express', 'Carte de vœux illustrée', 350),

  // ─── Nouvel An — party
  p('na-pack-soiree', 'fr', 'nouvel-an-party', 'Pack soirée : flûtes + déco', 3490, 4870, {
    description: '6 flûtes dorées, guirlande et confettis pour recevoir le 31.',
    bundleOf: [
      { productId: 'na-flutes', qty: 1 },
      { productId: 'na-deco-table', qty: 1 },
    ],
  }),
  p('na-accessoire', 'fr', 'nouvel-an-party', 'Pochette à sequins', 2490, 3490),
  p('na-look-1', 'fr', 'nouvel-an-party', 'Le look réveillon en 5 pièces', 11900, 15500, {
    description: 'Robe, pochette, nœud, boucles et paillettes : la tenue complète.',
    bundleOf: [
      { productId: 'na-robe', qty: 1 },
      { productId: 'na-accessoire', qty: 1 },
      { productId: 'na-noeud', qty: 1 },
      { productId: 'na-paillettes', qty: 1 },
    ],
  }),
  p('na-robe', 'fr', 'nouvel-an-party', 'Robe noire satinée', 6900),
  p('na-noeud', 'fr', 'nouvel-an-party', 'Nœud en velours pour cheveux', 1290),
  p('na-flutes', 'fr', 'nouvel-an-party', 'Flûtes dorées, lot de 6', 2490),
  p('na-deco-table', 'fr', 'nouvel-an-party', 'Kit table de fête noir & or', 2380),
  p('na-paillettes', 'fr', 'nouvel-an-party', 'Paillettes corps & cheveux', 690),

  // ─── Nouvel An — résolutions
  p('na-pack-fitness', 'fr', 'nouvel-an-resolutions', 'Pack Défi 30 jours', 5990, 8570, {
    description: 'Tapis, élastiques et planner : de quoi tenir les 30 premiers jours.',
    bundleOf: [
      { productId: 'na-tapis', qty: 1 },
      { productId: 'na-elastiques', qty: 1 },
      { productId: 'na-planner', qty: 1 },
    ],
  }),
  p('na-tapis', 'fr', 'nouvel-an-resolutions', 'Tapis de yoga antidérapant', 2990, 3990),
  p('na-elastiques', 'fr', 'nouvel-an-resolutions', 'Élastiques de résistance, lot de 5', 1790, 2490),
  p('na-planner', 'fr', 'nouvel-an-resolutions', 'Planner habitudes 2027', 1490),
  p('na-halteres', 'fr', 'nouvel-an-resolutions', 'Haltères réglables 2 × 5 kg', 3990),
  p('na-gourde', 'fr', 'nouvel-an-resolutions', 'Gourde isotherme 750 ml', 1690),
];

