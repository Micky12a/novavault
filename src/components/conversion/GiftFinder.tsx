'use client';

import { useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import ProductCard from '@/components/landing/ProductCard';
import Reveal from '@/components/ui/Reveal';
import Section from '@/components/ui/Section';
import { typo } from '@/lib/typo';
import type { Product } from '@/types';

type Answers = { recipient?: string; budget?: number; interest?: string };

/** Quiz cadeau en 3 questions (Etsy Gift Mode, Uncommon Goods), avec barre de progression */
export default function GiftFinder({ products: all, budgets = [2000, 5000, 10000] }: { products: Product[]; budgets?: number[] }) {
  const products = useMemo(() => all.filter((p) => p.recipients?.length), [all]);
  const recipients = useMemo(() => [...new Set(products.flatMap((p) => p.recipients ?? []))], [products]);
  const interests = useMemo(() => [...new Set(products.flatMap((p) => p.interests ?? []))], [products]);
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Answers>({});

  const results = useMemo(() => {
    const match = (p: Product, withInterest: boolean) =>
      (!a.recipient || p.recipients?.includes(a.recipient)) && (!a.budget || p.price <= a.budget) && (!withInterest || !a.interest || p.interests?.includes(a.interest));
    const exact = products.filter((p) => match(p, true));
    return exact.length ? exact : products.filter((p) => match(p, false));
  }, [products, a]);

  const choose = (patch: Answers) => {
    setA((prev) => ({ ...prev, ...patch }));
    setStep((s) => s + 1);
  };

  const Choice = ({ label, onClick }: { label: string; onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl border border-ev-muted/30 bg-ev-bg px-5 py-4 text-left font-medium transition-[border-color,transform,background-color] duration-200 hover:-translate-y-0.5 hover:border-ev-primary hover:bg-ev-surface active:scale-[0.98]"
    >
      {label}
    </button>
  );

  const questions = [typo('Pour qui ?'), typo('Quel budget ?'), typo('Ce qui lui plaît ?')];

  return (
    <Section id="gift-finder" title="Le bon cadeau en 3 questions">
      <div className="rounded-3xl bg-ev-surface p-5 sm:p-8">
        <div className="flex items-center gap-2" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${i < step ? 'bg-ev-primary' : 'bg-ev-muted/25'}`} />
          ))}
        </div>

        {step < 3 && (
          <fieldset key={step} className="fade-up mt-6">
            <legend className="font-display text-2xl sm:text-3xl">{questions[step]}</legend>
            <p className="mt-1 text-sm text-ev-muted">Question {step + 1} sur 3</p>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {step === 0 && recipients.map((r) => <Choice key={r} label={r} onClick={() => choose({ recipient: r })} />)}
              {step === 1 && (
                <>
                  {budgets.map((b) => (
                    <Choice key={b} label={typo(`Moins de ${b / 100} €`)} onClick={() => choose({ budget: b })} />
                  ))}
                  <Choice label="Pas de limite" onClick={() => choose({ budget: undefined })} />
                </>
              )}
              {step === 2 && (
                <>
                  {interests.map((i) => (
                    <Choice key={i} label={i} onClick={() => choose({ interest: i })} />
                  ))}
                  <Choice label="Surprenez-moi" onClick={() => choose({ interest: undefined })} />
                </>
              )}
            </div>
          </fieldset>
        )}

        {step === 3 && (
          <div className="mt-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-display text-2xl">{results.length ? `${results.length} idée${results.length > 1 ? 's' : ''} pour vous` : 'Aucune idée dans ce budget pour l’instant'}</p>
              <button type="button" onClick={() => (setA({}), setStep(0))} className="inline-flex items-center gap-2 text-sm underline underline-offset-4">
                <RotateCcw size={15} aria-hidden="true" />
                Recommencer
              </button>
            </div>
            <Reveal className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {results.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </Reveal>
          </div>
        )}
      </div>
    </Section>
  );
}
