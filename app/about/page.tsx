import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Teal Detailing',
  description:
    "Learn about Teal Detailing — South Florida's premium mobile car detailing company. Our story, values, and commitment to excellence across Miami-Dade, Broward, and Palm Beach.",
  alternates: { canonical: 'https://tealdetailing.com/about' },
  openGraph: {
    title: 'About Teal Detailing | Teal Detailing',
    description:
      "Learn about Teal Detailing — South Florida's premium mobile car detailing company. Our story, values, and commitment to excellence.",
    url: 'https://tealdetailing.com/about',
    images: [{ url: '/images/icons/logo-1024.webp', width: 1024, height: 1024, alt: 'Teal Detailing' }],
  },
}

const values = [
  {
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    title: 'Quality Without Compromise',
    desc: 'We use professional-grade products and techniques on every vehicle, every time — no shortcuts, no half-measures.',
  },
  {
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    title: 'Respect for Your Time',
    desc: 'We arrive on schedule, communicate proactively, and complete every detail within the agreed window.',
  },
  {
    icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
    title: 'True Mobile Convenience',
    desc: 'No dropping off, no waiting rooms. We handle everything at your location with zero inconvenience to your day.',
  },
  {
    icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    title: 'Eco-Friendly Practices',
    desc: 'Biodegradable soaps, low-water systems, and responsible waste disposal — premium results without the environmental cost.',
  },
]

const stats = [
  { value: '700+', label: 'Happy Customers' },
  { value: '5.0★', label: 'Google Rating' },
  { value: '3', label: 'Counties Served' },
  { value: '48 HR', label: 'Satisfaction Guarantee' },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-hero-gradient pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-400 mb-4">
            Our Story
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Built on a Simple Belief
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed max-w-2xl mx-auto">
            Your car deserves professional care — and you deserve the convenience of having
            that care come to you. That&apos;s why Teal Detailing exists.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-teal-700 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-3xl font-extrabold text-white">{value}</p>
                <p className="text-sm text-teal-100 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-white" aria-labelledby="story-heading">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="story-heading" className="text-3xl font-extrabold text-slate-900 mb-6">
            How We Started
          </h2>
          <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4">
            <p>
              Teal Detailing was founded by a South Florida native who spent years working in
              high-end automotive dealerships, learning every technique from paint correction
              to leather restoration. After watching friends overpay for mediocre work — or
              wait hours at a shop — the decision was simple: bring the dealership-level
              detail directly to customers.
            </p>
            <p>
              Starting with a single van and a commitment to quality, Teal Detailing quickly
              built a reputation across Miami-Dade. Word spread to Broward, then Palm Beach.
              Today, our team of certified detailers serves hundreds of vehicles each month —
              from daily drivers to weekend exotics.
            </p>
            <p>
              We invest in the best products, stay current with industry techniques, and hire
              only detailers who share our obsession with results. Every car we touch leaves
              better than it arrived — that&apos;s our promise.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-slate-50" aria-labelledby="values-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="values-heading" className="text-3xl font-extrabold text-slate-900">
              What We Stand For
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {values.map(({ icon, title, desc }) => (
              <article key={title} className="flex gap-4 p-6 bg-white rounded-2xl shadow-card border border-slate-100 hover:shadow-card-hover transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center flex-shrink-0">
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

      {/* Team commitment */}
      <section className="py-20 bg-white" aria-labelledby="team-heading">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 id="team-heading" className="text-3xl font-extrabold text-slate-900 mb-4">
            Our Team Commitment
          </h2>
          <p className="text-slate-600 text-base leading-relaxed mb-6">
            Every Teal Detailing technician is background-checked, trained in-house, and
            required to maintain a 5-star customer rating. We carry full liability insurance
            and treat your vehicle as if it were our own.
          </p>
          <p className="text-slate-600 text-base leading-relaxed">
            When we complete a detail, we&apos;re proud to put the Teal Detailing name on it.
            If you&apos;re ever unsatisfied, call us — we&apos;ll come back within 48 hours at
            no charge.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-hero-gradient py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Experience the Teal Difference
          </h2>
          <p className="text-slate-300 mb-8">
            Join 700+ South Florida customers who trust us with their vehicles.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-semibold transition-all hover:shadow-glow"
          >
            Book Your First Detail
          </Link>
        </div>
      </section>
    </>
  )
}
