import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import StickyBottomCTA from '@/components/ui/StickyBottomCTA'
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
      <body className="font-sans antialiased bg-white text-slate-900 pb-14">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <StickyBottomCTA />
        <FloatingPhone />
      </body>
    </html>
  )
}
