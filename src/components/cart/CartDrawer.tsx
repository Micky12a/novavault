'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Gift, Lock, Minus, Plus, X } from 'lucide-react';
import { useCart } from '@/components/cart/CartProvider';
import { useMarket } from '@/components/market/MarketProvider';
import { formatPrice, t } from '@/lib/market';
import type { Product } from '@/types';

const COLORS = ['var(--ev-primary)', 'var(--ev-highlight)', 'var(--ev-accent)', 'var(--ev-text)'];

/** Petite explosion de confettis quand la livraison offerte est débloquée */
function Confetti({ burst }: { burst: number }) {
  if (!burst) return null;
  return (
    <span key={burst} className="pointer-events-none absolute inset-0" aria-hidden="true">
      {Array.from({ length: 22 }, (_, i) => {
        const angle = (i / 22) * Math.PI * 2;
        const dist = 60 + (i % 5) * 18;
        return (
          <span
            key={i}
            className="confetti-piece"
            style={{
              background: COLORS[i % COLORS.length],
              ['--x' as string]: `${Math.cos(angle) * dist}px`,
              ['--y' as string]: `${Math.sin(angle) * dist - 20}px`,
              ['--r' as string]: `${(i % 2 ? 1 : -1) * (180 + i * 20)}deg`,
            }}
          />
        );
      })}
    </span>
  );
}

export default function CartDrawer({
  upsell,
  freeShippingThreshold,
  bnpl,
  giftTeaser,
}: {
  upsell?: Product;
  freeShippingThreshold: number;
  bnpl: string[];
  giftTeaser?: boolean;
}) {
  const market = useMarket();
  const ui = t(market);
  const fr = market === 'fr';
  const cart = useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  const [teaserOn, setTeaserOn] = useState(false);
  const [burst, setBurst] = useState(0);

  const lines = cart.lines(market);
  const subtotal = cart.subtotal(market);
  const left = Math.max(0, freeShippingThreshold - subtotal);
  const progress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const unlocked = progress >= 100;
  const wasUnlocked = useRef(unlocked);
  const showUpsell = upsell && !lines.some((l) => l.productId === upsell.id);

  useEffect(() => {
    if (unlocked && !wasUnlocked.current) setBurst(Date.now());
    wasUnlocked.current = unlocked;
  }, [unlocked]);

  useEffect(() => {
    if (!cart.isOpen) return;
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && cart.close();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cart.isOpen, cart]);

  return (
    <div className={`fixed inset-0 z-50 ${cart.isOpen ? '' : 'pointer-events-none'}`} inert={!cart.isOpen}>
      <div className={`absolute inset-0 bg-black/55 backdrop-blur-sm transition-opacity duration-300 ${cart.isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={cart.close} />
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={fr ? 'Panier' : 'Cart'}
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-ev-bg text-ev-text shadow-2xl outline-none transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${cart.isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <header className="flex items-center justify-between px-5 py-4">
          <h2 className="font-display text-2xl">{fr ? 'Votre panier' : 'Your cart'}</h2>
          <button type="button" onClick={cart.close} className="rounded-full p-2 transition-colors hover:bg-ev-surface" aria-label={fr ? 'Fermer le panier' : 'Close cart'}>
            <X size={20} />
          </button>
        </header>

        <div className="relative mx-5 rounded-2xl bg-ev-surface p-4">
          <Confetti burst={burst} />
          <p className="text-sm font-medium">{unlocked ? ui.freeShippingUnlocked : ui.freeShippingLeft(formatPrice(left, market))}</p>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-ev-bg" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
            <div
              className="h-full rounded-full bg-gradient-to-r from-ev-primary to-ev-highlight transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ width: `${Math.max(progress, 4)}%` }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pt-2">
          {lines.length === 0 ? (
            <p className="py-12 text-center text-ev-muted">{fr ? 'Votre panier est vide. Ajoutez une offre pour commencer.' : 'Your cart is empty. Add a deal to get started.'}</p>
          ) : (
            <ul>
              {lines.map((l) => (
                <li key={l.productId} className="flex gap-3 border-b border-ev-muted/15 py-4">
                  <Image src={l.image.src} alt={l.image.alt} width={80} height={80} className="size-20 rounded-xl object-cover" />
                  <div className="flex flex-1 flex-col">
                    <span className="text-sm font-medium leading-snug">{l.name}</span>
                    <span className="text-sm text-ev-muted">{formatPrice(l.price, market)}</span>
                    <div className="mt-auto flex w-fit items-center rounded-full border border-ev-muted/30">
                      <button type="button" className="p-2" onClick={() => cart.setQty(market, l.productId, l.qty - 1)} aria-label={fr ? 'Retirer un' : 'Remove one'}>
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center text-sm tabular-nums">{l.qty}</span>
                      <button type="button" className="p-2" onClick={() => cart.setQty(market, l.productId, l.qty + 1)} aria-label={fr ? 'Ajouter un' : 'Add one'}>
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <span className="text-sm font-semibold tabular-nums">{formatPrice(l.price * l.qty, market)}</span>
                </li>
              ))}
            </ul>
          )}

          {showUpsell && upsell && (
            <div className="my-4 flex items-center gap-3 rounded-2xl border border-dashed border-ev-primary/60 p-3">
              <Image src={upsell.image.src} alt={upsell.image.alt} width={56} height={56} className="size-14 rounded-lg object-cover" />
              <div className="flex-1 text-sm">
                <p className="text-xs text-ev-muted">{ui.upsellTitle}</p>
                <p className="font-medium">{upsell.name}</p>
                <p className="text-ev-muted">{formatPrice(upsell.price, market)}</p>
              </div>
              <button type="button" onClick={() => cart.add(market, upsell, { open: false })} className="btn-quick w-auto px-4">
                <Plus size={16} aria-hidden="true" />
                {fr ? 'Ajouter' : 'Add'}
              </button>
            </div>
          )}

          {giftTeaser && lines.length > 0 && (
            <div className="my-4 rounded-2xl bg-ev-surface p-4 text-sm">
              <label className="flex items-start gap-2">
                <input type="checkbox" checked={teaserOn} onChange={(e) => setTeaserOn(e.target.checked)} className="mt-1 accent-[var(--ev-primary)]" />
                <span>
                  <Gift size={16} className="mr-1 inline" aria-hidden="true" />
                  {fr ? 'Envoyer un aperçu du cadeau au destinataire le jour J, au cas où le colis arriverait en retard.' : 'Email the recipient a sneak peek on the big day, in case the parcel arrives late.'}
                </span>
              </label>
              {teaserOn && (
                <input
                  type="email"
                  required
                  placeholder={fr ? 'E-mail du destinataire' : 'Recipient email'}
                  className="field mt-3 w-full"
                  onChange={(e) => cart.setGiftTeaser({ email: e.target.value })}
                />
              )}
            </div>
          )}
        </div>

        {lines.length > 0 && (
          <footer className="border-t border-ev-muted/15 px-5 py-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>{fr ? 'Sous-total' : 'Subtotal'}</span>
              <span className="tabular-nums">{formatPrice(subtotal, market)}</span>
            </div>
            {bnpl.length > 0 && <p className="mt-1 text-xs text-ev-muted">{fr ? 'Ou payez en 3 fois avec Klarna.' : 'Or pay in 4 with Klarna.'}</p>}
            <Link href={`/checkout?market=${market}`} onClick={cart.close} className="btn-primary mt-4 w-full">
              <Lock size={16} aria-hidden="true" />
              {ui.checkout}
            </Link>
            <p className="mt-2 text-center text-xs text-ev-muted">{fr ? 'Apple Pay, Google Pay, PayPal et carte bancaire' : 'Apple Pay, Google Pay, PayPal and cards'}</p>
          </footer>
        )}
      </div>
    </div>
  );
}
