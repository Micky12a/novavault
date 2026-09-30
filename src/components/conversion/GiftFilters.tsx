'use client';

import { useMemo, useState } from 'react';
import ProductCard from '@/components/landing/ProductCard';
import Section from '@/components/ui/Section';
import { typo } from '@/lib/typo';
import type { Product } from '@/types';

/** Idées cadeaux par budget et par destinataire (Nordstrom) */
export default function GiftFilters({ products: all, budgets, recipients }: { products: Product[]; budgets: number[]; recipients: string[] }) {
  const giftable = useMemo(() => all.filter((p) => p.recipients?.length), [all]);
  const [budget, setBudget] = useState<number | null>(null);
  const [recipient, setRecipient] = useState<string | null>(null);
  const list = giftable.filter((p) => (budget === null || p.price <= budget) && (recipient === null || p.recipients?.includes(recipient)));

  const chip = (active: boolean) =>
    `rounded-full border px-4 py-2 text-sm font-medium transition-colors ${active ? 'border-ev-primary bg-ev-primary text-ev-on-primary' : 'border-ev-muted/35 hover:border-ev-primary'}`;

  return (
    <Section id="idees" title="Idées cadeaux par budget">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Budget">
        <button type="button" className={chip(budget === null)} onClick={() => setBudget(null)} aria-pressed={budget === null}>
          Tous les prix
        </button>
        {budgets.map((b) => (
          <button key={b} type="button" className={chip(budget === b)} onClick={() => setBudget(b)} aria-pressed={budget === b}>
            {typo(`Moins de ${b / 100} €`)}
          </button>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Destinataire">
        <button type="button" className={chip(recipient === null)} onClick={() => setRecipient(null)} aria-pressed={recipient === null}>
          Pour tout le monde
        </button>
        {recipients.map((r) => (
          <button key={r} type="button" className={chip(recipient === r)} onClick={() => setRecipient(r)} aria-pressed={recipient === r}>
            {r}
          </button>
        ))}
      </div>
      <div key={`${budget}-${recipient}`} className="fade-up mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
        {list.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {list.length === 0 && <p className="mt-6 text-ev-muted">Aucune idée pour ce filtre. Élargissez le budget.</p>}
    </Section>
  );
}
