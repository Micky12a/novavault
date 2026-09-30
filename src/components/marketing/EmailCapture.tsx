'use client';

import { useState, type FormEvent } from 'react';
import { useMarket } from '@/components/market/MarketProvider';

type Props = {
  source: string;
  eventId?: string;
  cta?: string;
  successMessage?: string;
  compact?: boolean;
};

/** Formulaire e-mail réutilisable : teaser, fin d’événement, défi, pop-up */
export default function EmailCapture({ source, eventId, cta, successMessage, compact }: Props) {
  const fr = useMarket() === 'fr';
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setState('sending');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source, eventId }),
      });
      setState(res.ok ? 'done' : 'error');
    } catch {
      setState('error');
    }
  }

  if (state === 'done') {
    return <p className="font-medium">{successMessage ?? (fr ? 'C’est noté. Surveillez votre boîte mail.' : 'You’re in. Keep an eye on your inbox.')}</p>;
  }

  return (
    <form onSubmit={onSubmit} className={compact ? 'space-y-2' : 'max-w-md space-y-3'}>
      <div className="flex gap-2">
        <label htmlFor={`email-${source}`} className="sr-only">
          {fr ? 'Adresse e-mail' : 'Email address'}
        </label>
        <input
          id={`email-${source}`}
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={fr ? 'votre@email.com' : 'you@email.com'}
          className="field min-w-0 flex-1"
        />
        <button type="submit" className="btn-primary shrink-0" disabled={state === 'sending'}>
          {cta ?? (fr ? 'Je m’inscris' : 'Sign me up')}
        </button>
      </div>
      <label className="flex items-start gap-2 text-xs text-ev-muted">
        <input type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5" />
        <span>
          {fr
            ? 'J’accepte de recevoir les offres NovaVault par e-mail. Désinscription en un clic.'
            : 'I agree to receive NovaVault offers by email. Unsubscribe anytime.'}
        </span>
      </label>
      {state === 'error' && (
        <p className="text-sm" role="alert">
          {fr ? 'L’inscription n’a pas abouti. Vérifiez l’adresse et réessayez.' : 'Sign-up didn’t go through. Check the address and try again.'}
        </p>
      )}
    </form>
  );
}
