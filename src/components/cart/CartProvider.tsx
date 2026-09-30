'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { CartLine, Market, Product } from '@/types';

type Carts = Record<Market, CartLine[]>;
type GiftTeaser = { email: string } | null;

type CartContextValue = {
  lines: (market: Market) => CartLine[];
  count: (market: Market) => number;
  subtotal: (market: Market) => number;
  add: (market: Market, product: Product, opts?: { qty?: number; open?: boolean }) => void;
  setQty: (market: Market, productId: string, qty: number) => void;
  clear: (market: Market) => void;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  giftTeaser: GiftTeaser;
  setGiftTeaser: (g: GiftTeaser) => void;
  /** Incrémenté à chaque ajout : sert à faire rebondir l’icône du panier */
  pulse: number;
};

const STORAGE_KEY = 'novavault:carts:v2';
const EMPTY: Carts = { fr: [], us: [] };
const CartContext = createContext<CartContextValue | null>(null);

/**
 * Un panier par marché (euros et dollars ne se mélangent jamais).
 * Chaque ligne garde un instantané du produit ; le prix définitif est recalculé côté serveur au paiement.
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const [carts, setCarts] = useState<Carts>(EMPTY);
  const [isOpen, setOpen] = useState(false);
  const [giftTeaser, setGiftTeaser] = useState<GiftTeaser>(null);
  const [loaded, setLoaded] = useState(false);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setCarts({ ...EMPTY, ...(JSON.parse(raw) as Partial<Carts>) });
    } catch {
      /* stockage indisponible : panier vide */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(carts));
    } catch {
      /* stockage indisponible : le panier reste en mémoire */
    }
  }, [carts, loaded]);

  const update = useCallback((market: Market, fn: (lines: CartLine[]) => CartLine[]) => {
    setCarts((prev) => ({ ...prev, [market]: fn(prev[market]).filter((l) => l.qty > 0) }));
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines: (market) => carts[market],
      count: (market) => carts[market].reduce((n, l) => n + l.qty, 0),
      subtotal: (market) => carts[market].reduce((sum, l) => sum + l.price * l.qty, 0),
      add: (market, product, opts = {}) => {
        const qty = opts.qty ?? 1;
        update(market, (ls) =>
          ls.some((l) => l.productId === product.id)
            ? ls.map((l) => (l.productId === product.id ? { ...l, qty: l.qty + qty, price: product.price, name: product.name } : l))
            : [...ls, { productId: product.id, qty, name: product.name, price: product.price, image: product.image }],
        );
        setPulse((n) => n + 1);
        if (opts.open !== false) setOpen(true);
      },
      setQty: (market, productId, qty) => update(market, (ls) => ls.map((l) => (l.productId === productId ? { ...l, qty } : l))),
      clear: (market) => update(market, () => []),
      isOpen,
      open: () => setOpen(true),
      close: () => setOpen(false),
      giftTeaser,
      setGiftTeaser,
      pulse,
    }),
    [carts, isOpen, giftTeaser, pulse, update],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart doit être utilisé dans <CartProvider>');
  return ctx;
}
