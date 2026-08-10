const highlights = [
  {
    icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
    stat: '5.0★',
    title: 'Rated by South Florida',
    desc: '700+ five-star reviews from real customers across Miami-Dade, Broward & Palm Beach.',
  },
  {
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    stat: 'Fully Insured',
    title: 'Licensed & Background-Checked',
    desc: 'Every technician is vetted, trained in-house, and covered by full liability insurance.',
  },
  {
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    stat: 'Zero Hassle',
    title: 'No Water, No Power, No Noise',
    desc: 'Self-contained, battery-powered equipment — condo garages and office lots welcome.',
  },
  {
    icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
    stat: 'Premium-Only',
    title: 'Koch-Chemie · CarPro · Gyeon',
    desc: 'The same professional-grade products top detailers and enthusiasts trust worldwide.',
  },
]

export default function WhyTeal() {
  return (
    <section className="py-20 bg-ink border-t border-white/5" aria-labelledby="why-teal-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-[0.9rem] font-semibold uppercase tracking-widest text-teal-400 mb-3">
            Trusted By South Florida
          </p>
          <h2 id="why-teal-heading" className="text-[2.16rem] sm:text-[2.88rem] font-extrabold text-white">
            Why Choose Teal
          </h2>
          <p className="mt-3 text-slate-400 max-w-xl mx-auto text-[1.2rem] leading-relaxed">
            Not just another car wash — a professional-grade detail from a team South Florida already trusts.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-white/10">
          {highlights.map((h) => (
            <div key={h.title} className="flex flex-col items-center text-center gap-3 px-6 py-2 lg:py-0">
              <div className="w-14 h-14 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center shadow-glow">
                <svg className="w-6 h-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={h.icon} />
                </svg>
              </div>
              <span className="text-2xl font-black text-white tracking-tight mt-1">{h.stat}</span>
              <h3 className="text-sm font-bold uppercase tracking-wide text-teal-300">{h.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{h.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
