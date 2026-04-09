import Link from 'next/link'

interface PricingCardProps {
  name: string
  price: string
  subtitle: string
  features: string[]
  tier?: 'economy' | 'silver' | 'gold'
}

export default function PricingCard({
  name,
  price,
  subtitle,
  features,
  tier,
}: PricingCardProps) {

  if (tier === 'economy') {
    return (
      <article className="flex flex-col rounded-2xl overflow-hidden bg-[#e8e8e8] border border-[#d0d0d0]">
        <div className="px-6 py-5 bg-[#d8d8d8]">
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">Economy</span>
          <div className="mt-2">
            <span className="text-2xl font-bold text-slate-700">{price}</span>
          </div>
          <p className="text-xs mt-1 text-slate-500">{subtitle}</p>
        </div>
        <div className="px-6 py-5 flex flex-col flex-1">
          <ul className="space-y-2 flex-1">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-xs text-slate-600">
                <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
          <Link
            href="/contact?plan=Economy"
            className="mt-6 block w-full text-center py-2.5 rounded-xl font-semibold text-sm bg-slate-700 hover:bg-slate-600 text-white transition-colors"
          >
            Book Economy
          </Link>
        </div>
      </article>
    )
  }

  if (tier === 'silver') {
    return (
      <article
        className="flex flex-col rounded-2xl overflow-hidden bg-[#0f1117] border border-[#b0b8c1]/30"
        style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
      >
        <div className="h-1 w-full bg-gradient-to-r from-[#8d9caa] via-[#b0b8c1] to-[#8d9caa]" />
        <div className="px-6 py-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#b0b8c1]">Silver</span>
            <span className="inline-block w-6 h-0.5 rounded bg-gradient-to-r from-[#8d9caa] to-[#b0b8c1]" />
          </div>
          <div>
            <span className="text-3xl font-bold text-white">{price}</span>
          </div>
          <p className="text-xs mt-1 text-slate-400">{subtitle}</p>
        </div>
        <div className="px-6 pb-6 flex flex-col flex-1">
          <ul className="space-y-2 flex-1">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-xs text-slate-300">
                <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[#b0b8c1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
          <Link
            href="/contact?plan=Silver"
            className="mt-6 block w-full text-center py-2.5 rounded-xl font-semibold text-sm text-[#0f1117] transition-all"
            style={{ background: 'linear-gradient(135deg, #8d9caa, #b0b8c1, #8d9caa)' }}
          >
            Book Silver
          </Link>
        </div>
      </article>
    )
  }

  if (tier === 'gold') {
    return (
      <article
        className="flex flex-col rounded-2xl overflow-hidden bg-[#0f1117] border border-[#c9a84c]/30 relative"
        style={{ boxShadow: '0 8px 40px rgba(201,168,76,0.25)' }}
      >
        <div className="absolute top-4 right-4 z-10">
          <span
            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold text-[#0f1117]"
            style={{ background: 'linear-gradient(135deg, #c9a84c, #f0d080)' }}
          >
            ★ Best Value
          </span>
        </div>
        <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #c9a84c, #f0d080, #c9a84c)' }} />
        <div className="px-6 py-5">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#f0d080]">Gold</span>
          <div className="mt-2">
            <span className="text-3xl font-bold text-white">{price}</span>
          </div>
          <p className="text-xs mt-1 text-slate-400">{subtitle}</p>
        </div>
        <div className="px-6 pb-6 flex flex-col flex-1">
          <ul className="space-y-2 flex-1">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-xs text-slate-300">
                <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[#f0d080]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
          <Link
            href="/contact?plan=Gold"
            className="mt-6 block w-full text-center py-2.5 rounded-xl font-bold text-sm text-[#0f1117] transition-all"
            style={{ background: 'linear-gradient(135deg, #c9a84c, #f0d080, #c9a84c)' }}
          >
            Book Gold
          </Link>
        </div>
      </article>
    )
  }

  return (
    <article className="relative flex flex-col rounded-2xl overflow-hidden shadow-card bg-white ring-1 ring-slate-200">
      <div className="bg-slate-900 px-6 py-5">
        <h3 className="text-lg font-bold text-white">{name}</h3>
        <div className="flex items-baseline gap-1 mt-2">
          <span className="text-3xl font-extrabold text-white">{price}</span>
        </div>
        <p className="text-sm mt-1 text-white/70">{subtitle}</p>
      </div>
      <div className="flex-1 px-6 py-5">
        <ul className="space-y-2.5">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-700">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
      </div>
      <div className="px-6 pb-6">
        <Link
          href={`/contact?plan=${encodeURIComponent(name)}`}
          className="block w-full text-center py-3 rounded-xl font-semibold text-sm bg-slate-900 hover:bg-slate-700 text-white transition-all"
        >
          Book This Package
        </Link>
      </div>
    </article>
  )
}
