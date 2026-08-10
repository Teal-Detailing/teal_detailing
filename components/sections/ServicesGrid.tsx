import Image from 'next/image'
import Link from 'next/link'
import { servicesData, type ServiceSlug } from '@/lib/services'

type SpecialtySlug = Exclude<ServiceSlug, 'mobile-car-detailing'>

const services: { slug: SpecialtySlug; ext?: string; desc: string; focus?: string }[] = [
  {
    slug: 'stain-removal',
    ext: 'webp',
    desc: 'Targeted treatment to lift tough stains from seats, carpets, and upholstery — leaving your interior fresh and spotless.',
  },
  {
    slug: 'headlight-restoration',
    ext: 'png',
    desc: 'Restore crystal-clear visibility and fresh looks with our multi-stage restoration process.',
  },
  {
    slug: 'clay-bar-treatment',
    desc: 'Remove embedded contaminants for silky-smooth paint that wax alone can\'t achieve.',
  },
  {
    slug: 'ceramic-coating',
    desc: 'Nano-ceramic protection that bonds to your paint for years of hydrophobic shine.',
  },
  {
    slug: 'exterior-detailing',
    desc: 'Full hand wash, clay bar, polish, and wax to restore your car\'s showroom shine.',
  },
  {
    slug: 'interior-detailing',
    desc: 'Deep clean every surface — hot-water extraction, leather conditioning, and odor elimination.',
    focus: 'object-bottom',
  },
  {
    slug: 'engine-bay-cleaning',
    desc: 'Professional degreasing and detailing of your engine bay — removes grime, improves appearance, and helps spot leaks early.',
  },
  {
    slug: 'paint-correction',
    desc: 'Machine polish removes swirl marks, scratches, and oxidation for a mirror-like finish.',
  },
  {
    slug: 'pet-hair-removal',
    desc: 'Specialized techniques to extract embedded pet hair from every seat, carpet, and crevice.',
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
          {services.map(({ slug, desc, ext = 'jpg', focus = 'object-center' }) => {
          const { name, price } = servicesData[slug]
          return (
            <article
              key={slug}
              className="group relative bg-white rounded-[28px] overflow-hidden border border-slate-100 shadow-card hover:shadow-2xl transition-all duration-500 flex flex-col"
            >
              <div className="relative w-full h-52 overflow-hidden">
                <Image
                  src={`/services/${slug}.${ext}`}
                  alt={name}
                  fill
                  className={`object-cover ${focus} transition-transform duration-700 ease-out group-hover:scale-110`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0" />
                <div className="absolute top-3 right-3">
                  <span className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-teal-700 text-xs font-bold tracking-wide shadow-sm">
                    {price}
                  </span>
                </div>
              </div>
              <div className="p-5 flex flex-col gap-2 flex-1">
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
