# NovaVault

Site e-commerce saisonnier Q4 (getnovavault.com) : 12 landing pages (Halloween, Thanksgiving US, Black Friday, Cyber Monday, Noël, Nouvel An) et un espace admin installable comme une application sur ordinateur et téléphone.

Stack : Next.js 16, React 19, TypeScript, Tailwind CSS 4, Prisma + PostgreSQL (Neon), Vercel Blob pour les photos. Hébergement Vercel.

## Installation (Windows, PowerShell)

### 1. Créer la base de données (Neon, gratuit)

1. Crée un compte sur neon.tech, puis un projet `novavault` (région Europe, Francfort).
2. Bouton **Connect** : copie la chaîne **pooled** (elle contient `-pooler`) pour `DATABASE_URL`, puis décoche « Connection pooling » et copie la seconde pour `DIRECT_URL`.

### 2. Créer le stockage des photos (Vercel Blob)

1. Sur vercel.com, importe le dépôt GitHub du projet (ou crée un projet vide).
2. Onglet **Storage** > **Create** > **Blob** > nomme-le `novavault-photos` et relie-le au projet.
3. Onglet **.env.local** du store : copie `BLOB_READ_WRITE_TOKEN`.

### 3. Configurer le projet

```powershell
Copy-Item .env.example .env
notepad .env
```

Remplis `DATABASE_URL`, `DIRECT_URL`, `BLOB_READ_WRITE_TOKEN`, `ADMIN_EMAIL` et `ADMIN_PASSWORD` (long et unique), puis enregistre.

### 4. Installer et lancer

```powershell
npm install
npm run db:push
npm run db:seed
npm run dev
```

- `db:push` crée les tables dans Neon.
- `db:seed` charge les 12 pages, les 77 produits de démonstration, les réglages et ton compte admin. Relancer la commande ne remplace jamais ce que tu as modifié dans l’admin.
- Site : http://localhost:3000, admin : http://localhost:3000/admin

## L’espace admin

| Rubrique | Ce que tu y fais |
|---|---|
| Accueil | Commandes, inscrits de la semaine, état des 12 pages |
| Produits | Créer, modifier, masquer ou supprimer ; photo glissée ou prise au téléphone, convertie automatiquement en WebP de moins de 200 Ko ; packs ; stock pour la jauge « X % réclamés » |
| Événements | Textes, dates (heure de Paris ou de New York), offres vedettes, pop-up, mécaniques, couleurs et polices avec aperçu, SEO |
| Commandes | Remplies automatiquement par Stripe (à brancher) |
| Inscrits | Tous les e-mails collectés, filtre par source, export CSV pour Excel |
| Avis clients | Avis réels uniquement (case de confirmation obligatoire) ; la note moyenne s’affiche à partir de 5 avis vérifiés |
| Réglages | Livraison offerte, garanties, arguments de vente, FAQ, moyens de paiement, par marché |
| Pages légales | CGV, mentions légales, retours, confidentialité (FR et EN) |

Chaque enregistrement met le site à jour immédiatement.

### Installer l’app admin

- **Ordinateur (Chrome ou Edge)** : ouvre /admin, clique sur « Installer l’app » en haut à droite (ou l’icône d’installation dans la barre d’adresse).
- **Android (Chrome)** : ouvre /admin, touche « Installer l’app ».
- **iPhone et iPad (Safari)** : ouvre /admin, touche « Installer l’app » pour le mode d’emploi : Partager, puis « Sur l’écran d’accueil ».

L’installation fonctionne sur le site en ligne (HTTPS) et sur http://localhost. Sur un téléphone, installe-la depuis https://getnovavault.com/admin.

### Ajouter un autre administrateur

Pour l’instant via Prisma Studio : `npm run db:studio`, table AdminUser. Le plus simple : changer `ADMIN_EMAIL` et `ADMIN_PASSWORD` dans `.env` puis relancer `npm run db:seed`.

## Mise en ligne (Vercel)

1. Pousse le code sur GitHub (compte Micky12a).
2. Vercel > Add New > Project > importe le dépôt.
3. Settings > Environment Variables : ajoute toutes les variables de `.env` (le Blob est déjà relié).
4. Deploy, puis Settings > Domains > `getnovavault.com` et suis les instructions DNS.
5. Avant l’ouverture de Halloween (15 octobre), passe `NEXT_PUBLIC_SHOW_ALL_EVENTS` à `false` et redéploie : chaque page ne s’affichera alors qu’à ses dates.

Le build lit la base de données : la base doit être créée et remplie (étapes 1 à 4) avant le premier déploiement.

## Adresses des pages

| Marché | Pages |
|---|---|
| France | /halloween, /halloween/deals, /black-friday, /black-friday/vip, /cyber-monday, /cyber-monday/deals, /noel, /noel/express, /nouvel-an, /nouvel-an/resolution |
| États-Unis | /thanksgiving, /thanksgiving/deals |

Avant l’ouverture, une page affiche un teaser avec compte à rebours et liste d’attente. Après la fin, elle renvoie vers l’opération suivante.

## Structure

```
prisma/
  schema.prisma          Tables : Event, Product, MarketSetting, LegalPage, Review, Subscriber, Order, AdminUser
  seed.ts, seed-data/    Contenu initial
src/
  app/(site)/            Site public
  app/admin/             Admin, manifeste et service worker de l’app
  app/api/               Inscriptions, envoi de photos
  components/            landing, conversion, cart, effects (ambiances animées), admin
  lib/data.ts            Lecture de la base, typographie française appliquée à l’affichage
```

## Règles de contenu

- Aucun emoji et aucun tiret long dans les textes visibles.
- En français, les espaces insécables avant « : ; ! ? % € » et dans les guillemets sont ajoutées automatiquement : écris normalement dans l’admin.
- Prix barré : uniquement un prix réellement pratiqué avant l’offre (règle Omnibus).
- Avis : uniquement de vrais clients. Les faux avis sont interdits (DGCCRF en France, FTC aux États-Unis) et exposent aussi à la suspension des comptes publicitaires.

## Prochaines étapes

1. Paiement Stripe Checkout (Apple Pay, Google Pay, PayPal, Klarna, codes promo) et webhook qui remplit les commandes.
2. E-mails Resend : confirmation de commande, code de la pop-up, aperçu cadeau, liste d’attente, demande d’avis après livraison. Domaine vérifié (SPF, DKIM, DMARC).
3. Événements de conversion des pixels (ajout au panier, début de paiement, achat).
4. Contenu réel : produits, photos, FAQ, pages légales, délais et droits de douane pour les États-Unis.
5. Recette du 10 au 15 octobre, sur téléphone en priorité.
