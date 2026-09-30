'use client';

import { useState, type MouseEvent } from 'react';
import { Check, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/components/cart/CartProvider';
import { flyToCart } from '@/components/cart/flyToCart';
import { useMarket } from '@/components/market/MarketProvider';
import { t } from '@/lib/market';
import type { Product } from '@/types';

export default function AddToCartButton({
  products,
  variant = 'primary',
  label,
  className = '',
}: {
  products: Product[];
  variant?: 'primary' | 'quick';
  label?: string;
  className?: string;
}) {
  const market = useMarket();
  const { add, open } = useCart();
  const ui = t(market);
  const [added, setAdded] = useState(false);

  async function onClick(e: MouseEvent<HTMLButtonElement>) {
    const btn = e.currentTarget;
    products.forEach((p) => add(market, p, { open: false }));
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
    await flyToCart(btn);
    // Ajout rapide : on reste sur la page ; ajout principal : le panier s’ouvre
    if (variant === 'primary') open();
  }

  const icon = added ? <Check size={variant === 'quick' ? 16 : 18} aria-hidden="true" /> : variant === 'quick' ? <Plus size={16} aria-hidden="true" /> : <ShoppingBag size={18} aria-hidden="true" />;
  const text = added ? ui.added : (label ?? (variant === 'quick' ? ui.quickAdd : ui.addToCart));

  return (
    <button type="button" onClick={onClick} className={`${variant === 'quick' ? 'btn-quick' : 'btn-primary'} ${className}`} aria-live="polite">
      {icon}
      {text}
    </button>
  );
}
