import type { Metadata } from 'next'
import Link from 'next/link'
import PricingCard from '@/components/ui/PricingCard'
import Reviews from '@/components/sections/Reviews'
import BookingForm from '@/components/ui/BookingForm'
import { pricingPlans } from '@/lib/plans'

export const metadata: Metadata = {
  title: 'Car Detailing Services & Pricing',
  description:
    'Browse all Teal Detailing services: Economy ($99), Silver ($179), Gold ($249), ceramic coating, clay bar, paint correction, headlight restoration and more across South Florida.',
  alternates: { canonical: 'https://tealdetailing.com/services' },
  openGraph: {
    title: 'Car Detailing Services & Pricing | Teal Detailing',
    description:
      'Browse all Teal Detailing services: Economy ($99), Silver ($179), Gold ($249), ceramic coating, clay bar, paint correction and more.',
    url: 'https://tealdetailing.com/services',
    images: [{ url: '/images/icons/logo-1024.webp', width: 1024, height: 1024, alt: 'Teal Detailing' }],
  },
}

const serviceCards = [
  {
    slug: 'ceramic-coating',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    title: 'Ceramic Coating',
    desc: 'Nano-ceramic polymer that bonds to your paint for years of hydrophobic protection.',
  },
  {
    slug: 'clay-bar-treatment',
    icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01',
    title: 'Clay Bar Treatment',
    desc: 'Remove embedded contaminants for silky-smooth paint ready to accept wax or coating.',
  },
  {
    slug: 'exterior-detailing',
    icon: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z',
    title: 'Exterior Detailing',
    desc: "Hand wash, clay bar, polish, and wax to restore your car's finish and protect it from South Florida's elements.",
  },
  {
    slug: 'headlight-restoration',
    icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
    title: 'Headlight Restoration',
    desc: 'Crystal-clear headlights restored with multi-stage sanding, buffing, and UV sealant.',
  },
  {
    slug: 'interior-detailing',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    title: 'Interior Detailing',
    desc: 'Hot-water extraction, leather conditioning, and odor elimination for every interior surface.',
  },
  {
    slug: 'mobile-car-detailing',
    icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
    title: 'Mobile Car Detailing',
    desc: 'Full professional detailing at your home or office across all of South Florida.',
  },
  {
    slug: 'paint-correction',
    icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z',
    title: 'Paint Correction',
    desc: 'Machine polish removes swirl marks, light scratches, and oxidation for a mirror-like finish.',
  },
  {
    slug: 'pet-hair-removal',
    icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
    title: 'Pet Hair Removal',
    desc: 'Specialized rubber rakes and vacuum techniques extract embedded pet hair from every crevice.',
  },
  {
    slug: 'stain-removal',
    icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
    title: 'Stain Removal',
    desc: 'Targeted pH-balanced treatment lifts tough stains from seats, carpets, and upholstery.',
  },
  {
    slug: 'engine-bay-cleaning',
    icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4',
    title: 'Engine Bay Cleaning',
    desc: 'Professional degreasing that removes grime, improves appearance, and helps spot leaks early.',
  },
]

export default function ServicesPage() {
  return (
    <>
      <section className="bg-hero-gradient pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-400 mb-4">
            Services & Pricing
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Professional Detailing Packages
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed">
            Every service performed at your location — home, office, or anywhere in
            Miami-Dade, Broward, or Palm Beach. No water hookup required.
          </p>
        </div>
      </section>

      <section className="py-16 bg-slate-50" aria-labelledby="services-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="services-heading" className="text-2xl font-bold text-slate-900 mb-8 text-center">
            What We Do
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {serviceCards.map((s) => (
              <article key={s.slug} className="bg-white rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-shadow border border-slate-100 flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={s.icon} />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 text-sm mb-1">{s.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
                <Link
                  href={`/services/${s.slug}`}
                  className="text-xs font-semibold text-teal-600 hover:text-teal-500 inline-flex items-center gap-1 mt-auto"
                >
                  Learn More
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-ink" aria-labelledby="pricing-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="pricing-heading" className="text-3xl font-extrabold text-white mb-3">
              Package Pricing
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              No hidden fees. Every package includes our satisfaction guarantee.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            {pricingPlans.map((plan) => (
              <div key={plan.name} className="flex-1">
                <PricingCard {...plan} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Reviews />

      <section className="py-20 bg-white" aria-labelledby="book-services-heading">
        <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="book-services-heading" className="text-2xl font-bold text-center text-slate-900 mb-8">
            Ready to Book?
          </h2>
          <div className="bg-white rounded-2xl shadow-card-hover border border-slate-100 p-6">
            <BookingForm />
          </div>
        </div>
      </section>

      <section className="py-12 bg-ink text-center">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-slate-300 text-sm mb-4">We serve all of South Florida</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { href: '/miami-dade', label: 'Miami-Dade' },
              { href: '/broward', label: 'Broward' },
              { href: '/palm-beach', label: 'Palm Beach' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:border-teal-500 hover:text-teal-400 text-sm transition-colors"
              >
                {label} →
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
