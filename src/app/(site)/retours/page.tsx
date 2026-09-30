import LegalPage from '@/components/legal/LegalPage';

export const revalidate = 3600;
export const metadata = { title: 'Politique de retour' };

export default function RetoursPage() {
  return <LegalPage slug="retours" />;
}
