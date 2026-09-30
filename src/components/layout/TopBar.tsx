'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/components/cart/CartProvider';
import { useMarket } from '@/components/market/MarketProvider';
import Countdown from '@/components/ui/Countdown';
import Marquee from '@/components/ui/Marquee';
import { BRAND } from '@/config/brand';

/**
 * Bloc 1 + navigation, collés en haut de l’écran :
 * bandeau défilant (message, garanties), compte à rebours fixe, logo et panier.
 */
export default function TopBar({
  message,
  extras,
  countdown,
  homeHref,
}: {
  message: string;
  extras: string[];
  countdown?: { target: string; label: string };
  homeHref: string;
}) {
  const market = useMarket();
  const { count, open, pulse } = useCart();
  const n = count(market);
  const items = [message, ...extras];

  return (
    <header className="sticky top-0 z-40">
      <div className="flex items-stretch bg-ev-primary text-sm font-semibold text-ev-on-primary">
        <Marquee speed={Math.max(24, items.join(' ').length / 3)} className="flex-1 py-2">
          {items.map((text, i) => (
            <span key={i} className="flex items-center whitespace-nowrap px-6">
              <svg viewBox="0 0 12 12" className="mr-6 size-2.5 fill-current opacity-60" aria-hidden="true">
                <path d="M6 0l1.8 4.2L12 6 7.8 7.8 6 12 4.2 7.8 0 6l4.2-1.8z" />
              </svg>
              {text}
            </span>
          ))}
        </Marquee>
        {countdown && (
          <div className="flex shrink-0 items-center bg-black/20 px-3 sm:px-4">
            <Countdown target={countdown.target} label={countdown.label} className="whitespace-nowrap text-xs sm:text-sm" />
          </div>
        )}
      </div>

      <nav className="border-b border-ev-muted/10 bg-ev-bg/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href={homeHref} className="font-display text-xl tracking-tight sm:text-2xl">
            {BRAND.name}
          </Link>
          <button
            id="cart-button"
            type="button"
            onClick={open}
            className="relative rounded-full p-2.5 transition-colors hover:bg-ev-surface"
            aria-label={market === 'fr' ? `Ouvrir le panier, ${n} article${n > 1 ? 's' : ''}` : `Open cart, ${n} item${n === 1 ? '' : 's'}`}
          >
            <ShoppingBag size={22} />
            {n > 0 && (
              <span key={pulse} className="bump absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-ev-primary px-1 text-xs font-bold text-ev-on-primary">
                {n}
              </span>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}
