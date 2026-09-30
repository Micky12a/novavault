'use client';

import { useEffect } from 'react';

/** Enregistre le service worker de l’admin (installable sur ordinateur et téléphone) */
export default function PwaRegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/admin/sw.js', { scope: '/admin' }).catch(() => {
      /* sans service worker, l’admin fonctionne normalement dans le navigateur */
    });
  }, []);
  return null;
}
