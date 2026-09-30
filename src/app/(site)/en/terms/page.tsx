import LegalPage from '@/components/legal/LegalPage';

export const revalidate = 3600;
export const metadata = { title: 'Terms of Sale' };

export default function EnTermsPage() {
  return <LegalPage slug="en/terms" />;
}
