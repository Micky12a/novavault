import Link from 'next/link';
import { notFound } from 'next/navigation';
import EventThemeProvider from '@/components/theme/EventThemeProvider';
import { BRAND, BRAND_THEME } from '@/config/brand';
import { getLegalPage } from '@/lib/data';

/** Page légale dont le texte se rédige dans Admin > Pages légales (un paragraphe par bloc, titres avec « ## ») */
export default async function LegalPage({ slug }: { slug: string }) {
  const page = await getLegalPage(slug);
  if (!page) notFound();
  const fr = page.lang === 'fr';
  const blocks = page.body.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);

  return (
    <EventThemeProvider theme={BRAND_THEME} lang={page.lang}>
      <main className="mx-auto min-h-dvh max-w-2xl px-4 py-12 sm:px-6">
        <Link href="/" className="font-display text-xl">
          {BRAND.name}
        </Link>
        <h1 className="mt-12 font-display text-4xl leading-tight">{page.title}</h1>
        {blocks.length === 0 ? (
          <p className="mt-6 rounded-2xl bg-ev-surface p-5 text-ev-muted">{fr ? 'Page en cours de rédaction.' : 'This page is being written.'}</p>
        ) : (
          <div className="mt-8 space-y-5 leading-relaxed">
            {blocks.map((b, i) =>
              b.startsWith('## ') ? (
                <h2 key={i} className="pt-4 font-display text-2xl">
                  {b.slice(3)}
                </h2>
              ) : (
                <p key={i} className="whitespace-pre-line text-ev-text/85">
                  {b}
                </p>
              ),
            )}
          </div>
        )}
        <p className="mt-12 text-sm text-ev-muted">Contact : {BRAND.contactEmail}</p>
      </main>
    </EventThemeProvider>
  );
}
