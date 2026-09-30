'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { Market } from '@/types';

const MarketContext = createContext<Market>('fr');

/** Donne le marché (langue, devise) aux composants client : panier, prix, pop-up */
export function MarketProvider({ market, children }: { market: Market; children: ReactNode }) {
  return <MarketContext.Provider value={market}>{children}</MarketContext.Provider>;
}

export function useMarket(): Market {
  return useContext(MarketContext);
}
