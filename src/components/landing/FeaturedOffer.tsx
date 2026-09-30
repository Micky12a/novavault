import Image from 'next/image';
import { BadgeCheck, Check } from 'lucide-react';
import AddToCartButton from '@/components/cart/AddToCartButton';
import Countdown from '@/components/ui/Countdown';
import Price from '@/components/ui/Price';
import Reveal from '@/components/ui/Reveal';
import Section from '@/components/ui/Section';
import { savingsPercent, t } from '@/lib/market';
import type { Product } from '@/types';

/**
 * Bloc 4 : l’offre principale en vedette (bordure lumineuse, pastille d’économie),
 * l’alternative à côté. Minuteur, bouton et garantie dans le même écran.
 */
export default function FeaturedOffer({
  products,
  bundleContents,
  lang,
  perPersonPricing,
  bonuses,
  priceGuarantee,
  endDate,
}: {
  products: Product[];
  bundleContents: Record<string, Product[]>;
  lang: 'fr' | 'en';
  perPersonPricing?: boolean;
  bonuses?: string[];
  priceGuarantee?: string;
  endDate: string;
}) {
  const fr = lang === 'fr';
  if (products.length === 0) return null;

  return (
    <Section
      id={fr ? 'offres' : 'offers'}
      title={fr ? 'Les offres du moment' : 'Today’s best deals'}
      aside={<Countdown target={endDate} className="rounded-full bg-ev-surface px-4 py-2 text-sm font-semibold" />}
    >
      <Reveal className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
        {products.map((p, i) => {
          const pct = savingsPercent(p.price, p.compareAtPrice);
          const contents = bundleContents[p.id] ?? [];
          const main = i === 0;
          return (
            <article
              key={p.id}
              data-product-card
              className={`group flex flex-col gap-5 rounded-3xl bg-ev-surface p-5 sm:p-6 ${main ? 'spotlight sm:flex-row' : ''}`}
            >
              <div className={`relative shrink-0 overflow-hidden rounded-2xl ${main ? 'sm:w-1/2' : ''}`}>
                <Image
                  src={p.image.src}
                  alt={p.image.alt}
                  width={720}
                  height={720}
                  sizes="(min-width: 1024px) 30vw, 100vw"
                  className="aspect-square w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                />
                {pct && (
                  <span className="absolute right-3 top-3 grid size-20 rotate-12 place-items-center rounded-full bg-ev-highlight text-center font-display text-xl leading-none text-ev-bg shadow-lg">
                    {t(p.market).youSave(pct)}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col">
                {p.bundleOf && <p className="text-sm font-semibold text-ev-highlight">{fr ? 'Pack' : 'Bundle'}</p>}
                <h3 className={`font-display leading-tight ${main ? 'text-3xl' : 'text-2xl'}`}>{p.name}</h3>
                {p.description && <p className="mt-2 text-ev-muted">{p.description}</p>}
                {contents.length > 0 && (
                  <ul className="mt-3 space-y-1 text-sm">
                    {contents.map((c) => (
                      <li key={c.id} className="flex items-center gap-2">
                        <Check size={15} aria-hidden="true" className="shrink-0 text-ev-highlight" />
                        {c.name}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-auto pt-5">
                  <Price product={p} perPerson={perPersonPricing} size="lg" />
                  <AddToCartButton products={[p]} className="mt-4 w-full sm:w-auto" />
                </div>
              </div>
            </article>
          );
        })}
      </Reveal>

      {(bonuses?.length || priceGuarantee) && (
        <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-2 rounded-2xl border border-ev-muted/20 px-5 py-4 text-sm">
          {bonuses?.map((b) => (
            <li key={b} className="flex items-center gap-2">
              <Check size={16} aria-hidden="true" className="text-ev-highlight" />
              {b}
            </li>
          ))}
          {priceGuarantee && (
            <li className="flex items-center gap-2">
              <BadgeCheck size={16} aria-hidden="true" className="text-ev-highlight" />
              {priceGuarantee}
            </li>
          )}
        </ul>
      )}
    </Section>
  );
}
