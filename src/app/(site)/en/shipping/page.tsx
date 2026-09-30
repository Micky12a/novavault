import LegalPage from '@/components/legal/LegalPage';

export const revalidate = 3600;
export const metadata = { title: 'Shipping & Duties' };

export default function EnShippingPage() {
  return <LegalPage slug="en/shipping" />;
}
