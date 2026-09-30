'use client';

import { useEffect, useState } from 'react';

export const CONSENT_KEY = 'novavault:consent';
export const CONSENT_EVENT = 'novavault:consent-change';

/**
 * Bandeau cookies (CNIL / RGPD) : « Refuser » aussi visible qu’« Accepter ».
 * Bilingue d’après la langue du document.
 */
export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [en, setEn] = useState(false);

  useEffect(() => {
    setEn(!!document.querySelector('[lang="en"]'));
    try {
      if (!localStorage.getItem(CONSENT_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function choose(value: 'granted' | 'denied') {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {}
    window.dispatchEvent(new Event(CONSENT_EVENT));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] border-t border-white/10 bg-[#111320] p-4 text-sm text-white" role="region" aria-label={en ? 'Cookie consent' : 'Consentement aux cookies'}>
      <div className="mx-auto flex max-w-4xl flex-col gap-3 sm:flex-row sm:items-center">
        <p className="flex-1">
          {en
            ? 'We use cookies to measure our ads and improve the site. You can refuse without any impact on your shopping.'
            : 'Nous utilisons des cookies pour mesurer nos publicités et améliorer le site. Vous pouvez refuser sans aucun impact sur vos achats.'}
        </p>
        <div className="flex gap-2">
          <button type="button" onClick={() => choose('denied')} className="rounded-full border border-white/40 px-4 py-2 font-semibold">
            {en ? 'Refuse' : 'Refuser'}
          </button>
          <button type="button" onClick={() => choose('granted')} className="rounded-full bg-white px-4 py-2 font-semibold text-black">
            {en ? 'Accept' : 'Accepter'}
          </button>
        </div>
      </div>
    </div>
  );
}
