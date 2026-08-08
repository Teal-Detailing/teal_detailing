import Link from 'next/link'

function discountPercent(price: string, oldPrice?: string): number | null {
  if (!oldPrice) return null
  const current = parseFloat(price.replace(/[^0-9.]/g, ''))
  const original = parseFloat(oldPrice.replace(/[^0-9.]/g, ''))
  if (!original || !current || current >= original) return null
  return Math.round(((original - current) / original) * 100)
}

interface PricingCardProps {
  name: string
  price: string
  oldPrice?: string
  subtitle: string
  features: string[]
  highlightedFeatures?: string[]
  tier?: 'economy' | 'silver' | 'gold'
  startingAt?: boolean
}

const tierStyles = {
  economy: {
    eyebrow: 'text-slate-300',
    ring: 'ring-white/10',
    bar: 'bg-graphite-bar-gradient',
    accentBorder: 'border-slate-400/50',
    accentBg: 'bg-slate-300',
    accentText: 'text-slate-300',
    glow: 'hover:shadow-graphite-glow-hover',
    button: 'bg-graphite-gradient text-[#0f1117] hover:brightness-110',
    badge: null as { label: string } | null,
  },
  silver: {
    eyebrow: 'text-[#dfe4e9]',
    ring: 'ring-[#b0b8c1]/30',
    bar: 'bg-silver-gradient',
    accentBorder: 'border-[#b0b8c1]/60',
    accentBg: 'bg-[#b0b8c1]',
    accentText: 'text-[#cfd8e3]',
    glow: 'hover:shadow-silver-glow-hover',
    button: 'bg-silver-gradient text-[#0f1117] hover:brightness-110',
    badge: { label: 'Most Popular' },
  },
  gold: {
    eyebrow: 'text-[#f0d080]',
    ring: 'ring-[#c9a84c]/35',
    bar: 'bg-gold-bar-gradient',
    accentBorder: 'border-[#c9a84c]/60',
    accentBg: 'bg-[#f0d080]',
    accentText: 'text-[#f0d080]',
    glow: 'hover:shadow-gold-glow-hover',
    button: 'bg-gold-gradient text-[#1a1200] hover:brightness-110',
    badge: { label: 'Best Value' },
  },
} as const

export default function PricingCard({
  name,
  price,
  oldPrice,
  subtitle,
  features,
  highlightedFeatures = [],
  tier = 'economy',
  startingAt = false,
}: PricingCardProps) {
  const style = tierStyles[tier]
  const discount = discountPercent(price, oldPrice)

  return (
    <article
      className={`relative flex flex-col rounded-[28px] overflow-hidden bg-gradient-to-b from-[#181b21] to-[#0a0c0f] ring-1 shadow-dark-card transition-all duration-300 ${style.ring} ${style.glow}`}
    >
      <div className={`h-[3px] w-full ${style.bar}`} />

      {style.badge && (
        <div className="absolute top-5 right-5 z-10">
          <span
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[0.7rem] font-bold uppercase tracking-wider backdrop-blur-sm border ${
              tier === 'gold'
                ? 'bg-[#c9a84c]/15 border-[#c9a84c]/50 text-[#f0d080]'
                : 'bg-white/10 border-white/30 text-white'
            }`}
          >
            <span aria-hidden="true">★</span> {style.badge.label}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="px-8 pt-8 pb-6">
        <span className={`text-xs font-bold uppercase tracking-[0.3em] ${style.eyebrow}`}>
          {name}
        </span>

        {startingAt && (
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-slate-400 mt-4">
            Starting at
          </p>
        )}
        <div className={`flex items-end gap-2 flex-wrap ${startingAt ? 'mt-1' : 'mt-4'}`}>
          <span className="text-5xl sm:text-6xl font-black tracking-tight text-white leading-none">
            {price}
          </span>
          {oldPrice && (
            <span className="text-base text-slate-400 line-through mb-1.5">{oldPrice}</span>
          )}
        </div>
        {discount !== null && (
          <span
            className={`inline-flex mt-3 px-2.5 py-1 rounded-full border text-[0.75rem] font-bold tracking-wide ${style.accentBorder} ${style.accentText}`}
          >
            {discount}% OFF
          </span>
        )}

        <p className="text-slate-400 text-sm font-medium leading-relaxed mt-4">{subtitle}</p>
      </div>

      <div className="mx-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Features */}
      <div className="px-8 pt-6 pb-8 flex flex-col flex-1">
        <ul className="space-y-3 flex-1">
          {features.map((feature) => {
            const isHighlighted = highlightedFeatures.includes(feature)
            return (
              <li key={feature} className="flex items-start gap-3">
                <span
                  className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isHighlighted ? `${style.accentBg} border-transparent` : `border ${style.accentBorder}`
                  }`}
                >
                  <svg
                    className={`w-2.5 h-2.5 ${isHighlighted ? 'text-[#0f1117]' : style.accentText}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span
                  className={`text-[0.95rem] leading-snug ${
                    isHighlighted ? 'text-white font-semibold' : 'text-slate-400 font-medium'
                  }`}
                >
                  {feature}
                </span>
              </li>
            )
          })}
        </ul>

        <Link
          href={`/contact?plan=${encodeURIComponent(name)}`}
          className={`mt-7 block w-full text-center py-3.5 rounded-2xl font-bold text-[1.05rem] tracking-wide transition-all duration-300 shadow-lg ${style.button}`}
        >
          Book {name}
        </Link>
      </div>
    </article>
  )
}
