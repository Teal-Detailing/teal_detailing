import type { Metadata } from 'next'
import Image from 'next/image'
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
    title: 'Ceramic Coating',
    desc: 'Nano-ceramic polymer that bonds to your paint for years of hydrophobic protection.',
  },
  {
    slug: 'clay-bar-treatment',
    title: 'Clay Bar Treatment',
    desc: 'Remove embedded contaminants for silky-smooth paint ready to accept wax or coating.',
  },
  {
    slug: 'exterior-detailing',
    title: 'Exterior Detailing',
    desc: "Hand wash, clay bar, polish, and wax to restore your car's finish and protect it from South Florida's elements.",
  },
  {
    slug: 'headlight-restoration',
    ext: 'png',
    title: 'Headlight Restoration',
    desc: 'Crystal-clear headlights restored with multi-stage sanding, buffing, and UV sealant.',
  },
  {
    slug: 'interior-detailing',
    title: 'Interior Detailing',
    desc: 'Hot-water extraction, leather conditioning, and odor elimination for every interior surface.',
  },
  {
    slug: 'mobile-car-detailing',
    title: 'Mobile Car Detailing',
    desc: 'Full professional detailing at your home or office across all of South Florida.',
  },
  {
    slug: 'paint-correction',
    title: 'Paint Correction',
    desc: 'Machine polish removes swirl marks, light scratches, and oxidation for a mirror-like finish.',
  },
  {
    slug: 'pet-hair-removal',
    title: 'Pet Hair Removal',
    desc: 'Specialized rubber rakes and vacuum techniques extract embedded pet hair from every crevice.',
  },
  {
    slug: 'stain-removal',
    ext: 'webp',
    title: 'Stain Removal',
    desc: 'Targeted pH-balanced treatment lifts tough stains from seats, carpets, and upholstery.',
  },
  {
    slug: 'engine-bay-cleaning',
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
              <article key={s.slug} className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow border border-slate-100 flex flex-col">
                <div className="relative w-full h-32">
                  <Image
                    src={`/services/${s.slug}.${s.ext ?? 'jpg'}`}
                    alt={s.title}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5 flex flex-col gap-3 flex-1">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 text-sm mb-1">{s.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
                  </div>
                  <Link
                    href={`/services/${s.slug}`}
                    className="text-xs font-semibold text-teal-700 hover:text-teal-600 inline-flex items-center gap-1 mt-auto"
                  >
                    Learn More<span className="sr-only"> about {s.title}</span>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
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
