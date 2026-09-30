'use client';

import { useEffect, useState } from 'react';
import { useMarket } from '@/components/market/MarketProvider';
import { t } from '@/lib/market';

const pad = (n: number) => String(n).padStart(2, '0');

/** Grand compte à rebours à volets : chaque chiffre bascule quand il change */
export default function FlipCountdown({ target, label, size = 'md' }: { target: string; label?: string; size?: 'sm' | 'md' }) {
  const ui = t(useMarket());
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const left = now === null ? null : Math.max(0, new Date(target).getTime() - now);
  if (left === 0) return null;
  const s = left === null ? 0 : Math.floor(left / 1000);
  const units: [string, string][] = [
    [pad(Math.floor(s / 86400)), ui.units.d],
    [pad(Math.floor((s % 86400) / 3600)), ui.units.h],
    [pad(Math.floor((s % 3600) / 60)), ui.units.m],
    [pad(s % 60), ui.units.s],
  ];
  const box = size === 'sm' ? 'min-w-10 px-1.5 py-1 text-lg' : 'min-w-14 px-2 py-2 text-3xl sm:min-w-16 sm:text-4xl';

  return (
    <div role="timer" aria-live="off" aria-label={label}>
      {label && <p className="mb-2 text-sm font-medium text-ev-muted">{label}</p>}
      <div className="flex gap-2">
        {units.map(([value, unit]) => (
          <div key={unit} className="text-center">
            <div className={`rounded-lg bg-ev-surface/90 font-display tabular-nums leading-none shadow-sm ring-1 ring-ev-muted/20 backdrop-blur ${box}`}>
              {left === null ? (
                <span className="opacity-0">00</span>
              ) : (
                value.split('').map((d, i) => (
                  <span key={`${i}-${d}`} className="flip-digit">
                    {d}
                  </span>
                ))
              )}
            </div>
            <p className="mt-1 text-[11px] text-ev-muted">{unit}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
