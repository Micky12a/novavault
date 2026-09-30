import LegalPage from '@/components/legal/LegalPage';

export const revalidate = 3600;
export const metadata = { title: 'Privacy Policy' };

export default function EnPrivacyPage() {
  return <LegalPage slug="en/privacy" />;
}
