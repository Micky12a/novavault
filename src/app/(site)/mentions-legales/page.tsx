import LegalPage from '@/components/legal/LegalPage';

export const revalidate = 3600;
export const metadata = { title: 'Mentions légales' };

export default function MentionsLegalesPage() {
  return <LegalPage slug="mentions-legales" />;
}
