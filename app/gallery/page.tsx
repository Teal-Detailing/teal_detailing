import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Our Work — Gallery',
  description:
    'See real results from Teal Detailing\'s work across South Florida. Ceramic coatings, paint corrections, interior details, and more.',
}

const galleryItems = [
  { aspect: 'aspect-[4/3]', cols: 'col-span-1', label: 'Ceramic Coating', location: 'Brickell, Miami' },
  { aspect: 'aspect-[4/3]', cols: 'col-span-1', label: 'Paint Correction', location: 'Coral Gables' },
  { aspect: 'aspect-[4/3]', cols: 'col-span-1', label: 'Interior Detail', location: 'Doral' },
  { aspect: 'aspect-[4/3]', cols: 'col-span-2', label: 'Full Gold Package', location: 'Fort Lauderdale' },
  { aspect: 'aspect-[4/3]', cols: 'col-span-1', label: 'Exterior Detail', location: 'Boca Raton' },
  { aspect: 'aspect-[4/3]', cols: 'col-span-1', label: 'Headlight Restoration', location: 'Pembroke Pines' },
  { aspect: 'aspect-[4/3]', cols: 'col-span-1', label: 'Clay Bar Treatment', location: 'Aventura' },
  { aspect: 'aspect-[4/3]', cols: 'col-span-1', label: 'Interior Detail', location: 'Weston' },
  { aspect: 'aspect-[4/3]', cols: 'col-span-2', label: 'Ceramic Coating', location: 'Hollywood' },
  { aspect: 'aspect-[4/3]', cols: 'col-span-1', label: 'Paint Correction', location: 'West Palm Beach' },
  { aspect: 'aspect-[4/3]', cols: 'col-span-1', label: 'Pet Hair Removal', location: 'Hialeah' },
  { aspect: 'aspect-[4/3]', cols: 'col-span-1', label: 'Full Gold Package', location: 'Coconut Grove' },
]

export default function GalleryPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-hero-gradient pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-400 mb-4">
            Portfolio
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Our Work
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed max-w-2xl mx-auto">
            Transformations from across South Florida
          </p>
        </div>
      </section>

      {/* Gallery grid */}
      <section className="py-20 bg-slate-950" aria-labelledby="gallery-grid-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {galleryItems.map((item, i) => (
              <div
                key={i}
                className={`${item.cols} ${item.aspect} relative rounded-2xl overflow-hidden group`}
              >
                {/* Shimmer base */}
                <div className="absolute inset-0 animate-shimmer" />
                {/* Teal overlay */}
                <div className="absolute inset-0 bg-teal-500/10 group-hover:bg-teal-500/20 transition-colors duration-300" />
                {/* Camera icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-5 h-5 text-white/70"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
                {/* Label strip */}
                <div className="absolute bottom-0 left-0 right-0 px-3 py-2.5 bg-gradient-to-t from-black/70 to-transparent">
                  <p className="text-white text-xs font-semibold leading-tight">{item.label}</p>
                  <p className="text-slate-400 text-[10px] leading-tight mt-0.5">{item.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-hero-gradient py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Ready for Results Like These?
          </h2>
          <p className="text-slate-300 mb-8 text-base leading-relaxed">
            We respond in 15 minutes. Same-week availability across South Florida.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-semibold transition-all hover:shadow-glow"
            >
              Get a Free Quote
            </Link>
            <a
              href="tel:+16452488292"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/10 transition-colors"
            >
              Call (645) 248-8292
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
