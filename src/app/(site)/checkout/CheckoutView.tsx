'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Lock } from 'lucide-react';
import { useCart } from '@/components/cart/CartProvider';
import { MarketProvider } from '@/components/market/MarketProvider';
import { BRAND } from '@/config/brand';
import { formatPrice } from '@/lib/market';
import type { Market } from '@/types';

/** Récapitulatif de commande. Le paiement Stripe Checkout se branche ici (voir README). */
export default function CheckoutView() {
  const params = useSearchParams();
  const market: Market = params.get('market') === 'us' ? 'us' : 'fr';
  const fr = market === 'fr';
  const cart = useCart();
  const lines = cart.lines(market);
  const subtotal = cart.subtotal(market);

  return (
    <MarketProvider market={market}>
      <main lang={fr ? 'fr' : 'en'} className="mx-auto min-h-dvh max-w-2xl px-4 py-12 sm:px-6">
        <Link href="/" className="font-display text-xl">
          {BRAND.name}
        </Link>
        <h1 className="mt-12 font-display text-4xl">{fr ? 'Votre commande' : 'Your order'}</h1>
        {lines.length === 0 ? (
          <p className="mt-6 text-ev-muted">{fr ? 'Votre panier est vide.' : 'Your cart is empty.'}</p>
        ) : (
          <>
            <ul className="mt-8 divide-y divide-ev-muted/20">
              {lines.map((l) => (
                <li key={l.productId} className="flex items-center gap-4 py-4">
                  <Image src={l.image.src} alt={l.image.alt} width={64} height={64} className="size-16 rounded-xl object-cover" />
                  <span className="flex-1">
                    {l.qty} × {l.name}
                  </span>
                  <span className="tabular-nums">{formatPrice(l.price * l.qty, market)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 flex justify-between border-t border-ev-muted/20 pt-4 text-lg font-semibold">
              <span>{fr ? 'Sous-total' : 'Subtotal'}</span>
              <span className="tabular-nums">{formatPrice(subtotal, market)}</span>
            </p>
            <div className="mt-8 rounded-3xl bg-ev-surface p-6">
              <p className="flex items-center gap-2 font-semibold">
                <Lock size={16} aria-hidden="true" /> {fr ? 'Paiement sécurisé' : 'Secure payment'}
              </p>
              <p className="mt-2 text-sm text-ev-muted">
                {fr ? 'Le paiement Stripe se branche ici dès que ton compte est prêt.' : 'Stripe checkout plugs in here once the account is ready.'}
              </p>
            </div>
          </>
        )}
      </main>
    </MarketProvider>
  );
}
