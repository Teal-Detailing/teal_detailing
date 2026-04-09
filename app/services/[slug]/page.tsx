import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { servicesData, serviceSlugs } from '@/lib/services'
import { pricingPlans } from '@/lib/plans'
import PricingCard from '@/components/ui/PricingCard'

export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const service = servicesData[params.slug as keyof typeof servicesData]
  if (!service) return {}
  const title = `${service.name} in South Florida`
  const description = `Professional mobile ${service.name.toLowerCase()} service across Miami-Dade, Broward, and Palm Beach. ${service.heroSub}`
  return {
    title,
    description,
    openGraph: {
      title: `${title} | Teal Detailing`,
      description,
      url: `https://tealdetailing.com/services/${params.slug}`,
      images: [{ url: '/images/icons/logo-1024.webp', width: 1024, height: 1024, alt: 'Teal Detailing' }],
    },
  }
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const service = servicesData[params.slug as keyof typeof servicesData]
  if (!service) notFound()

  return (
    <>
      <section className="bg-hero-gradient pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-400 mb-4">
            Teal Detailing
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            {service.name}
          </h1>
          <p className="text-xl sm:text-2xl font-medium text-teal-300 mb-4">
            {service.tagline}
          </p>
          <p className="text-slate-300 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            {service.heroSub}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-semibold text-base transition-all hover:shadow-glow"
          >
            Get a Free Quote
          </Link>
        </div>
      </section>

      <section className="py-20 bg-white" aria-labelledby="what-heading">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="what-heading" className="text-3xl font-extrabold text-slate-900 mb-8">
            What is {service.name}?
          </h2>
          <div className="space-y-5">
            {service.what.map((para, i) => (
              <p key={i} className="text-slate-600 text-base leading-relaxed">
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50" aria-labelledby="why-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="why-heading" className="text-3xl font-extrabold text-slate-900">
              Why Choose Teal for {service.name}?
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {service.why.map(({ icon, title, desc }) => (
              <article
                key={title}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-card hover:shadow-card-hover transition-shadow flex flex-col gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={icon} />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#0a0a0f]" aria-labelledby="service-pricing-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-400 mb-3">
              Pricing
            </p>
            <h2 id="service-pricing-heading" className="text-3xl font-extrabold text-white">
              Choose Your Package
            </h2>
            <p className="mt-3 text-slate-400 max-w-xl mx-auto">
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

      <section className="py-16 bg-white" aria-labelledby="areas-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 id="areas-heading" className="text-2xl font-bold text-slate-900 mb-4">
            {service.name} Available in All Three Counties
          </h2>
          <p className="text-slate-500 text-sm mb-6">
            We serve Miami-Dade, Broward, and Palm Beach — select your county for local details
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { href: `/miami-dade/${params.slug}`, label: 'Miami-Dade County' },
              { href: `/broward/${params.slug}`, label: 'Broward County' },
              { href: `/palm-beach/${params.slug}`, label: 'Palm Beach County' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="px-5 py-2.5 rounded-xl border border-teal-200 text-teal-700 hover:bg-teal-50 hover:border-teal-400 text-sm font-medium transition-colors"
              >
                {label} →
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-hero-gradient py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-extrabold text-white mb-3">
            Ready to Book?
          </h2>
          <p className="text-slate-300 mb-6 text-sm">
            Same-week availability · No travel fees · 5-star service guaranteed
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact" className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-semibold text-sm transition-all hover:shadow-glow">
              Book Online
            </Link>
            <a href="tel:+16452488292" className="px-6 py-3 rounded-xl border border-white/20 text-white font-semibold text-sm hover:bg-white/10 transition-colors">
              Call (645) 248-8292
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
