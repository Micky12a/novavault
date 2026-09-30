import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import LegalForm from '@/components/admin/LegalForm';
import { PageTitle } from '@/components/admin/ui';
import { db } from '@/lib/db';

export const metadata = { title: 'Page légale' };

export default async function LegalEditPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const slug = (await params).slug.join('/');
  const page = await db.legalPage.findUnique({ where: { slug } });
  if (!page) notFound();
  return (
    <>
      <Link href="/admin/pages-legales" className="mb-4 inline-flex items-center gap-2 text-sm text-ev-muted hover:text-ev-text">
        <ArrowLeft size={16} aria-hidden="true" /> Pages légales
      </Link>
      <PageTitle title={page.title} intro={`getnovavault.com/${page.slug}`} />
      <LegalForm slug={page.slug} title={page.title} body={page.body} />
    </>
  );
}
