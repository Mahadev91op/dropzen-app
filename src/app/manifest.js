export default function manifest() {
  return {
    name: 'Dropzen - Verified E-Commerce Dropshipping Leads',
    short_name: 'Dropzen',
    description: 'Buy high-converting verified COD customer order leads for viral trending products. Instant Excel sheet delivery.',
    start_url: '/',
    id: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#4f46e5',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/favicon.ico',
        sizes: '48x48',
        type: 'image/x-icon',
      },
    ],
    shortcuts: [
      {
        name: 'Marketplace',
        short_name: 'Catalog',
        description: 'Browse trending dropshipping product leads',
        url: '/marketplace',
        icons: [{ src: '/icon.svg', sizes: '96x96' }],
      },
      {
        name: 'My Orders Vault',
        short_name: 'Orders',
        description: 'View and download purchased Excel leads',
        url: '/profile/orders',
        icons: [{ src: '/icon.svg', sizes: '96x96' }],
      },
      {
        name: 'Admin Panel',
        short_name: 'Admin',
        description: 'Manage leads, verify orders and payments',
        url: '/admin',
        icons: [{ src: '/icon.svg', sizes: '96x96' }],
      },
    ],
    categories: ['business', 'shopping', 'productivity'],
  };
}
