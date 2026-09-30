import LegalPage from '@/components/legal/LegalPage';

export const revalidate = 3600;
export const metadata = { title: 'Conditions générales de vente' };

export default function CgvPage() {
  return <LegalPage slug="cgv" />;
}
