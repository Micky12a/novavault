import { Suspense } from 'react';
import CheckoutView from './CheckoutView';

export const metadata = { title: 'Commande', robots: { index: false } };

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutView />
    </Suspense>
  );
}
