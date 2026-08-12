import Link from 'next/link'
import type { CityData } from '@/lib/cities'
import { pricingPlans } from '@/lib/plans'
import { reviews } from '@/lib/reviews'
import { PHONE_DISPLAY, PHONE_HREF } from '@/lib/constants'
import BookingForm from '@/components/ui/BookingForm'
import PricingCard from '@/components/ui/PricingCard'
import PackageDisclaimer from '@/components/ui/PackageDisclaimer'
import Reviews from '@/components/sections/Reviews'
import FAQ from '@/components/sections/FAQ'

const services = [
  { slug: 'ceramic-coating', name: 'Ceramic Coating' },
  { slug: 'clay-bar-treatment', name: 'Clay Bar Treatment' },
  { slug: 'exterior-detailing', name: 'Exterior Detailing' },
  { slug: 'headlight-restoration', name: 'Headlight Restoration' },
  { slug: 'interior-detailing', name: 'Interior Detailing' },
  { slug: 'mobile-car-detailing', name: 'Mobile Car Detailing' },
  { slug: 'paint-correction', name: 'Paint Correction' },
  { slug: 'pet-hair-removal', name: 'Pet Hair Removal' },
  { slug: 'stain-removal', name: 'Stain Removal' },
  { slug: 'engine-bay-cleaning', name: 'Engine Bay Cleaning' },
]

export default function CityLandingContent({ city }: { city: CityData }) {
  const pageUrl = `https://tealdetailing.com/${city.slug}/mobile-car-detailing`
  const featuredReviews = city.featuredReviewNames
    ? reviews.filter((r) => city.featuredReviewNames!.includes(r.name))
    : []

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://tealdetailing.com' },
                { '@type': 'ListItem', position: 2, name: city.county.name, item: `https://tealdetailing.com/${city.county.slug}` },
                { '@type': 'ListItem', position: 3, name: city.name, item: pageUrl },
              ],
            },
            {
              '@context': 'https://schema.org',
              '@type': 'Service',
              name: `Mobile Car Detailing in ${city.name}, FL`,
              description: city.metaDescription,
              url: pageUrl,
              provider: {
                '@type': 'LocalBusiness',
                '@id': 'https://tealdetailing.com/#business',
                name: 'Teal Detailing',
              },
              areaServed: { '@type': 'City', name: city.name },
            },
          ]),
        }}
      />

      {/* Hero */}
      <section className="bg-hero-gradient pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-sm text-slate-400 mb-4">
            <Link href="/" className="hover:text-teal-400 transition-colors">Home</Link>
            <span>/</span>
            <Link href={`/${city.county.slug}`} className="hover:text-teal-400 transition-colors">{city.county.name}</Link>
            <span>/</span>
            <span className="text-teal-400">{city.name}</span>
          </nav>
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-400 mb-4">
            Mobile Car Detailing
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Mobile Car Detailing in {city.name}, FL
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed max-w-2xl mx-auto">
            {city.heroIntro}
          </p>
        </div>
      </section>

      {/* Service area + booking */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Areas We Serve in {city.name}
              </h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                We bring the full detailing setup directly to you — no water or electricity
                hookup needed, and no travel fees within {city.name}.
              </p>
              <div className="grid grid-cols-2 gap-2 mb-8">
                {city.neighborhoods.map((n) => (
                  <div key={n} className="flex items-center gap-2 text-sm text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0" />
                    {n}
                  </div>
                ))}
              </div>
              <div className="bg-teal-50 rounded-2xl p-5 border border-teal-100">
                <h3 className="font-semibold text-teal-900 mb-2">
                  {city.angleTitle}
                </h3>
                <p className="text-sm text-teal-800 leading-relaxed">
                  {city.angleBody}
                </p>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-2xl shadow-card-hover border border-slate-100 p-6">
                <BookingForm location={city.name} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured local review, if we have a genuine match */}
      {featuredReviews.length > 0 && (
        <section className="py-16 bg-white" aria-labelledby="local-review-heading">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="local-review-heading" className="text-center text-2xl font-bold text-slate-900 mb-8">
              What {city.name} Clients Say
            </h2>
            <div className="flex flex-col gap-6">
              {featuredReviews.map((r) => (
                <div key={r.name} className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: r.stars }).map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.173c.969 0 1.371 1.24.588 1.81l-3.376 2.453a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.376-2.453a1 1 0 00-1.175 0l-3.376 2.453c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.173a1 1 0 00.95-.69l1.288-3.967z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line mb-3">{r.text}</p>
                  <p className="text-sm font-semibold text-slate-900">{r.name} <span className="text-slate-400 font-normal">— {r.location}</span></p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pricing */}
      <section className="py-20 bg-ink" aria-labelledby="pricing-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="pricing-heading" className="text-3xl font-extrabold text-white mb-3">
              {city.name} Package Pricing
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Prices shown are our starting sedan rate. SUVs, trucks, and vans have a small size adjustment — no hidden fees, ever.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            {pricingPlans.map((plan) => (
              <div key={plan.name} className="flex-1">
                <PricingCard {...plan} startingAt />
              </div>
            ))}
          </div>
          <PackageDisclaimer />
        </div>
      </section>

      {/* Services grid */}
      <section className="py-16 bg-white" aria-labelledby="city-services-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 id="city-services-heading" className="text-2xl font-bold text-slate-900">
              Services Available in {city.name}
            </h2>
            <p className="text-slate-500 mt-2 text-sm">
              All 10 services available — we come to you
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {services.map(({ slug, name }) => (
              <Link
                key={slug}
                href={`/${city.county.slug}/${slug}`}
                className="group flex flex-col items-center gap-2 p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:border-teal-300 hover:bg-teal-50 transition-colors text-center"
              >
                <span className="text-sm font-semibold text-slate-800 group-hover:text-teal-700 transition-colors">
                  {name}
                </span>
                <span className="text-xs text-teal-700 font-medium">Learn More →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Reviews />

      <FAQ extra={city.extraFaq} />

      {/* CTA */}
      <section className="bg-hero-gradient py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-extrabold text-white mb-3">
            Ready to Book in {city.name}?
          </h2>
          <p className="text-slate-300 mb-6 text-sm">
            Same-day appointments when available · No travel fees · 5-star service guaranteed
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact" className="px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-semibold text-sm transition-all hover:shadow-glow">
              Book My Detail
            </Link>
            <a href={PHONE_HREF} className="px-6 py-3 rounded-xl border border-white/20 text-white font-semibold text-sm hover:bg-white/10 transition-colors">
              Call {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
