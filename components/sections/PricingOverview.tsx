import Link from 'next/link'
import PricingCard from '@/components/ui/PricingCard'

const plans = [
  {
    tier: 'economy' as const,
    name: 'Economy',
    price: '$109',
    subtitle: 'Essential care for everyday drivers',
    features: [
      'Exterior hand wash & rinse',
      'Window cleaning (interior & exterior)',
      'Tire & rim scrub',
      'Interior vacuum (seats, carpets, trunk)',
      'Dashboard & console wipe-down',
      'Door jambs & sill cleaning',
      'Air freshener',
    ],
  },
  {
    tier: 'silver' as const,
    name: 'Silver',
    price: '$179',
    subtitle: 'Full detail — inside and out',
    features: [
      'Exterior hand wash & rinse',
      'Window cleaning (interior & exterior)',
      'Tire & rim scrub',
      'Interior vacuum (seats, carpets, trunk)',
      'Dashboard & console wipe-down',
      'Door jambs & sill cleaning',
      'Air freshener',
      'Full interior deep clean',
      'Seat & carpet hot-water extraction',
      'Door panels & headliner detail',
      'Leather/vinyl conditioning',
      'Trunk full detail',
      'Tire dressing & shine',
      'Exterior spray wax',
    ],
  },
  {
    tier: 'gold' as const,
    name: 'Gold',
    price: '$279',
    subtitle: 'Premium transformation & protection',
    features: [
      'Exterior hand wash & rinse',
      'Window cleaning (interior & exterior)',
      'Tire & rim scrub',
      'Interior vacuum (seats, carpets, trunk)',
      'Dashboard & console wipe-down',
      'Door jambs & sill cleaning',
      'Air freshener',
      'Full interior deep clean',
      'Seat & carpet hot-water extraction',
      'Door panels & headliner detail',
      'Leather/vinyl conditioning',
      'Trunk full detail',
      'Tire dressing & shine',
      'Exterior spray wax',
      'Clay bar paint decontamination',
      'Machine polish & swirl removal',
      'Hand wax & paint sealant',
      'Deep leather conditioning & protection',
      'Headlight restoration',
      'Exterior plastic trim restoration',
      'Premium branded gift included',
    ],
  },
]

export default function PricingOverview() {
  return (
    <section id="pricing" className="py-20 bg-[#0a0a0f]" aria-labelledby="pricing-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-400 mb-3">
            Transparent Pricing
          </p>
          <h2 id="pricing-heading" className="text-3xl sm:text-4xl font-extrabold text-white">
            Choose Your Package
          </h2>
          <p className="mt-3 text-slate-400 max-w-xl mx-auto text-base leading-relaxed">
            No hidden fees. No surprises. Every package includes our satisfaction guarantee —
            if it&apos;s not right, we&apos;ll come back and make it right.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 items-end">
          {plans.map((plan) => (
            <PricingCard key={plan.name} {...plan} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-teal-500 text-teal-400 font-semibold hover:bg-teal-500/10 transition-colors text-sm"
          >
            View All Services & Details
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
