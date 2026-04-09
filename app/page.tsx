import type { Metadata } from 'next'
import Link from 'next/link'
import Hero from '@/components/sections/Hero'
import PricingOverview from '@/components/sections/PricingOverview'
import WhyChooseUs from '@/components/sections/WhyChooseUs'
import ServicesGrid from '@/components/sections/ServicesGrid'
import Reviews from '@/components/sections/Reviews'

export const metadata: Metadata = {
  title: 'Premium Mobile Car Detailing in South Florida',
  description:
    'Teal Detailing brings 5-star mobile car detailing to your home or office across Miami-Dade, Broward, and Palm Beach. Economy, Silver & Gold packages starting at $109.',
  openGraph: {
    title: 'Teal Detailing — Premium Mobile Car Detailing in South Florida',
    description:
      'Teal Detailing brings 5-star mobile car detailing to your home or office across Miami-Dade, Broward, and Palm Beach. Economy, Silver & Gold packages starting at $109.',
    url: 'https://tealdetailing.com',
    images: [{ url: '/images/icons/logo-1024.webp', width: 1024, height: 1024, alt: 'Teal Detailing' }],
  },
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <section className="py-4 bg-[#0a0a0f]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
            Choose Your Detail Package
          </h2>
          <p className="text-slate-400 text-sm">
            Starting at $109 — we come to you, fully equipped.
          </p>
        </div>
      </section>
      <PricingOverview />
      <WhyChooseUs />
      <ServicesGrid />
      <Reviews />

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
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-semibold transition-all hover:shadow-glow"
            >
              Book Your Detail
            </Link>
            <a
              href="tel:+16452488292"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/10 transition-colors"
            >
              Call (645) 248-8292
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
