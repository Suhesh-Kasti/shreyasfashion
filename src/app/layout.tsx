import { Metadata, Viewport } from 'next'
import { getBrandName, BRAND_CONFIG } from '@/config/brand'
import { ThemeProvider } from '@/providers/ThemeProvider'
import PWAInstallPrompt from '@/components/Common/PWAInstallPrompt'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: {
    default: `${getBrandName()} | ${BRAND_CONFIG.seo.title}`,
    template: `%s | ${getBrandName()}`,
  },
  description: BRAND_CONFIG.seo.description,
  keywords: BRAND_CONFIG.seo.keywords,
  authors: [{ name: BRAND_CONFIG.founder }],
  creator: BRAND_CONFIG.founder,
  publisher: getBrandName(),
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: `${getBrandName()} | ${BRAND_CONFIG.seo.title}`,
    description: BRAND_CONFIG.seo.description,
    siteName: getBrandName(),
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: `${getBrandName()} - ${BRAND_CONFIG.tagline}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${getBrandName()} | ${BRAND_CONFIG.seo.title}`,
    description: BRAND_CONFIG.seo.description,
    images: ['/images/og-image.jpg'],
    creator: '@' + getBrandName().toLowerCase(),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icons/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/icon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/icons/safari-pinned-tab.svg',
        color: BRAND_CONFIG.colors.primary,
      },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: getBrandName(),
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': getBrandName(),
    'application-name': getBrandName(),
    'msapplication-TileColor': BRAND_CONFIG.colors.primary,
    'msapplication-config': '/browserconfig.xml',
    'theme-color': BRAND_CONFIG.colors.primary,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: BRAND_CONFIG.colors.primary },
    { media: '(prefers-color-scheme: dark)', color: BRAND_CONFIG.colors.primary },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={getBrandName()} />
        <meta name="application-name" content={getBrandName()} />
        <meta name="msapplication-TileColor" content={BRAND_CONFIG.colors.primary} />
        <meta name="theme-color" content={BRAND_CONFIG.colors.primary} />
      </head>
      <body className="bg-white text-dark dark:bg-gray-900 dark:text-white transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <PWAInstallPrompt />
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
