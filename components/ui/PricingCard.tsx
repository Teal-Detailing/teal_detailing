import Link from 'next/link'

interface PricingCardProps {
  name: string
  price: string
  oldPrice?: string
  subtitle: string
  features: string[]
  highlightedFeatures?: string[]
  tier?: 'economy' | 'silver' | 'gold'
}

export default function PricingCard({
  name,
  price,
  oldPrice,
  subtitle,
  features,
  highlightedFeatures = [],
  tier,
}: PricingCardProps) {

  if (tier === 'economy') {
    return (
      <article className="flex flex-col rounded-2xl overflow-hidden bg-[#e8e8e8] border border-[#d0d0d0]">
        <div className="px-6 py-5 bg-[#d8d8d8]">
          <span className="text-[1.1rem] font-extrabold uppercase tracking-widest text-slate-500">Economy</span>
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <span className="text-[2.25rem] font-extrabold text-slate-700">{price}</span>
            {oldPrice && <span className="text-[1.05rem] text-slate-600 line-through">{oldPrice}</span>}
            <span className="px-2 py-0.5 rounded-full border border-teal-400 bg-teal-50 text-teal-700 text-[0.9rem] font-semibold">15% off</span>
          </div>
          <p className="text-[1rem] font-semibold mt-1 text-slate-500">{subtitle}</p>
        </div>
        <div className="px-6 py-5 flex flex-col flex-1">
          <ul className="space-y-2 flex-1">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-[1rem] font-semibold text-slate-600">
                <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
          <Link
            href="/contact?plan=Economy"
            className="mt-6 block w-full text-center py-2.5 rounded-xl font-semibold text-[1.05rem] bg-slate-700 hover:bg-slate-600 text-white transition-colors"
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
        className="flex flex-col rounded-2xl overflow-hidden bg-ink border border-[#b0b8c1]/60 shadow-dark-card relative ring-1 ring-[#b0b8c1]/40 transition-shadow duration-300 hover:shadow-silver-glow-hover"
      >
        <div className="absolute top-4 right-4 z-10">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[0.9rem] font-bold text-[#0f1117] bg-gradient-to-r from-[#8d9caa] via-[#b0b8c1] to-[#8d9caa]">
            ★ Most Popular
          </span>
        </div>
        <div className="h-1 w-full bg-gradient-to-r from-[#8d9caa] via-[#b0b8c1] to-[#8d9caa]" />
        <div className="px-6 py-5 border-b border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[1.1rem] font-extrabold uppercase tracking-widest text-[#b0b8c1]">Silver</span>
            <span className="inline-block w-6 h-0.5 rounded bg-gradient-to-r from-[#8d9caa] to-[#b0b8c1]" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[2.25rem] font-bold text-white">{price}</span>
            {oldPrice && <span className="text-[1.05rem] text-slate-400 line-through">{oldPrice}</span>}
            <span className="px-2 py-0.5 rounded-full border border-teal-400 bg-teal-400/10 text-teal-400 text-[0.9rem] font-semibold">22% off</span>
          </div>
          <p className="text-[1rem] font-semibold mt-1 text-slate-400">{subtitle}</p>
        </div>
        <div className="px-6 pt-5 pb-6 flex flex-col flex-1">
          <ul className="space-y-2 flex-1">
            {features.map((feature) => {
              const isHighlighted = highlightedFeatures.includes(feature)
              return (
                <li key={feature} className={`flex items-start gap-2 text-[1rem] ${isHighlighted ? 'text-white font-bold' : 'text-slate-400 font-semibold'}`}>
                  <svg className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${isHighlighted ? 'text-[#b0b8c1]' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              )
            })}
          </ul>
          <Link
            href="/contact?plan=Silver"
            className="mt-6 block w-full text-center py-2.5 rounded-xl font-semibold text-[1.05rem] text-[#0f1117] transition-all bg-silver-gradient"
          >
            Book Most Popular One
          </Link>
        </div>
      </article>
    )
  }

  if (tier === 'gold') {
    return (
      <article
        className="flex flex-col rounded-2xl overflow-hidden bg-ink border border-[#c9a84c]/30 relative shadow-gold-glow transition-shadow duration-300 hover:shadow-gold-glow-hover"
      >
        <div className="absolute top-4 right-4 z-10">
          <span
            className="inline-flex items-center px-2.5 py-1 rounded-full text-[0.9rem] font-bold text-[#0f1117] bg-gold-gradient"
          >
            ★ Best Value
          </span>
        </div>
        <div className="h-1 w-full bg-gold-bar-gradient" />
        <div className="px-6 py-5 border-b border-white/10">
          <span className="text-[1.1rem] font-extrabold uppercase tracking-widest text-[#f0d080]">Gold</span>
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <span className="text-[2.25rem] font-bold text-white">{price}</span>
            {oldPrice && <span className="text-[1.05rem] text-slate-400 line-through">{oldPrice}</span>}
            <span className="px-2 py-0.5 rounded-full border border-teal-400 bg-teal-400/10 text-teal-400 text-[0.9rem] font-semibold">25% off</span>
          </div>
          <p className="text-[1rem] font-semibold mt-1 text-slate-400">{subtitle}</p>
        </div>
        <div className="px-6 pt-5 pb-6 flex flex-col flex-1">
          <ul className="space-y-[0.6rem] flex-1">
            {features.map((feature) => {
              const isHighlighted = highlightedFeatures.includes(feature)
              return (
                <li key={feature} className={`flex items-start gap-2 text-[1rem] ${isHighlighted ? 'text-white font-bold' : 'text-slate-400 font-semibold'}`}>
                  <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[#f0d080]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              )
            })}
          </ul>
          <Link
            href="/contact?plan=Gold"
            className="mt-6 block w-full text-center py-2.5 rounded-xl font-bold text-[1.05rem] text-[#0f1117] transition-all bg-gold-gradient"
          >
            Book Gold
          </Link>
        </div>
      </article>
    )
  }

  return (
    <article className="relative flex flex-col rounded-2xl overflow-hidden shadow-card bg-white ring-1 ring-slate-200">
      <div className="bg-ink px-6 py-5">
        <h3 className="text-lg font-bold text-white">{name}</h3>
        <div className="flex items-baseline gap-1 mt-2">
          <span className="text-[2.25rem] font-extrabold text-white">{price}</span>
        </div>
        <p className="text-[1.05rem] mt-1 text-white/70">{subtitle}</p>
      </div>
      <div className="flex-1 px-6 py-5">
        <ul className="space-y-2.5">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-[1.05rem] text-slate-700">
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
          className="block w-full text-center py-3 rounded-xl font-semibold text-[1.05rem] bg-ink hover:bg-slate-800 text-white transition-all"
        >
          Book This Package
        </Link>
      </div>
    </article>
  )
}
