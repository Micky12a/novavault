'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { createSession, destroySession, requireAdmin, verifyPassword } from '@/lib/auth';
import { db } from '@/lib/db';
import type { EventConfig, MarketSettings } from '@/types';

export type ActionState = { ok: boolean; message: string } | null;

const ok = (message: string): ActionState => ({ ok: true, message });
const fail = (message: string): ActionState => ({ ok: false, message });

/** Rafraîchit tout le site public après une modification */
function refreshSite() {
  revalidatePath('/', 'layout');
}

/** "39,90" ou "39.90" → 3990 centimes */
function toCents(v: FormDataEntryValue | null): number | null {
  const s = String(v ?? '').trim().replace(/\s/g, '').replace(',', '.');
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) && n >= 0 ? Math.round(n * 100) : NaN;
}

const intOrNull = (v: FormDataEntryValue | null) => {
  const s = String(v ?? '').trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isInteger(n) && n >= 0 ? n : NaN;
};

const list = (v: FormDataEntryValue | null) =>
  String(v ?? '')
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);

/* ─── Connexion ─────────────────────────────────────────────── */

export async function login(_: ActionState, form: FormData): Promise<ActionState> {
  const email = String(form.get('email') ?? '').trim().toLowerCase();
  const password = String(form.get('password') ?? '');
  const user = email ? await db.adminUser.findUnique({ where: { email } }) : null;
  if (!user || !verifyPassword(password, user.passwordHash)) return fail('E-mail ou mot de passe incorrect.');
  await createSession(user.id);
  redirect('/admin');
}

export async function logout() {
  await destroySession();
  redirect('/admin/login');
}

/* ─── Produits ─────────────────────────────────────────────── */

const productSchema = z.object({
  id: z.string().trim().regex(/^[a-z0-9-]{2,64}$/, 'Identifiant : lettres minuscules, chiffres et tirets.'),
  market: z.enum(['fr', 'us']),
  collection: z.string().trim().min(1, 'Choisis une collection.'),
  name: z.string().trim().min(2, 'Le nom est trop court.').max(140),
  description: z.string().trim().max(600).optional(),
  imageUrl: z.string().trim().min(1, 'Ajoute une photo.'),
  imageAlt: z.string().trim().min(2, 'Décris la photo en quelques mots (accessibilité et SEO).'),
  teamNote: z.string().trim().max(200).optional(),
});

export async function saveProduct(_: ActionState, form: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = productSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? 'Formulaire incomplet.');

  const price = toCents(form.get('price'));
  const compareAtPrice = toCents(form.get('compareAtPrice'));
  if (price === null || Number.isNaN(price)) return fail('Indique un prix valide, par exemple 39,90.');
  if (compareAtPrice !== null && (Number.isNaN(compareAtPrice) || compareAtPrice <= price)) {
    return fail('Le prix barré doit être supérieur au prix de vente, ou rester vide.');
  }
  const serves = intOrNull(form.get('serves'));
  const stockAllocated = intOrNull(form.get('stockAllocated'));
  const stockSold = intOrNull(form.get('stockSold'));
  const sortOrder = intOrNull(form.get('sortOrder')) ?? 0;
  if ([serves, stockAllocated, stockSold, sortOrder].some((n) => Number.isNaN(n))) return fail('Les nombres doivent être des entiers positifs.');

  let bundleOf: { productId: string; qty: number }[] | null = null;
  try {
    const raw = JSON.parse(String(form.get('bundleOf') || '[]')) as { productId: string; qty: number }[];
    bundleOf = raw.filter((b) => b.productId && b.qty > 0);
    if (bundleOf.length === 0) bundleOf = null;
  } catch {
    return fail('La composition du pack est invalide.');
  }

  const d = parsed.data;
  const isNew = form.get('isNew') === '1';
  if (isNew && (await db.product.findUnique({ where: { id: d.id } }))) return fail('Cet identifiant existe déjà. Choisis-en un autre.');

  const data = {
    market: d.market,
    collection: d.collection,
    name: d.name,
    description: d.description || null,
    price,
    compareAtPrice,
    imageUrl: d.imageUrl,
    imageAlt: d.imageAlt,
    serves: serves as number | null,
    stockAllocated: stockAllocated as number | null,
    stockSold: stockAllocated ? ((stockSold as number | null) ?? 0) : null,
    recipients: list(form.get('recipients')),
    interests: list(form.get('interests')),
    digital: form.get('digital') === 'on',
    teamNote: d.teamNote || null,
    bundleOf: bundleOf ?? Prisma.DbNull,
    active: form.get('active') === 'on',
    sortOrder: sortOrder as number,
  };

  if (isNew) await db.product.create({ data: { id: d.id, ...data } });
  else await db.product.update({ where: { id: d.id }, data });

  refreshSite();
  if (isNew) redirect(`/admin/produits/${d.id}?cree=1`);
  return ok('Produit enregistré. Le site est à jour.');
}

export async function deleteProduct(form: FormData) {
  await requireAdmin();
  const id = String(form.get('id'));
  await db.product.delete({ where: { id } });
  refreshSite();
  redirect('/admin/produits');
}

/* ─── Événements ─────────────────────────────────────────────── */

export async function saveEvent(_: ActionState, form: FormData): Promise<ActionState> {
  await requireAdmin();
  let e: EventConfig;
  try {
    e = JSON.parse(String(form.get('data'))) as EventConfig;
  } catch {
    return fail('Les données de l’événement sont illisibles. Vérifie les réglages avancés.');
  }
  const existing = await db.event.findUnique({ where: { id: e.id } });
  if (!existing) return fail('Événement introuvable.');
  if (!e.hero?.title?.trim() || !e.announcement?.message?.trim()) return fail('Le titre du hero et le message de la barre d’annonce sont obligatoires.');
  if (new Date(e.schedule.end) <= new Date(e.schedule.start)) return fail('La date de fin doit être après la date de début.');

  // L’identifiant, l’adresse et le marché ne changent jamais depuis l’admin
  const prev = existing.data as unknown as EventConfig;
  const data = { ...e, id: prev.id, slug: prev.slug, market: prev.market, event: prev.event };
  await db.event.update({ where: { id: e.id }, data: { data: data as object } });
  refreshSite();
  return ok('Événement enregistré. La page est à jour.');
}

/* ─── Réglages ─────────────────────────────────────────────── */

export async function saveSettings(_: ActionState, form: FormData): Promise<ActionState> {
  await requireAdmin();
  const market = String(form.get('market'));
  if (market !== 'fr' && market !== 'us') return fail('Marché inconnu.');
  let data: MarketSettings;
  try {
    data = JSON.parse(String(form.get('data'))) as MarketSettings;
  } catch {
    return fail('Réglages illisibles.');
  }
  if (!Number.isInteger(data.freeShippingThreshold) || data.freeShippingThreshold < 0) return fail('Seuil de livraison offerte invalide.');
  await db.marketSetting.upsert({ where: { market }, create: { market, data: data as object }, update: { data: data as object } });
  refreshSite();
  return ok('Réglages enregistrés.');
}

/* ─── Pages légales ─────────────────────────────────────────── */

export async function saveLegalPage(_: ActionState, form: FormData): Promise<ActionState> {
  await requireAdmin();
  const slug = String(form.get('slug'));
  const title = String(form.get('title') ?? '').trim();
  const body = String(form.get('body') ?? '');
  if (!title) return fail('Le titre est obligatoire.');
  await db.legalPage.update({ where: { slug }, data: { title, body } });
  refreshSite();
  return ok('Page enregistrée.');
}

/* ─── Avis clients (réels uniquement) ───────────────────────── */

export async function saveReview(_: ActionState, form: FormData): Promise<ActionState> {
  await requireAdmin();
  if (form.get('genuine') !== 'on') return fail('Confirme qu’il s’agit d’un avis réel reçu d’un client.');
  const author = String(form.get('author') ?? '').trim();
  const text = String(form.get('text') ?? '').trim();
  const rating = Number(form.get('rating'));
  if (author.length < 2 || text.length < 10) return fail('Indique le prénom du client et un avis d’au moins 10 caractères.');
  if (!(rating >= 1 && rating <= 5)) return fail('Note entre 1 et 5.');
  await db.review.create({
    data: {
      author,
      text,
      rating,
      collection: String(form.get('collection') || '') || null,
      photoUrl: String(form.get('photoUrl') || '') || null,
      verified: form.get('verified') === 'on',
    },
  });
  refreshSite();
  return ok('Avis ajouté.');
}

export async function toggleReview(form: FormData) {
  await requireAdmin();
  const id = String(form.get('id'));
  const r = await db.review.findUnique({ where: { id } });
  if (r) await db.review.update({ where: { id }, data: { published: !r.published } });
  refreshSite();
}

export async function deleteReview(form: FormData) {
  await requireAdmin();
  await db.review.delete({ where: { id: String(form.get('id')) } });
  refreshSite();
}

export async function deleteSubscriber(form: FormData) {
  await requireAdmin();
  await db.subscriber.delete({ where: { id: String(form.get('id')) } });
  revalidatePath('/admin/inscrits');
}
