import { Fragment } from 'react'

const steps = [
  {
    number: '1',
    title: 'Choose Your Package or Service',
    desc: 'Pick Economy, Silver, Gold, or the standalone service your vehicle needs.',
    duration: '~30 seconds',
  },
  {
    number: '2',
    title: 'Pick Your Time',
    desc: 'Morning, afternoon or evening appointments available.',
    duration: '~2 minutes',
  },
  {
    number: '3',
    title: 'We Come Fully Equipped',
    desc: 'We arrive with water, power, premium products, and quiet battery-powered equipment. No hoses. No loud generators. No setup required.',
    duration: 'Typical detailing package: 1–4 hours',
  },
  {
    number: '4',
    title: 'Relax While We Work',
    desc: "Spend time with family, work from home, or enjoy your day. Inspect the results and pay only once we're done.",
    duration: 'Ready to Drive',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-20 bg-ink border-t border-white/5" aria-labelledby="how-it-works-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-[0.9rem] font-semibold uppercase tracking-widest text-teal-400 mb-3">
            How It Works
          </p>
          <h2 id="how-it-works-heading" className="text-[2.16rem] sm:text-[2.88rem] font-extrabold text-white">
            From Booking to Showroom-Clean
          </h2>
          <p className="mt-3 text-slate-400 max-w-xl mx-auto text-[1.2rem] leading-relaxed">
            No water, no power, no prep — just book and we take it from there.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] gap-6 lg:gap-3 items-stretch">
          {steps.map((step, i) => (
            <Fragment key={step.number}>
              <div className="flex flex-col items-center text-center gap-3 bg-gradient-to-b from-[#181b21] to-[#0a0c0f] ring-1 ring-white/10 rounded-[28px] px-6 py-8">
                <div className="w-14 h-14 rounded-full bg-teal-500/10 border-2 border-teal-400 flex items-center justify-center shadow-glow flex-shrink-0">
                  <span className="text-2xl font-extrabold text-teal-400">{step.number}</span>
                </div>
                <h3 className="font-bold text-white text-lg mt-1">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed flex-1">{step.desc}</p>
                <span className="px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold text-center">
                  {step.duration}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="flex items-center justify-center py-1 lg:py-0 lg:pt-14" aria-hidden="true">
                  <svg className="w-6 h-6 text-teal-500/40 rotate-90 lg:rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}
