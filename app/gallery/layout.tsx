import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Work — Gallery',
  description:
    "See real results from Teal Detailing's work across South Florida. Ceramic coatings, paint corrections, interior details, foam treatments, and more.",
  openGraph: {
    title: 'Our Work — Gallery | Teal Detailing',
    description:
      "See real results from Teal Detailing's work across South Florida. Ceramic coatings, paint corrections, interior details, and more.",
    url: 'https://tealdetailing.com/gallery',
    images: [{ url: '/images/icons/logo-1024.webp', width: 1024, height: 1024, alt: 'Teal Detailing' }],
  },
}

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
