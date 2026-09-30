import Link from 'next/link';
import EventThemeProvider from '@/components/theme/EventThemeProvider';
import { BRAND, BRAND_THEME } from '@/config/brand';

export default function NotFound() {
  return (
    <EventThemeProvider theme={BRAND_THEME} lang="fr">
      <main className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center px-4">
        <p className="font-display text-xl">{BRAND.name}</p>
        <h1 className="mt-8 font-display text-4xl">Cette page n’existe pas</h1>
        <p className="mt-3 text-ev-muted">L’offre a peut-être changé d’adresse. Retrouvez toutes les opérations en cours sur l’accueil.</p>
        <Link href="/" className="btn-primary mt-6 self-start">Voir les offres en cours</Link>
      </main>
    </EventThemeProvider>
  );
}
