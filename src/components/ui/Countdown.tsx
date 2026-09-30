'use client';

import { useEffect, useState } from 'react';
import { useMarket } from '@/components/market/MarketProvider';
import { t } from '@/lib/market';

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Compte à rebours vers une date ISO absolue (avec fuseau).
 * Rien n’est calculé côté serveur : pas d’erreur d’hydratation.
 */
export default function Countdown({ target, label, className = '' }: { target: string; label?: string; className?: string }) {
  const market = useMarket();
  const ui = t(market);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (now === null) return <span className={className} aria-hidden="true">&nbsp;</span>;

  const left = new Date(target).getTime() - now;
  if (left <= 0) return null;
  const { d, h, m, s } = parts(left);

  return (
    <span className={`tabular-nums ${className}`} role="timer" aria-live="off">
      {label ?? ui.endsIn}{' '}
      {d > 0 && (
        <>
          {d}
          {ui.days}{' '}
        </>
      )}
      {pad(h)}:{pad(m)}:{pad(s)}
    </span>
  );
}
