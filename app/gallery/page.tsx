import type { Metadata } from 'next'
import GalleryClient from './GalleryClient'

export const metadata: Metadata = {
  title: 'Before & After Gallery',
  description:
    "See real before-and-after results from Teal Detailing's mobile car detailing service across Miami-Dade, Broward, and Palm Beach — exterior showcase, interior deep cleans, and our foam pre-wash process.",
  alternates: { canonical: 'https://tealdetailing.com/gallery' },
  openGraph: {
    title: 'Before & After Gallery | Teal Detailing',
    description:
      "Real transformations from across South Florida — browse exterior, interior, and process photos from Teal Detailing.",
    url: 'https://tealdetailing.com/gallery',
    images: [{ url: '/images/icons/logo-1024.webp', width: 1024, height: 1024, alt: 'Teal Detailing' }],
  },
}

export default function GalleryPage() {
  return <GalleryClient />
}
