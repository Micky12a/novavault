'use client';

import { useEffect, useState } from 'react';
import AddToCartButton from '@/components/cart/AddToCartButton';
import { useCart } from '@/components/cart/CartProvider';
import { formatPrice } from '@/lib/market';
import type { Product } from '@/types';

/** Sur mobile, dès que le hero sort de l’écran : l’offre vedette reste à portée de pouce */
export default function StickyMobileCTA({ product }: { product: Product }) {
  const [show, setShow] = useState(false);
  const { isOpen } = useCart();

  useEffect(() => {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const io = new IntersectionObserver(([e]) => setShow(!e.isIntersecting), { threshold: 0 });
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  const visible = show && !isOpen;
  return (
    <div
      className={`fixed inset-x-3 bottom-3 z-30 flex items-center gap-3 rounded-2xl border border-ev-muted/20 bg-ev-bg/90 p-2.5 pl-4 shadow-2xl backdrop-blur-xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${visible ? 'translate-y-0' : 'translate-y-[150%]'}`}
      inert={!visible}
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{product.name}</p>
        <p className="text-sm font-semibold text-ev-highlight">{formatPrice(product.price, product.market)}</p>
      </div>
      <AddToCartButton products={[product]} className="min-h-11 shrink-0 px-5 text-sm" />
    </div>
  );
}
