import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import PwaRegister from '@/components/admin/PwaRegister';
import EventThemeProvider from '@/components/theme/EventThemeProvider';
import { BRAND_THEME } from '@/config/brand';

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s | NovaVault Admin' },
  manifest: '/admin/manifest.webmanifest',
  robots: { index: false, follow: false },
  appleWebApp: { capable: true, title: 'NovaVault', statusBarStyle: 'black-translucent' },
  icons: {
    icon: '/admin-icons/icon-192.png',
    apple: '/admin-icons/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#0E0F1A',
  viewportFit: 'cover',
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <EventThemeProvider theme={BRAND_THEME} lang="fr">
      {children}
      <PwaRegister />
    </EventThemeProvider>
  );
}
