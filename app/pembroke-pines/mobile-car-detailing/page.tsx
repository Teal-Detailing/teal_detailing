import type { Metadata } from 'next'
import { getCityBySlug } from '@/lib/cities'
import CityLandingContent from '@/components/sections/CityLandingContent'

const city = getCityBySlug('pembroke-pines')!
const pageUrl = `https://tealdetailing.com/${city.slug}/mobile-car-detailing`

export const metadata: Metadata = {
  title: city.metaTitle,
  description: city.metaDescription,
  alternates: { canonical: pageUrl },
  openGraph: {
    title: `${city.metaTitle} | Teal Detailing`,
    description: city.metaDescription,
    url: pageUrl,
    images: [{ url: '/images/icons/logo-1024.webp', width: 1024, height: 1024, alt: 'Teal Detailing' }],
  },
}

export default function Page() {
  return <CityLandingContent city={city} />
}
