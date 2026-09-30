'use client';

import Image from 'next/image';
import { useState, type FormEvent } from 'react';
import { Bell, Check } from 'lucide-react';
import AddToCartButton from '@/components/cart/AddToCartButton';
import Price from '@/components/ui/Price';
import { savingsPercent, t } from '@/lib/market';
import type { Product } from '@/types';

/** Fiche produit : zoom au survol, ajout rapide qui s’envole vers le panier, jauge et badges sur données réelles */
export default function ProductCard({
  product,
  stockClaimed,
  sellingFastBadge,
  waitlist,
  perPerson,
  note,
}: {
  product: Product;
  stockClaimed?: boolean;
  sellingFastBadge?: boolean;
  waitlist?: boolean;
  perPerson?: boolean;
  note?: string;
}) {
  const ui = t(product.market);
  const fr = product.market === 'fr';
  const pct = savingsPercent(product.price, product.compareAtPrice);
  const stock = product.stock;
  const claimedPct = stock ? Math.min(100, Math.round((stock.sold / stock.allocated) * 100)) : null;
  const soldOut = claimedPct !== null && claimedPct >= 100;
  const sellingFast = sellingFastBadge && claimedPct !== null && claimedPct >= 60 && !soldOut;

  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);

  async function joinWaitlist(e: FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, source: 'waitlist', productId: product.id }),
    });
    if (res.ok) setJoined(true);
  }

  return (
    <article data-product-card className="group flex flex-col rounded-2xl bg-ev-surface p-2.5 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-3">
      <div className="relative overflow-hidden rounded-xl">
        <Image
          src={product.image.src}
          alt={product.image.alt}
          width={600}
          height={600}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className={`aspect-square w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 ${soldOut ? 'opacity-40 grayscale' : ''}`}
        />
        <div className="absolute left-2 top-2 flex flex-col items-start gap-1">
          {pct && <span className="rounded-full bg-ev-highlight px-2 py-0.5 text-xs font-bold text-ev-bg">{ui.youSave(pct)}</span>}
          {sellingFast && <span className="rounded-full bg-ev-primary px-2 py-0.5 text-xs font-bold text-ev-on-primary">{ui.sellingFast}</span>}
          {soldOut && <span className="rounded-full bg-ev-bg px-2 py-0.5 text-xs font-bold">{ui.soldOut}</span>}
        </div>
      </div>

      <h3 className="mt-3 px-1 text-sm font-medium leading-snug sm:text-base">{product.name}</h3>
      {note && <p className="mt-1 px-1 text-sm italic text-ev-muted">{fr ? `« ${note} »` : `“${note}”`}</p>}
      <div className="mt-2 px-1">
        <Price product={product} perPerson={perPerson} />
      </div>

      {stockClaimed && claimedPct !== null && !soldOut && (
        <div className="mt-2 px-1">
          <div className="h-1.5 overflow-hidden rounded-full bg-ev-bg">
            <div className="h-full rounded-full bg-gradient-to-r from-ev-primary to-ev-highlight" style={{ width: `${claimedPct}%` }} />
          </div>
          <p className="mt-1 text-xs text-ev-muted">{ui.claimed(claimedPct)}</p>
        </div>
      )}

      <div className="mt-auto px-1 pb-1 pt-3">
        {soldOut ? (
          waitlist &&
          (joined ? (
            <p className="flex items-center gap-1 text-sm">
              <Check size={16} aria-hidden="true" /> {fr ? 'On vous prévient au retour en stock.' : 'We’ll email you when it’s back.'}
            </p>
          ) : (
            <form onSubmit={joinWaitlist} className="flex gap-2">
              <label className="sr-only" htmlFor={`wl-${product.id}`}>
                E-mail
              </label>
              <input id={`wl-${product.id}`} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" className="field min-w-0 flex-1" />
              <button type="submit" className="btn-quick w-auto px-3" aria-label={ui.joinWaitlist}>
                <Bell size={16} aria-hidden="true" />
              </button>
            </form>
          ))
        ) : (
          <AddToCartButton products={[product]} variant="quick" />
        )}
      </div>
    </article>
  );
}
