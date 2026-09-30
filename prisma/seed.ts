import { PrismaClient } from '@prisma/client';
import { scryptSync, randomBytes } from 'node:crypto';
import { SEED_EVENTS } from './seed-data/events';
import { SEED_PRODUCTS } from './seed-data/products';
import { SEED_LEGAL_PAGES, SEED_SETTINGS } from './seed-data/site';

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
}

async function main() {
  // Événements et réglages : créés s’ils n’existent pas, jamais écrasés (tes modifications admin sont conservées)
  for (const e of Object.values(SEED_EVENTS)) {
    const { id, slug, market, ...rest } = e;
    await prisma.event.upsert({ where: { id }, create: { id, slug, market, data: { id, slug, market, ...rest } }, update: {} });
  }
  for (const [market, data] of Object.entries(SEED_SETTINGS)) {
    await prisma.marketSetting.upsert({ where: { market }, create: { market, data }, update: {} });
  }
  for (const page of SEED_LEGAL_PAGES) {
    await prisma.legalPage.upsert({ where: { slug: page.slug }, create: { ...page }, update: {} });
  }

  let order = 0;
  for (const p of SEED_PRODUCTS) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id: p.id,
        market: p.market,
        collection: p.collection,
        name: p.name,
        description: p.description,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        imageUrl: p.image.src,
        imageAlt: p.image.alt,
        serves: p.serves,
        recipients: p.recipients ?? [],
        interests: p.interests ?? [],
        digital: p.digital ?? false,
        teamNote: p.teamNote,
        bundleOf: p.bundleOf ?? undefined,
        sortOrder: order++,
      },
    });
  }

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (email && password) {
    await prisma.adminUser.upsert({
      where: { email: email.toLowerCase() },
      update: {},
      create: { email: email.toLowerCase(), name: 'Admin', passwordHash: hashPassword(password) },
    });
    console.log(`Compte admin prêt : ${email}`);
  } else {
    console.warn('ADMIN_EMAIL et ADMIN_PASSWORD absents de .env : aucun compte admin créé.');
  }
  console.log('Base initialisée.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
