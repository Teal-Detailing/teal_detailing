import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import BottomBar from '@/components/ui/BottomBar'
import FloatingPhone from '@/components/ui/FloatingPhone'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://tealdetailing.com'),
  title: {
    default: 'Teal Detailing — Premium Mobile Car Detailing in South Florida',
    template: '%s | Teal Detailing',
  },
  description:
    "South Florida's premier mobile car detailing service. We come to you — Miami-Dade, Broward & Palm Beach. Hand-wash, interior deep clean, ceramic coating & more.",
  keywords: [
    'mobile car detailing',
    'South Florida car detailing',
    'Miami car detailing',
    'Broward car detailing',
    'Palm Beach car detailing',
    'auto detailing',
    'car wash',
    'premium detailing',
    'mobile detailing',
    'Teal Detailing',
  ],
  icons: {
    icon: [
      { url: '/images/icons/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/images/icons/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/icons/logo-192.webp', sizes: '192x192', type: 'image/webp' },
      { url: '/images/icons/logo-512.webp', sizes: '512x512', type: 'image/webp' },
    ],
    apple: '/images/icons/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Teal Detailing',
    images: [
      {
        url: '/images/icons/logo-1024.webp',
        width: 1024,
        height: 1024,
        alt: 'Teal Detailing',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      {/*
        GA Consent Mode v2 — must fire before the GA script loads.
        Defaults analytics to 'denied' until user accepts via the cookie banner.
      */}
      <Script id="ga-consent-defaults" strategy="beforeInteractive">{`
        window.dataLayer=window.dataLayer||[];
        function gtag(){dataLayer.push(arguments);}
        gtag('consent','default',{
          analytics_storage:'denied',
          ad_storage:'denied',
          wait_for_update:500
        });
      `}</Script>

      <body className="font-sans antialiased bg-white text-slate-900 pb-14">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <BottomBar />
        <FloatingPhone />

        {/* Google Analytics 4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-7Y6KV48PV9"
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">{`
          window.dataLayer=window.dataLayer||[];
          function gtag(){dataLayer.push(arguments);}
          gtag('js',new Date());
          gtag('config','G-7Y6KV48PV9');
        `}</Script>

      </body>
    </html>
  )
}
