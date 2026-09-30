'use client';

import { useActionState, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Card, Field, FormMessage, SubmitButton } from '@/components/admin/ui';
import { saveSettings } from '@/app/admin/actions';
import type { MarketSettings } from '@/types';

const ICONS = ['Truck', 'RotateCcw', 'ShieldCheck', 'Headphones', 'Gift'];
const ICON_LABELS: Record<string, string> = { Truck: 'Camion', RotateCcw: 'Retour', ShieldCheck: 'Bouclier', Headphones: 'Casque', Gift: 'Cadeau' };
const PAYMENTS = ['cb', 'visa', 'mastercard', 'amex', 'apple-pay', 'google-pay', 'paypal', 'klarna'];

function MarketSettingsForm({ market, initial }: { market: 'fr' | 'us'; initial: MarketSettings }) {
  const [state, action] = useActionState(saveSettings, null);
  const [s, setS] = useState<MarketSettings>(initial);
  const currency = market === 'us' ? '$' : '€';

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="market" value={market} />
      <input type="hidden" name="data" value={JSON.stringify({ ...s, guarantees: s.guarantees.map((g) => g.trim()).filter(Boolean) })} />

      <Card title="Livraison et paiement">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={`Livraison offerte dès (${currency})`}>
            <input
              inputMode="decimal"
              value={String(s.freeShippingThreshold / 100).replace('.', ',')}
              onChange={(e) => {
                const n = Number(e.target.value.replace(',', '.'));
                if (Number.isFinite(n)) setS({ ...s, freeShippingThreshold: Math.round(n * 100) });
              }}
              className="field w-full"
            />
          </Field>
          <Field label="Texte de la garantie prix">
            <input value={s.priceGuaranteeText} onChange={(e) => setS({ ...s, priceGuaranteeText: e.target.value })} className="field w-full" />
          </Field>
        </div>
        <p className="mb-2 mt-5 text-sm font-medium">Moyens de paiement affichés</p>
        <div className="flex flex-wrap gap-2">
          {PAYMENTS.map((p) => {
            const on = s.paymentMethods.includes(p) || s.bnpl.includes(p);
            return (
              <button
                key={p}
                type="button"
                onClick={() =>
                  p === 'klarna'
                    ? setS({ ...s, bnpl: on ? [] : ['klarna'] })
                    : setS({ ...s, paymentMethods: on ? s.paymentMethods.filter((x) => x !== p) : [...s.paymentMethods, p] })
                }
                className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${on ? 'border-ev-primary bg-ev-primary text-ev-on-primary' : 'border-ev-muted/30'}`}
                aria-pressed={on}
              >
                {p}
              </button>
            );
          })}
        </div>
      </Card>

      <Card title="Garanties (barre de confiance)">
        <Field label="Une garantie par ligne">
          <textarea rows={4} value={s.guarantees.join('\n')} onChange={(e) => setS({ ...s, guarantees: e.target.value.split('\n') })} className="field-area" />
        </Field>
      </Card>

      <Card title="Arguments de vente">
        <ul className="space-y-3">
          {s.usps.map((u, i) => (
            <li key={i} className="grid gap-2 rounded-2xl border border-ev-muted/15 p-3 sm:grid-cols-[9rem_1fr_1.5fr_auto]">
              <select value={u.icon} onChange={(e) => setS({ ...s, usps: s.usps.map((x, j) => (j === i ? { ...x, icon: e.target.value } : x)) })} className="field">
                {ICONS.map((ic) => (
                  <option key={ic} value={ic}>
                    {ICON_LABELS[ic]}
                  </option>
                ))}
              </select>
              <input value={u.title} placeholder="Titre" onChange={(e) => setS({ ...s, usps: s.usps.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)) })} className="field" />
              <input value={u.text} placeholder="Détail" onChange={(e) => setS({ ...s, usps: s.usps.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)) })} className="field" />
              <button type="button" onClick={() => setS({ ...s, usps: s.usps.filter((_, j) => j !== i) })} className="justify-self-end rounded-full p-3 text-ev-muted hover:text-red-400" aria-label="Retirer">
                <Trash2 size={17} />
              </button>
            </li>
          ))}
        </ul>
        <button type="button" onClick={() => setS({ ...s, usps: [...s.usps, { icon: 'Truck', title: '', text: '' }] })} className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-ev-primary">
          <Plus size={16} aria-hidden="true" /> Ajouter un argument
        </button>
      </Card>

      <Card title="FAQ">
        <ul className="space-y-3">
          {s.faq.map((f, i) => (
            <li key={i} className="space-y-2 rounded-2xl border border-ev-muted/15 p-3">
              <div className="flex gap-2">
                <input value={f.q} placeholder="Question" onChange={(e) => setS({ ...s, faq: s.faq.map((x, j) => (j === i ? { ...x, q: e.target.value } : x)) })} className="field min-w-0 flex-1" />
                <button type="button" onClick={() => setS({ ...s, faq: s.faq.filter((_, j) => j !== i) })} className="rounded-full p-3 text-ev-muted hover:text-red-400" aria-label="Retirer">
                  <Trash2 size={17} />
                </button>
              </div>
              <textarea rows={2} value={f.a} placeholder="Réponse" onChange={(e) => setS({ ...s, faq: s.faq.map((x, j) => (j === i ? { ...x, a: e.target.value } : x)) })} className="field-area" />
            </li>
          ))}
        </ul>
        <button type="button" onClick={() => setS({ ...s, faq: [...s.faq, { q: '', a: '' }] })} className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-ev-primary">
          <Plus size={16} aria-hidden="true" /> Ajouter une question
        </button>
      </Card>

      <div className="sticky bottom-20 z-20 flex justify-end md:bottom-6">
        <SubmitButton className="shadow-2xl">Enregistrer {market === 'fr' ? 'la France' : 'les États-Unis'}</SubmitButton>
      </div>
      <FormMessage state={state} />
    </form>
  );
}

export default function SettingsForm({ fr, us }: { fr: MarketSettings; us: MarketSettings }) {
  const [tab, setTab] = useState<'fr' | 'us'>('fr');
  return (
    <>
      <div className="mb-6 inline-flex rounded-full bg-ev-surface p-1" role="tablist">
        {(['fr', 'us'] as const).map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={tab === m}
            onClick={() => setTab(m)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${tab === m ? 'bg-ev-primary text-ev-on-primary' : 'text-ev-muted'}`}
          >
            {m === 'fr' ? 'France' : 'États-Unis'}
          </button>
        ))}
      </div>
      {tab === 'fr' ? <MarketSettingsForm key="fr" market="fr" initial={fr} /> : <MarketSettingsForm key="us" market="us" initial={us} />}
    </>
  );
}
