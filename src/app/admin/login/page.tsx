import { redirect } from 'next/navigation';
import LoginForm from '@/components/admin/LoginForm';
import EventAmbience from '@/components/effects/EventAmbience';
import { getAdmin } from '@/lib/auth';

export const metadata = { title: 'Connexion' };
export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  if (await getAdmin()) redirect('/admin');
  return (
    <main className="hero relative isolate grid min-h-dvh place-items-center overflow-hidden px-4">
      <div className="-z-10 opacity-60">
        <EventAmbience event="nouvel-an" />
      </div>
      <div className="fade-up w-full max-w-sm rounded-3xl border border-ev-muted/20 bg-ev-surface/80 p-7 shadow-2xl backdrop-blur-xl">
        <p className="font-display text-2xl">NovaVault</p>
        <h1 className="mt-6 font-display text-3xl">Espace admin</h1>
        <p className="mt-1 text-sm text-ev-muted">Connecte-toi pour gérer la boutique.</p>
        <LoginForm />
      </div>
    </main>
  );
}
