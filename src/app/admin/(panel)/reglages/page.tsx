import SettingsForm from '@/components/admin/SettingsForm';
import { PageTitle } from '@/components/admin/ui';
import { db } from '@/lib/db';
import type { MarketSettings } from '@/types';

export const metadata = { title: 'Réglages' };

export default async function SettingsPage() {
  const rows = await db.marketSetting.findMany();
  const get = (m: string) => rows.find((r) => r.market === m)?.data as unknown as MarketSettings;
  return (
    <>
      <PageTitle title="Réglages" intro="Garanties, livraison offerte, arguments de vente et FAQ, pour chaque marché." />
      <SettingsForm fr={get('fr')} us={get('us')} />
    </>
  );
}
