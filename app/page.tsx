import type { Metadata } from 'next'
import Link from 'next/link'
import Hero from '@/components/sections/Hero'
import PricingOverview from '@/components/sections/PricingOverview'
import ServiceAreas from '@/components/sections/ServiceAreas'
import WhyChooseUs from '@/components/sections/WhyChooseUs'
import ServicesGrid from '@/components/sections/ServicesGrid'
import Reviews from '@/components/sections/Reviews'
import FAQ from '@/components/sections/FAQ'
import { PHONE_DISPLAY, PHONE_HREF } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Premium Mobile Car Detailing in South Florida',
  description:
    'Teal Detailing brings 5-star mobile car detailing to your home or office across Miami-Dade, Broward, and Palm Beach. Economy, Silver & Gold packages starting at $99.',
  alternates: { canonical: 'https://tealdetailing.com' },
  openGraph: {
    title: 'Teal Detailing — Premium Mobile Car Detailing in South Florida',
    description:
      'Teal Detailing brings 5-star mobile car detailing to your home or office across Miami-Dade, Broward, and Palm Beach. Economy, Silver & Gold packages starting at $99.',
    url: 'https://tealdetailing.com',
    images: [{ url: '/images/icons/logo-1024.webp', width: 1024, height: 1024, alt: 'Teal Detailing' }],
  },
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <PricingOverview />
      <ServiceAreas />
      <ServicesGrid />
      <Reviews />
      <WhyChooseUs />
      <FAQ />

      {/* Gallery Teaser */}
      <section className="py-14 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-teal-700 mb-1.5">Our Work</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">See Real Results</h2>
              <p className="text-slate-500 mt-2 max-w-md">Real transformations from across South Florida — browse our photo gallery.</p>
            </div>
            <Link
              href="/gallery"
              className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-semibold transition-all hover:shadow-glow"
            >
              Browse the Gallery
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-hero-gradient py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Ready for a Showroom-Clean Car?
          </h2>
          <p className="text-slate-300 text-lg mb-8 leading-relaxed">
            Book online in 60 seconds. We&apos;ll respond in 15 minutes and arrive
            fully equipped — you don&apos;t lift a finger.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-semibold transition-all hover:shadow-glow"
            >
              Book Your Detail
            </Link>
            <a
              href={PHONE_HREF}
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/10 transition-colors"
            >
              Call {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
