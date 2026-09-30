'use client';

import { useActionState, useState, type ReactNode } from 'react';
import ImageUploader from '@/components/admin/ImageUploader';
import { Card, Field, FormMessage, SubmitButton } from '@/components/admin/ui';
import { saveEvent } from '@/app/admin/actions';
import { MARKETS } from '@/config/brand';
import { isoToZonedLocal, zonedLocalToIso } from '@/lib/time';
import type { EventConfig, EventFeatures, EventTheme, FontKey } from '@/types';

type Opt = { id: string; name: string; collection: string };

const FONT_LABELS: Record<FontKey, string> = {
  bungee: 'Bungee (ludique)',
  anton: 'Anton (impact)',
  playfair: 'Playfair Display (élégant)',
  lora: 'Lora (classique)',
  spaceGrotesk: 'Space Grotesk (tech)',
  bodoni: 'Bodoni Moda (luxe)',
  inter: 'Inter (neutre)',
};

const COLOR_LABELS: Record<keyof EventTheme['colors'], string> = {
  bg: 'Fond',
  surface: 'Cartes',
  text: 'Texte',
  muted: 'Texte secondaire',
  primary: 'Boutons',
  primaryHover: 'Boutons au survol',
  onPrimary: 'Texte des boutons',
  accent: 'Couleur d’accent',
  highlight: 'Badges et pastilles',
};

const TOGGLES: { key: keyof EventFeatures; label: string; hint: string }[] = [
  { key: 'priceGuarantee', label: 'Garantie prix', hint: 'Remboursement de la différence si le prix baisse' },
  { key: 'stockClaimed', label: 'Jauge « X % réclamés »', hint: 'Seulement sur les produits avec un stock renseigné' },
  { key: 'waitlist', label: 'Liste d’attente', hint: 'Sur les produits épuisés' },
  { key: 'sellingFastBadge', label: 'Badge « Part vite »', hint: 'Quand plus de 60 % du stock est vendu' },
  { key: 'perPersonPricing', label: 'Prix par personne', hint: 'Sur les packs avec un nombre de convives' },
  { key: 'giftFinder', label: 'Quiz cadeau', hint: 'Trois questions pour trouver le bon cadeau' },
  { key: 'teamPicks', label: 'Sélection de l’équipe', hint: 'Produits avec un « mot de l’équipe »' },
  { key: 'giftTeaser', label: 'Aperçu du cadeau par e-mail', hint: 'Proposé dans le panier' },
  { key: 'eGiftCard', label: 'E-carte après la date limite', hint: 'Seuls les produits digitaux restent en vente' },
];

const ADVANCED_KEYS = ['dealDrops', 'earlyAccess', 'shopTheLook', 'giftFilters', 'challenge'] as const;

function Section({ title, children, open = false }: { title: string; children: ReactNode; open?: boolean }) {
  return (
    <details open={open} className="group rounded-3xl border border-ev-muted/15 bg-ev-surface">
      <summary className="flex cursor-pointer list-none items-center justify-between p-5 font-display text-lg sm:p-6 [&::-webkit-details-marker]:hidden">
        {title}
        <span className="grid size-8 place-items-center rounded-full border border-ev-muted/30 transition-transform duration-300 group-open:rotate-45" aria-hidden="true">
          +
        </span>
      </summary>
      <div className="space-y-4 px-5 pb-6 sm:px-6">{children}</div>
    </details>
  );
}

export default function EventForm({ event, products, collections }: { event: EventConfig; products: Opt[]; collections: string[] }) {
  const [state, action] = useActionState(saveEvent, null);
  const [e, setE] = useState<EventConfig>(event);
  const tz = MARKETS[event.market].timezone;
  const [advanced, setAdvanced] = useState(() =>
    JSON.stringify(Object.fromEntries(ADVANCED_KEYS.filter((k) => event.features[k] !== undefined).map((k) => [k, event.features[k]])), null, 2),
  );
  const [advancedError, setAdvancedError] = useState('');

  /** Met à jour une valeur imbriquée : set(['hero', 'title'], 'Nouveau titre') */
  const set = (path: string[], value: unknown) =>
    setE((prev) => {
      const next = structuredClone(prev) as unknown as Record<string, unknown>;
      let obj = next;
      path.slice(0, -1).forEach((k) => {
        obj[k] = { ...((obj[k] as Record<string, unknown>) ?? {}) };
        obj = obj[k] as Record<string, unknown>;
      });
      if (value === undefined) delete obj[path[path.length - 1]];
      else obj[path[path.length - 1]] = value;
      return next as unknown as EventConfig;
    });

  const inCollection = products.filter((p) => p.collection === e.collection);

  // Données envoyées : l’état du formulaire + les réglages avancés s’ils sont valides
  let payload = e;
  try {
    const adv = JSON.parse(advanced || '{}') as Partial<EventFeatures>;
    const features = { ...e.features };
    ADVANCED_KEYS.forEach((k) => delete features[k]);
    const bonuses = features.bonuses?.map((b) => b.trim()).filter(Boolean);
    payload = { ...e, features: { ...features, bonuses: bonuses?.length ? bonuses : undefined, ...adv } };
  } catch {
    /* signalé sous le champ */
  }

  const text = (path: string[], label: string, opts: { hint?: string; area?: boolean; required?: boolean } = {}) => {
    const value = path.reduce<unknown>((o, k) => (o as Record<string, unknown>)?.[k], e) as string | undefined;
    return (
      <Field label={label} hint={opts.hint}>
        {opts.area ? (
          <textarea rows={2} value={value ?? ''} onChange={(ev) => set(path, ev.target.value)} className="field-area" required={opts.required} />
        ) : (
          <input value={value ?? ''} onChange={(ev) => set(path, ev.target.value)} className="field w-full" required={opts.required} />
        )}
      </Field>
    );
  };

  const date = (value: string, onChange: (iso: string) => void, label: string, hint?: string) => (
    <Field label={label} hint={hint}>
      <input type="datetime-local" value={isoToZonedLocal(value, tz)} onChange={(ev) => ev.target.value && onChange(zonedLocalToIso(ev.target.value, tz))} className="field w-full" />
    </Field>
  );

  const productSelect = (value: string | undefined, onChange: (v: string | undefined) => void, label: string, hint?: string, list = products) => (
    <Field label={label} hint={hint}>
      <select value={value ?? ''} onChange={(ev) => onChange(ev.target.value || undefined)} className="field w-full">
        <option value="">Aucun</option>
        {list.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
    </Field>
  );

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="data" value={JSON.stringify(payload)} />

      <Section title="Textes de la page" open>
        {text(['announcement', 'message'], 'Barre d’annonce', { hint: 'Le message qui défile tout en haut', required: true })}
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" checked={e.announcement.countdown} onChange={(ev) => set(['announcement', 'countdown'], ev.target.checked)} className="size-5 accent-[var(--ev-primary)]" />
          Afficher le compte à rebours dans la barre
        </label>
        {text(['hero', 'badge'], 'Pastille au-dessus du titre')}
        {text(['hero', 'title'], 'Grand titre (H1)', { hint: 'Axé sur le bénéfice client', area: true, required: true })}
        {text(['hero', 'subtitle'], 'Sous-titre', { area: true })}
        <div className="grid gap-4 sm:grid-cols-2">
          {text(['hero', 'cta', 'label'], 'Texte du bouton')}
          {text(['hero', 'cta', 'href'], 'Lien du bouton', { hint: '#offres pour descendre aux offres' })}
        </div>
        <div className="grid gap-4 sm:grid-cols-[14rem_1fr]">
          <Field label="Visuel du hero">
            <ImageUploader defaultValue={e.hero.image.src} folder="heros" onChange={(url) => set(['hero', 'image', 'src'], url)} />
          </Field>
          {text(['hero', 'image', 'alt'], 'Description du visuel', { hint: 'Pour l’accessibilité et Google' })}
        </div>
      </Section>

      <Section title="Dates">
        <p className="text-sm text-ev-muted">Heures de {tz === 'Europe/Paris' ? 'Paris' : 'New York'}.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {date(e.schedule.start, (iso) => set(['schedule', 'start'], iso), 'Ouverture de la page')}
          {date(e.schedule.end, (iso) => set(['schedule', 'end'], iso), 'Fin de l’opération')}
        </div>
        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={!!e.features.orderCutoff}
            onChange={(ev) => set(['features', 'orderCutoff'], ev.target.checked ? { date: e.schedule.end, label: '' } : undefined)}
            className="size-5 accent-[var(--ev-primary)]"
          />
          Date limite de commande pour être livré à temps
        </label>
        {e.features.orderCutoff && (
          <div className="grid gap-4 sm:grid-cols-2">
            {date(e.features.orderCutoff.date, (iso) => set(['features', 'orderCutoff', 'date'], iso), 'Date limite')}
            {text(['features', 'orderCutoff', 'label'], 'Message affiché', { hint: 'Ex. : Commandez avant le 20 décembre pour être livré avant Noël' })}
          </div>
        )}
      </Section>

      <Section title="Produits et offres">
        <Field label="Collection affichée dans la grille">
          <select value={e.collection} onChange={(ev) => set(['collection'], ev.target.value)} className="field w-full">
            {collections.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          {productSelect(e.featuredOffers[0], (v) => set(['featuredOffers'], [v, e.featuredOffers[1]].filter(Boolean)), 'Offre vedette principale', 'Mise en avant avec la bordure lumineuse')}
          {productSelect(e.featuredOffers[1], (v) => set(['featuredOffers'], [e.featuredOffers[0], v].filter(Boolean)), 'Deuxième offre')}
          {productSelect(e.features.heroProductId, (v) => set(['features', 'heroProductId'], v), 'Pièce star dans le hero', 'Optionnel')}
          {productSelect(e.cart.upsellProductId, (v) => set(['cart', 'upsellProductId'], v), 'Suggestion dans le panier', 'Un petit article à ajouter en un clic', inCollection)}
        </div>
      </Section>

      <Section title="Pop-up e-mail">
        <Field label="Déclenchement">
          <select value={e.leadCapture.trigger} onChange={(ev) => set(['leadCapture', 'trigger'], ev.target.value)} className="field w-full">
            <option value="exit-intent">Quand le visiteur s’apprête à partir</option>
            <option value="entry">Quelques secondes après l’arrivée</option>
          </select>
        </Field>
        {text(['leadCapture', 'title'], 'Titre')}
        {text(['leadCapture', 'incentive'], 'Ce que le visiteur reçoit')}
        {text(['leadCapture', 'promoCode'], 'Code promo', { hint: 'À créer aussi dans Stripe. Vide si pas de code.' })}
      </Section>

      <Section title="Mécaniques de conversion">
        <div className="grid gap-3 sm:grid-cols-2">
          {TOGGLES.map((t) => (
            <label key={t.key} className="flex items-start gap-3 rounded-2xl border border-ev-muted/15 p-3">
              <input
                type="checkbox"
                checked={!!e.features[t.key]}
                onChange={(ev) => set(['features', t.key], ev.target.checked ? true : undefined)}
                className="mt-0.5 size-5 shrink-0 accent-[var(--ev-primary)]"
              />
              <span>
                <span className="block text-sm font-medium">{t.label}</span>
                <span className="block text-xs text-ev-muted">{t.hint}</span>
              </span>
            </label>
          ))}
        </div>
        <Field label="Bonus affichés sous l’offre" hint="Un par ligne">
          <textarea
            rows={3}
            value={(e.features.bonuses ?? []).join('\n')}
            onChange={(ev) => set(['features', 'bonuses'], ev.target.value ? ev.target.value.split('\n') : undefined)}
            className="field-area"
          />
        </Field>
      </Section>

      <Section title="Apparence">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {(Object.keys(COLOR_LABELS) as (keyof EventTheme['colors'])[]).map((k) => (
            <label key={k} className="flex items-center gap-3 rounded-2xl border border-ev-muted/15 p-2.5">
              <input type="color" value={e.theme.colors[k]} onChange={(ev) => set(['theme', 'colors', k], ev.target.value.toUpperCase())} className="size-9 shrink-0 cursor-pointer rounded-lg border-0 bg-transparent" />
              <span className="text-sm">{COLOR_LABELS[k]}</span>
            </label>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Police des titres">
            <select value={e.theme.fonts.display} onChange={(ev) => set(['theme', 'fonts', 'display'], ev.target.value)} className="field w-full">
              {Object.entries(FONT_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Police du texte">
            <select value={e.theme.fonts.body} onChange={(ev) => set(['theme', 'fonts', 'body'], ev.target.value)} className="field w-full">
              {Object.entries(FONT_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Ambiance">
            <select value={e.theme.mode} onChange={(ev) => set(['theme', 'mode'], ev.target.value)} className="field w-full">
              <option value="dark">Sombre</option>
              <option value="light">Claire</option>
            </select>
          </Field>
        </div>
        <div className="rounded-2xl p-5" style={{ background: e.theme.colors.bg, color: e.theme.colors.text }}>
          <p className="text-sm" style={{ color: e.theme.colors.muted }}>
            Aperçu
          </p>
          <p className="mt-1 text-2xl font-bold">{e.hero.title}</p>
          <span className="mt-3 inline-block rounded-full px-5 py-2.5 text-sm font-semibold" style={{ background: e.theme.colors.primary, color: e.theme.colors.onPrimary }}>
            {e.hero.cta.label}
          </span>
          <span className="ml-2 inline-block rounded-full px-2 py-0.5 text-xs font-bold" style={{ background: e.theme.colors.highlight, color: e.theme.colors.bg }}>
            −30 %
          </span>
        </div>
      </Section>

      <Section title="Référencement (Google)">
        {text(['seo', 'title'], 'Titre dans Google', { hint: '60 caractères maximum' })}
        {text(['seo', 'description'], 'Description dans Google', { hint: '155 caractères maximum', area: true })}
      </Section>

      <Section title="Réglages avancés">
        <p className="text-sm text-ev-muted">
          Vagues d’offres, accès anticipé, looks, filtres cadeaux et défi, au format JSON. Modifie les valeurs entre guillemets sans toucher à la structure.
        </p>
        <textarea
          rows={14}
          value={advanced}
          onChange={(ev) => {
            setAdvanced(ev.target.value);
            try {
              JSON.parse(ev.target.value || '{}');
              setAdvancedError('');
            } catch {
              setAdvancedError('Format invalide : vérifie les guillemets, virgules et accolades.');
            }
          }}
          spellCheck={false}
          className="field-area font-mono text-xs"
        />
        {advancedError && <p className="text-sm text-red-400">{advancedError}</p>}
      </Section>

      <div className="sticky bottom-20 z-20 flex justify-end md:bottom-6">
        <SubmitButton className="shadow-2xl">Enregistrer la page</SubmitButton>
      </div>
      <FormMessage state={state} />
    </form>
  );
}
