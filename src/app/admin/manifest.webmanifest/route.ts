/** Manifeste de l’application admin installable (ordinateur et téléphone) */
export function GET() {
  const manifest = {
    id: '/admin',
    name: 'NovaVault Admin',
    short_name: 'NovaVault',
    description: 'Gérer les produits, les pages et les inscrits de NovaVault',
    start_url: '/admin',
    scope: '/admin',
    display: 'standalone',
    orientation: 'any',
    background_color: '#0E0F1A',
    theme_color: '#0E0F1A',
    lang: 'fr',
    icons: [
      { src: '/admin-icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/admin-icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/admin-icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'Nouveau produit', url: '/admin/produits/nouveau', icons: [{ src: '/admin-icons/icon-192.png', sizes: '192x192' }] },
      { name: 'Inscrits', url: '/admin/inscrits', icons: [{ src: '/admin-icons/icon-192.png', sizes: '192x192' }] },
    ],
  };
  return new Response(JSON.stringify(manifest), { headers: { 'Content-Type': 'application/manifest+json' } });
}
