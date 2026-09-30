import { WifiOff } from 'lucide-react';

export const metadata = { title: 'Hors ligne' };
export const dynamic = 'force-static';

export default function Offline() {
  return (
    <main className="grid min-h-dvh place-items-center px-6 text-center">
      <div>
        <WifiOff size={40} className="mx-auto text-ev-highlight" aria-hidden="true" />
        <h1 className="mt-6 font-display text-3xl">Pas de connexion</h1>
        <p className="mt-2 max-w-sm text-ev-muted">L’admin a besoin d’internet pour lire et enregistrer tes données. Reconnecte-toi puis rouvre la page.</p>
      </div>
    </main>
  );
}
