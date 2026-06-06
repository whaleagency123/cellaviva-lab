import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const BASE_URL = process.env.NEXTAUTH_URL ?? 'https://cellaviva.com'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'CELLAVIVA — Plant-Based Hair Care',
    template: '%s | CELLAVIVA',
  },
  description: 'Stemuvita™ — the plant-based hair care system clinically proven to reduce shedding, nourish your scalp, and restore shine in 4 weeks.',
  keywords: ['hair care', 'plant-based', 'scalp health', 'stemuvita', 'cellaviva', 'hair loss', 'hair growth'],
  authors: [{ name: 'CELLAVIVA', url: BASE_URL }],
  creator: 'CELLAVIVA',
  openGraph: {
    type: 'website',
    siteName: 'CELLAVIVA',
    url: BASE_URL,
    title: 'CELLAVIVA — Plant-Based Hair Care',
    description: 'Clinically proven plant-based hair care. Reduces shedding by 91% in 8 weeks.',
    images: [{ url: `${BASE_URL}/og?title=CELLAVIVA+%E2%80%94+Plant-Based+Hair+Care`, width: 1200, height: 630, alt: 'CELLAVIVA Hair Care' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CELLAVIVA — Plant-Based Hair Care',
    description: 'Clinically proven plant-based hair care. Reduces shedding by 91% in 8 weeks.',
    images: [`${BASE_URL}/og?title=CELLAVIVA+%E2%80%94+Plant-Based+Hair+Care`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: {
    icon: [
      { url: '/favicon-32.png',  sizes: '32x32',  type: 'image/png' },
      { url: '/favicon-48.png',  sizes: '48x48',  type: 'image/png' },
      { url: '/favicon-96.png',  sizes: '96x96',  type: 'image/png' },
      { url: '/images/logo.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon-32.png',
    apple:    '/apple-touch-icon.png',
  },
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'CELLAVIVA',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'msapplication-TileColor': '#2B5E3F',
  },
}

// Inline script to prevent flash of wrong theme before React hydrates
const themeScript = `
(function(){
  try{
    var t=localStorage.getItem('cellaviva_theme')||'system';
    var d=document.documentElement;
    var dark=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);
    d.setAttribute('data-theme',dark?'dark':'light');
    if(dark)d.classList.add('dark');
  }catch(e){}
})();
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
