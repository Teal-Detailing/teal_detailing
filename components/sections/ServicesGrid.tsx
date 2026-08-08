import Image from 'next/image'
import Link from 'next/link'
import { servicesData, type ServiceSlug } from '@/lib/services'

type SpecialtySlug = Exclude<ServiceSlug, 'mobile-car-detailing'>

const services: { slug: SpecialtySlug; ext?: string; desc: string; icon: string }[] = [
  {
    slug: 'stain-removal',
    ext: 'webp',
    desc: 'Targeted treatment to lift tough stains from seats, carpets, and upholstery — leaving your interior fresh and spotless.',
    icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
  },
  {
    slug: 'headlight-restoration',
    ext: 'png',
    desc: 'Restore crystal-clear visibility and fresh looks with our multi-stage restoration process.',
    icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
  },
  {
    slug: 'clay-bar-treatment',
    desc: 'Remove embedded contaminants for silky-smooth paint that wax alone can\'t achieve.',
    icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01',
  },
  {
    slug: 'ceramic-coating',
    desc: 'Nano-ceramic protection that bonds to your paint for years of hydrophobic shine.',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  },
  {
    slug: 'exterior-detailing',
    desc: 'Full hand wash, clay bar, polish, and wax to restore your car\'s showroom shine.',
    icon: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z',
  },
  {
    slug: 'interior-detailing',
    desc: 'Deep clean every surface — hot-water extraction, leather conditioning, and odor elimination.',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  },
  {
    slug: 'engine-bay-cleaning',
    desc: 'Professional degreasing and detailing of your engine bay — removes grime, improves appearance, and helps spot leaks early.',
    icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4',
  },
  {
    slug: 'paint-correction',
    desc: 'Machine polish removes swirl marks, scratches, and oxidation for a mirror-like finish.',
    icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z',
  },
  {
    slug: 'pet-hair-removal',
    desc: 'Specialized techniques to extract embedded pet hair from every seat, carpet, and crevice.',
    icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
  },
]

export default function ServicesGrid() {
  return (
    <section className="py-20 bg-white" aria-labelledby="services-grid-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12">
          <p className="text-[0.9rem] font-semibold uppercase tracking-widest text-teal-700 mb-3">
            Services
          </p>
          <h2 id="services-grid-heading" className="text-[2.16rem] sm:text-[2.88rem] font-extrabold text-slate-900">
            Additional Services
          </h2>
          <p className="mt-3 text-slate-500 max-w-xl mx-auto text-[1.2rem] leading-relaxed">
            Beyond our core packages, we offer a range of specialized services — all performed at your home or office across South Florida.
          </p>
        </div>

        {/* 2-col mobile, 4-col desktop grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(({ slug, desc, icon, ext = 'jpg' }) => {
          const { name, price } = servicesData[slug]
          return (
            <article
              key={slug}
              className="group bg-white rounded-[28px] overflow-hidden border border-slate-100 shadow-card hover:shadow-2xl transition-all duration-500 flex flex-col"
            >
              <div className="relative w-full h-52 overflow-hidden">
                <Image
                  src={`/services/${slug}.${ext}`}
                  alt={name}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0" />
                <div className="absolute top-3 right-3">
                  <span className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-teal-700 text-xs font-bold tracking-wide shadow-sm">
                    {price}
                  </span>
                </div>
                <div className="absolute left-5 -bottom-[22px] w-11 h-11 rounded-xl bg-ink shadow-lg flex items-center justify-center ring-4 ring-white flex-shrink-0">
                  <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={icon} />
                  </svg>
                </div>
              </div>
              <div className="p-5 pt-8 flex flex-col gap-2 flex-1">
                <h3 className="font-bold text-slate-900 text-[1.1rem] tracking-tight">{name}</h3>
                <p className="text-[0.9rem] text-slate-500 leading-relaxed flex-1">{desc}</p>
                <Link
                  href={`/services/${slug}`}
                  className="inline-flex items-center gap-1.5 text-[0.9rem] font-semibold text-teal-700 hover:text-teal-600 transition-all group-hover:gap-2.5 mt-2"
                >
                  Learn More<span className="sr-only"> about {name}</span>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </article>
          )
          })}
        </div>
      </div>
    </section>
  )
}
