import LegalPage from '@/components/legal/LegalPage';

export const revalidate = 3600;
export const metadata = { title: 'Confidentialité et cookies' };

export default function ConfidentialitePage() {
  return <LegalPage slug="confidentialite" />;
}
