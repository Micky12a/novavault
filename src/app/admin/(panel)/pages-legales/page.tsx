import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { PageTitle } from '@/components/admin/ui';
import { db } from '@/lib/db';

export const metadata = { title: 'Pages légales' };

export default async function LegalPagesPage() {
  const pages = await db.legalPage.findMany({ orderBy: [{ lang: 'desc' }, { slug: 'asc' }] });
  return (
    <>
      <PageTitle title="Pages légales" intro="CGV, mentions légales, retours et confidentialité, en français et en anglais." />
      <ul className="grid gap-3 sm:grid-cols-2">
        {pages.map((p) => (
          <li key={p.slug}>
            <Link href={`/admin/pages-legales/${p.slug}`} className="flex items-center justify-between gap-4 rounded-2xl border border-ev-muted/15 bg-ev-surface p-4 transition-colors hover:border-ev-primary/60">
              <span>
                <span className="block font-medium">{p.title}</span>
                <span className="text-xs text-ev-muted">
                  /{p.slug}, {p.body.trim() ? 'rédigée' : 'à rédiger'}
                </span>
              </span>
              <ArrowUpRight size={18} className="text-ev-muted" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
