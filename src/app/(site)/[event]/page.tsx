import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import EventLanding from '@/components/landing/EventLanding';
import { getEventBySlug } from '@/lib/data';
import { buildEventMetadata } from '@/lib/seo';

// Pages générées à la première visite puis mises en cache ; l’admin les rafraîchit à chaque enregistrement
export const revalidate = 3600;
export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ event: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cfg = await getEventBySlug((await params).event);
  return cfg ? buildEventMetadata(cfg) : {};
}

export default async function Page({ params }: Props) {
  const cfg = await getEventBySlug((await params).event);
  if (!cfg) notFound();
  return <EventLanding config={cfg} />;
}
