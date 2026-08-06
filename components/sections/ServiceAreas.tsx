import Image from 'next/image'

const cities = [
  'Miami',
  'Hialeah',
  'Doral',
  'Fort Lauderdale',
  'Hollywood',
  'Pembroke Pines',
  'Miramar',
  'Coral Springs',
  'Aventura',
  'Boca Raton',
  'West Palm Beach',
  '& Surrounding Areas',
]

function MapPin() {
  return (
    <svg className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

export default function ServiceAreas() {
  return (
    <section className="py-20 bg-ink border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left — text + cities */}
          <div>
            <p className="text-[0.9rem] font-semibold uppercase tracking-widest text-teal-400 mb-3">
              Where We Serve
            </p>
            <h2 className="text-[2.16rem] sm:text-[2.88rem] font-extrabold text-white leading-tight mb-4">
              Mobile Detailing<br />Service Areas
            </h2>
            <p className="text-slate-400 text-[1.1rem] leading-relaxed mb-8">
              We bring our full detailing setup directly to you — covering all of Miami-Dade, Broward, and Palm Beach counties. No drop-off needed.
            </p>

            <div className="grid grid-cols-3 gap-x-4 gap-y-3">
              {cities.map((city) => (
                <div key={city} className="flex items-start gap-2">
                  <MapPin />
                  <span className={`text-[0.95rem] leading-tight ${city === '& Surrounding Areas' ? 'text-teal-400 font-semibold' : 'text-slate-300 font-medium'}`}>
                    {city}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — van photo */}
          <div className="relative w-full h-72 lg:h-96 rounded-2xl overflow-hidden border border-white/10">
            <Image
              src="/images/van.png"
              alt="Teal Detailing service van"
              fill
              className="object-cover"
            />
          </div>

        </div>
      </div>
    </section>
  )
}
