'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { CalendarRange, ExternalLink, FileText, LayoutDashboard, LogOut, Mail, Package, Receipt, Settings, Star } from 'lucide-react';
import InstallApp from '@/components/admin/InstallApp';
import { logout } from '@/app/admin/actions';

const NAV = [
  { href: '/admin', label: 'Accueil', icon: LayoutDashboard, mobile: true },
  { href: '/admin/produits', label: 'Produits', icon: Package, mobile: true },
  { href: '/admin/evenements', label: 'Événements', icon: CalendarRange, mobile: true },
  { href: '/admin/commandes', label: 'Commandes', icon: Receipt, mobile: true },
  { href: '/admin/inscrits', label: 'Inscrits', icon: Mail, mobile: true },
  { href: '/admin/avis', label: 'Avis clients', icon: Star },
  { href: '/admin/reglages', label: 'Réglages', icon: Settings },
  { href: '/admin/pages-legales', label: 'Pages légales', icon: FileText },
];

export default function AdminShell({ email, children }: { email: string; children: ReactNode }) {
  const path = usePathname();
  const active = (href: string) => (href === '/admin' ? path === '/admin' : path.startsWith(href));

  return (
    <div className="min-h-dvh md:grid md:grid-cols-[15rem_1fr]">
      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-ev-muted/15 p-4 md:flex">
        <Link href="/admin" className="px-3 py-2 font-display text-xl">
          NovaVault
        </Link>
        <nav className="mt-6 flex-1 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${active(href) ? 'bg-ev-primary text-ev-on-primary' : 'text-ev-muted hover:bg-ev-surface hover:text-ev-text'}`}
            >
              <Icon size={18} aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="space-y-2 border-t border-ev-muted/15 pt-4 text-sm">
          <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl px-3 py-2 text-ev-muted hover:bg-ev-surface hover:text-ev-text">
            <ExternalLink size={18} aria-hidden="true" /> Voir le site
          </a>
          <form action={logout}>
            <button type="submit" className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-ev-muted hover:bg-ev-surface hover:text-ev-text">
              <LogOut size={18} aria-hidden="true" /> Déconnexion
            </button>
          </form>
          <p className="truncate px-3 text-xs text-ev-muted/70">{email}</p>
        </div>
      </aside>

      <div className="min-w-0 pb-24 md:pb-0">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-ev-muted/15 bg-ev-bg/85 px-4 py-3 backdrop-blur-md md:px-8" style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}>
          <Link href="/admin" className="font-display text-lg md:hidden">
            NovaVault
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <InstallApp />
            <details className="relative md:hidden">
              <summary className="list-none rounded-full p-2 hover:bg-ev-surface [&::-webkit-details-marker]:hidden" aria-label="Plus">
                <Settings size={20} />
              </summary>
              <div className="absolute right-0 top-11 w-56 rounded-2xl border border-ev-muted/20 bg-ev-surface p-2 shadow-2xl">
                {NAV.filter((n) => !n.mobile).map(({ href, label, icon: Icon }) => (
                  <Link key={href} href={href} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-ev-bg">
                    <Icon size={17} aria-hidden="true" /> {label}
                  </Link>
                ))}
                <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-ev-bg">
                  <ExternalLink size={17} aria-hidden="true" /> Voir le site
                </a>
                <form action={logout}>
                  <button type="submit" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-ev-bg">
                    <LogOut size={17} aria-hidden="true" /> Déconnexion
                  </button>
                </form>
              </div>
            </details>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-10">{children}</main>
      </div>

      {/* Barre d’onglets sur téléphone */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-ev-muted/15 bg-ev-bg/95 backdrop-blur-md md:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        aria-label="Navigation principale"
      >
        {NAV.filter((n) => n.mobile).map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${active(href) ? 'text-ev-primary' : 'text-ev-muted'}`}>
            <Icon size={21} aria-hidden="true" />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
