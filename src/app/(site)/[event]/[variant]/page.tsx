import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import EventLanding from '@/components/landing/EventLanding';
import { getEventBySlug } from '@/lib/data';
import { buildEventMetadata } from '@/lib/seo';

export const revalidate = 3600;
export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ event: string; variant: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { event, variant } = await params;
  const cfg = await getEventBySlug(`${event}/${variant}`);
  return cfg ? buildEventMetadata(cfg) : {};
}

export default async function Page({ params }: Props) {
  const { event, variant } = await params;
  const cfg = await getEventBySlug(`${event}/${variant}`);
  if (!cfg) notFound();
  return <EventLanding config={cfg} />;
}
