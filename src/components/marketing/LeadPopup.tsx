'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import EmailCapture from '@/components/marketing/EmailCapture';
import { useMarket } from '@/components/market/MarketProvider';
import { typo } from '@/lib/typo';

const SEEN_KEY = 'novavault:lead-popup-seen';

/**
 * Pop-up d’entrée (après 6 s) ou d’intention de sortie (souris vers le haut sur ordinateur,
 * 30 s d’inactivité sur mobile). Une seule fois par session.
 */
export default function LeadPopup({
  trigger,
  title,
  incentive,
  promoCode,
}: {
  trigger: 'entry' | 'exit-intent';
  title: string;
  incentive: string;
  promoCode?: string;
}) {
  const fr = useMarket() === 'fr';
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SEEN_KEY)) return;
    } catch {
      /* pas de sessionStorage : on affiche quand même une fois */
    }

    const show = () => {
      setOpen(true);
      try {
        sessionStorage.setItem(SEEN_KEY, '1');
      } catch {}
      cleanup();
    };

    const onLeave = (e: MouseEvent) => {
      if (!e.relatedTarget && e.clientY <= 0) show();
    };
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    let timer: number | undefined;

    if (trigger === 'entry') timer = window.setTimeout(show, 6000);
    else if (isTouch) timer = window.setTimeout(show, 30000);
    else document.addEventListener('mouseout', onLeave);

    function cleanup() {
      if (timer) window.clearTimeout(timer);
      document.removeEventListener('mouseout', onLeave);
    }
    return cleanup;
  }, [trigger]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] grid place-items-end bg-black/60 p-0 sm:place-items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="lead-title">
      <div className="fade-up relative w-full max-w-md rounded-t-3xl bg-ev-bg p-7 text-ev-text shadow-2xl sm:rounded-3xl">
        <button type="button" onClick={() => setOpen(false)} className="absolute right-3 top-3 rounded p-2 hover:bg-ev-surface" aria-label={fr ? 'Fermer' : 'Close'}>
          <X size={18} />
        </button>
        <h2 id="lead-title" className="pr-8 font-display text-3xl leading-tight">
          {title}
        </h2>
        <p className="mt-2 text-ev-muted">{incentive}</p>
        <div className="mt-5">
          <EmailCapture
            source="lead-popup"
            compact
            cta={fr ? 'Recevoir' : 'Get it'}
            successMessage={
              promoCode
                ? fr
                  ? typo(`Votre code : ${promoCode}. Il est aussi dans votre boîte mail.`)
                  : `Your code: ${promoCode}. We’ve emailed it to you too.`
                : undefined
            }
          />
        </div>
      </div>
    </div>
  );
}
