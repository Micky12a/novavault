import type { ReactNode } from 'react';
import { CartProvider } from '@/components/cart/CartProvider';
import ConsentBanner from '@/components/marketing/ConsentBanner';
import TrackingPixels from '@/components/marketing/TrackingPixels';
import { TRACKING } from '@/config/brand';

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      {children}
      <ConsentBanner />
      <TrackingPixels ids={TRACKING} />
    </CartProvider>
  );
}
