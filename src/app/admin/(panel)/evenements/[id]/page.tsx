import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import EventForm from '@/components/admin/EventForm';
import { PageTitle } from '@/components/admin/ui';
import { db } from '@/lib/db';
import type { EventConfig } from '@/types';

export const metadata = { title: 'Événement' };

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await db.event.findUnique({ where: { id } });
  if (!row) notFound();
  const event = row.data as unknown as EventConfig;
  const [products, allEvents] = await Promise.all([
    db.product.findMany({ where: { market: event.market }, select: { id: true, name: true, collection: true }, orderBy: { name: 'asc' } }),
    db.event.findMany({ where: { market: event.market } }),
  ]);
  const collections = [...new Set<string>(allEvents.map((e: { data: unknown }) => (e.data as EventConfig).collection))];

  return (
    <>
      <Link href="/admin/evenements" className="mb-4 inline-flex items-center gap-2 text-sm text-ev-muted hover:text-ev-text">
        <ArrowLeft size={16} aria-hidden="true" /> Événements
      </Link>
      <PageTitle
        title={event.name}
        intro={`getnovavault.com/${event.slug}${event.market === 'us' ? ', page en anglais pour les États-Unis' : ''}`}
        action={
          <a href={`/${event.slug}`} target="_blank" rel="noreferrer" className="btn-quick w-auto px-5">
            <ExternalLink size={16} aria-hidden="true" /> Voir la page
          </a>
        }
      />
      <EventForm event={event} products={products} collections={collections} />
    </>
  );
}
