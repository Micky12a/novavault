import LegalPage from '@/components/legal/LegalPage';

export const revalidate = 3600;
export const metadata = { title: 'Returns & Refunds' };

export default function EnReturnsPage() {
  return <LegalPage slug="en/returns" />;
}
