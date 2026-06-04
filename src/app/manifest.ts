import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CELLAVIVA — Plant-Based Hair Care',
    short_name: 'CELLAVIVA',
    description: 'Stemuvita™ — the plant-based hair care system clinically proven to reduce shedding and restore shine.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8f9f4',
    theme_color: '#2B5E3F',
    orientation: 'portrait-primary',
    categories: ['shopping', 'health', 'beauty'],
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    screenshots: [
      {
        src: '/icons/screenshot-wide.png',
        sizes: '1280x720',
        type: 'image/png',
      },
      {
        src: '/icons/screenshot-narrow.png',
        sizes: '390x844',
        type: 'image/png',
      },
    ],
    shortcuts: [
      {
        name: 'Shop All',
        url: '/products',
        description: 'Browse all CELLAVIVA products',
      },
      {
        name: 'My Account',
        url: '/account',
        description: 'View your orders and account',
      },
    ],
  }
}
