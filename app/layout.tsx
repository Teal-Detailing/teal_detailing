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
  twitter: {
    card: 'summary',
    title: 'Teal Detailing — Premium Mobile Car Detailing in South Florida',
    description:
      "South Florida's premier mobile car detailing service. We come to you — Miami-Dade, Broward & Palm Beach.",
    images: ['/images/icons/logo-1024.webp'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              '@id': 'https://tealdetailing.com/#business',
              name: 'Teal Detailing',
              description:
                "South Florida's premier mobile car detailing service covering Miami-Dade, Broward, and Palm Beach counties.",
              url: 'https://tealdetailing.com',
              telephone: '+16452488292',
              email: 'info@tealdetailing.com',
              priceRange: '$109–$279',
              image: 'https://tealdetailing.com/images/icons/logo-1024.webp',
              logo: 'https://tealdetailing.com/images/icons/logo-256.webp',
              address: {
                '@type': 'PostalAddress',
                addressRegion: 'FL',
                addressCountry: 'US',
              },
              areaServed: [
                { '@type': 'County', name: 'Miami-Dade County', containedInPlace: { '@type': 'State', name: 'Florida' } },
                { '@type': 'County', name: 'Broward County', containedInPlace: { '@type': 'State', name: 'Florida' } },
                { '@type': 'County', name: 'Palm Beach County', containedInPlace: { '@type': 'State', name: 'Florida' } },
              ],
              openingHoursSpecification: [{
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                opens: '08:00',
                closes: '22:00',
              }],
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '5.0',
                reviewCount: '200',
                bestRating: '5',
                worstRating: '1',
              },
              hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'Mobile Car Detailing Services',
                itemListElement: [
                  { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Economy Detail' }, price: '109', priceCurrency: 'USD' },
                  { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Silver Detail' }, price: '179', priceCurrency: 'USD' },
                  { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Gold Detail' }, price: '279', priceCurrency: 'USD' },
                ],
              },
            }),
          }}
        />

        <Navbar />
        <main>{children}</main>
        <Footer />
        <BottomBar />
        <FloatingPhone />

        <Script
          src="https://www.google.com/recaptcha/api.js?render=explicit"
          strategy="afterInteractive"
        />

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
