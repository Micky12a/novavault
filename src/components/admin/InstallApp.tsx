'use client';

import { useEffect, useState } from 'react';
import { Download, Share, X } from 'lucide-react';

type PromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

/**
 * Bouton « Installer l’app » : invite native sur Chrome, Edge et Android,
 * mode d’emploi sur iPhone et iPad (Safari n’a pas d’invite automatique).
 */
export default function InstallApp() {
  const [prompt, setPrompt] = useState<PromptEvent | null>(null);
  const [ios, setIos] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [help, setHelp] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone;
    setInstalled(!!standalone);
    setIos(/iphone|ipad|ipod/i.test(navigator.userAgent));
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setPrompt(e as PromptEvent);
    };
    const onInstalled = () => setInstalled(true);
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (installed || (!prompt && !ios)) return null;

  return (
    <>
      <button
        type="button"
        onClick={async () => {
          if (prompt) {
            await prompt.prompt();
            setPrompt(null);
          } else setHelp(true);
        }}
        className="inline-flex items-center gap-2 rounded-full border border-ev-primary/60 px-3.5 py-2 text-sm font-medium transition-colors hover:bg-ev-primary hover:text-ev-on-primary"
      >
        <Download size={16} aria-hidden="true" />
        Installer l’app
      </button>

      {help && (
        <div className="fixed inset-0 z-50 grid place-items-end bg-black/60 p-3 sm:place-items-center" role="dialog" aria-modal="true" aria-labelledby="ios-install">
          <div className="fade-up w-full max-w-sm rounded-3xl bg-ev-surface p-6">
            <div className="flex items-start justify-between gap-4">
              <h2 id="ios-install" className="font-display text-xl">
                Installer sur iPhone
              </h2>
              <button type="button" onClick={() => setHelp(false)} className="rounded-full p-1.5 hover:bg-ev-bg" aria-label="Fermer">
                <X size={18} />
              </button>
            </div>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-ev-muted">
              <li>
                Touche le bouton Partager <Share size={15} className="inline" aria-hidden="true" /> en bas de Safari.
              </li>
              <li>Choisis « Sur l’écran d’accueil ».</li>
              <li>Touche « Ajouter ». L’icône NovaVault apparaît avec tes apps.</li>
            </ol>
          </div>
        </div>
      )}
    </>
  );
}
