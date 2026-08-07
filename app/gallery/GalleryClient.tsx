'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const showcaseImages = [
  {
    src: '/images/gallery/showcase/showcase-1.jpg.png',
    alt: 'Dark luxury sedan after full exterior detail and paint correction — Teal Detailing South Florida',
    priority: true,
  },
  {
    src: '/images/gallery/showcase/showcase-2.jpg.jpg',
    alt: 'Sports car with ceramic coating applied — deep gloss finish by Teal Detailing',
    priority: true,
  },
  {
    src: '/images/gallery/showcase/showcase-3.jpg.jpg',
    alt: 'SUV exterior detail complete — clean paint with wax sealant by Teal Detailing South Florida',
  },
  {
    src: '/images/gallery/showcase2/lambo-urus-after.jpg',
    alt: 'Purple Lamborghini Urus after full exterior detail — deep gloss finish by Teal Detailing',
  },
  {
    src: '/images/gallery/showcase2/amg-sl-after.jpg',
    alt: 'Black Mercedes-AMG SL after exterior detail — mirror-like paint finish by Teal Detailing',
  },
  {
    src: '/images/gallery/showcase2/porsche-356-front.jpg',
    alt: 'Classic green Porsche 356 after full detail and paint correction by Teal Detailing',
  },
  {
    src: '/images/gallery/showcase2/camaro-after.jpg',
    alt: 'Black Chevrolet Camaro after exterior detail — deep gloss finish by Teal Detailing',
  },
]

const wheelImages = [
  {
    src: '/images/gallery/showcase2/urus-wheel-detail.jpg',
    alt: 'Lamborghini Urus wheel and brake caliper after deep rim cleaning by Teal Detailing',
  },
  {
    src: '/images/gallery/showcase2/amg-wheel-detail.jpg',
    alt: 'Mercedes-AMG wheel with yellow brake calipers after detailed rim cleaning by Teal Detailing',
  },
  {
    src: '/images/gallery/showcase2/porsche-wheel-detail.jpg',
    alt: 'Classic Porsche 356 chrome wheel polished to a mirror shine by Teal Detailing',
  },
  {
    src: '/images/gallery/showcase2/yellow-caliper-wheel.jpg',
    alt: 'Deep-dish wheel with yellow brake caliper after detailed rim cleaning by Teal Detailing',
  },
]

const wheelBeforeAfter = [
  {
    src: '/images/gallery/showcase2/wheel-before.jpg',
    alt: 'Truck wheel before cleaning — caked in mud and road grime',
    label: 'Before',
  },
  {
    src: '/images/gallery/showcase2/wheel-after.jpg',
    alt: 'Same truck wheel after deep rim cleaning — mud and grime completely removed by Teal Detailing',
    label: 'After',
  },
]

const exteriorBeforeAfterPairs = [
  [
    {
      src: '/images/gallery/exterior-ba/silverado-before.jpg',
      alt: 'Chevrolet Silverado ZR2 before exterior detail — dust and road grime on the paint',
      label: 'Before',
    },
    {
      src: '/images/gallery/exterior-ba/silverado-after.jpg',
      alt: 'Chevrolet Silverado ZR2 after exterior detail — clean, glossy paint by Teal Detailing',
      label: 'After',
    },
  ],
  [
    {
      src: '/images/gallery/exterior-ba/silverado2-before.jpg',
      alt: 'Lifted Chevrolet Silverado before exterior detail — caked in mud from off-road driving',
      label: 'Before',
    },
    {
      src: '/images/gallery/exterior-ba/silverado2-after.jpg',
      alt: 'Same lifted Chevrolet Silverado after exterior detail — mud completely removed, paint restored by Teal Detailing',
      label: 'After',
    },
  ],
]

const interiorImages = [
  {
    src: '/images/gallery/interiors/9.png',
    alt: 'Vehicle interior before professional detailing — stained upholstery and dirty floor mats',
    label: 'Before',
  },
  {
    src: '/images/gallery/interiors/15.png',
    alt: 'Vehicle interior after professional detailing — clean leather seats and spotless carpet by Teal Detailing',
    label: 'After',
  },
  {
    src: '/images/gallery/interiors/22.png',
    alt: 'Car cabin before interior deep clean — accumulated dirt on dashboard and console',
    label: 'Before',
  },
  {
    src: '/images/gallery/interiors/24.png',
    alt: 'Car cabin after interior deep clean — pristine dashboard, conditioned leather, and fresh carpet by Teal Detailing',
    label: 'After',
  },
]

const interiorHighlights = [
  {
    src: '/images/gallery/interiors2/bmw-x7-interior.jpg',
    alt: 'BMW X7 tan leather interior after full detail, with protective steering wheel wrap and floor mat by Teal Detailing',
  },
  {
    src: '/images/gallery/interiors2/nissan-interior.jpg',
    alt: 'Nissan Sentra interior after detail, with complimentary gift bag and protective coverings by Teal Detailing',
  },
  {
    src: '/images/gallery/interiors2/porsche-356-interior.jpg',
    alt: 'Classic Porsche 356 tan leather interior detailed to showroom condition by Teal Detailing',
  },
]

const foamImages = [
  {
    src: '/images/gallery/foam/foam-1.jpg.jpg',
    alt: 'White foam pre-wash applied to vehicle during detailing process — Teal Detailing South Florida',
  },
  {
    src: '/images/gallery/foam/foam-2.jpg.jpg',
    alt: 'Foam cannon treatment covering full vehicle exterior — safe paint decontamination step',
  },
  {
    src: '/images/gallery/foam/foam-3.jpg.jpg',
    alt: 'Thick pre-wash foam on SUV during professional detail — Teal Detailing process',
  },
  {
    src: '/images/gallery/foam/foam-4.jpg.jpg',
    alt: 'Foam treatment close-up on car panel — professional pre-soak for safe washing by Teal Detailing',
  },
  {
    src: '/images/gallery/foam2/amg-foam.jpg',
    alt: 'Mercedes-AMG fully covered in foam pre-wash under South Florida trees — Teal Detailing process',
  },
  {
    src: '/images/gallery/foam2/camaro-foam.jpg',
    alt: 'Black Chevrolet Camaro covered in foam pre-wash — Teal Detailing process',
  },
]

type LightboxImage = { src: string; alt: string }

export default function GalleryClient() {
  const [lightbox, setLightbox] = useState<LightboxImage | null>(null)

  function openLightbox(img: LightboxImage) {
    setLightbox(img)
  }

  function closeLightbox() {
    setLightbox(null)
  }

  return (
    <>
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

      {/* Sticky section nav */}
      <nav
        className="sticky top-16 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm"
        aria-label="Gallery sections"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide">
            {[
              { href: '#showcase', label: 'Showcase' },
              { href: '#exterior-ba', label: 'Exterior Before & After' },
              { href: '#wheels', label: 'Wheel Detail' },
              { href: '#interior', label: 'Interior Detailing' },
              { href: '#foam', label: 'Foam Treatment' },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-teal-600 hover:bg-teal-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Section 1 — Showcase */}
      <section id="showcase" className="py-20 bg-ink" aria-labelledby="showcase-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-400 mb-2">Results</p>
            <h2 id="showcase-heading" className="text-3xl font-extrabold text-white">Our Work</h2>
          </div>
          <div role="img" aria-label="Showcase gallery of Teal Detailing results" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {showcaseImages.map((img, i) => (
              <button
                key={img.src}
                onClick={() => openLightbox(img)}
                className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-black group focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                aria-label={`View full size: ${img.alt}`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-contain group-hover:scale-105 transition-transform duration-500"
                  priority={img.priority}
                  loading={i < 2 ? 'eager' : 'lazy'}
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Section 1b — Exterior Before & After */}
      <section id="exterior-ba" className="py-20 bg-ink border-t border-white/5" aria-labelledby="exterior-ba-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-400 mb-2">Before & After</p>
            <h2 id="exterior-ba-heading" className="text-3xl font-extrabold text-white">Exterior Transformations</h2>
            <p className="text-slate-400 mt-2 text-sm">Real results from a full exterior detail — no filters, no staging</p>
          </div>
          <div className="flex flex-col gap-6">
            {exteriorBeforeAfterPairs.map((pair, pairIndex) => (
              <div
                key={pairIndex}
                role="img"
                aria-label="Exterior detailing before and after"
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {pair.map((img) => (
                  <button
                    key={img.src}
                    onClick={() => openLightbox(img)}
                    className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-black group focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                    aria-label={`View full size: ${img.alt}`}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-contain group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        img.label === 'Before'
                          ? 'bg-slate-700/90 text-slate-200'
                          : 'bg-teal-700/90 text-white'
                      }`}>
                        {img.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 1c — Wheel Detail */}
      <section id="wheels" className="py-20 bg-ink border-t border-white/5" aria-labelledby="wheels-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-400 mb-2">Detail Work</p>
            <h2 id="wheels-heading" className="text-3xl font-extrabold text-white">Wheel & Rim Detail</h2>
            <p className="text-slate-400 mt-2 text-sm">Every package includes deep rim cleaning — here&apos;s what that looks like up close</p>
          </div>

          {/* Wheel before/after highlight */}
          <div role="img" aria-label="Wheel before and after deep cleaning" className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {wheelBeforeAfter.map((img) => (
              <button
                key={img.src}
                onClick={() => openLightbox(img)}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                aria-label={`View full size: ${img.alt}`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                <div className="absolute top-3 left-3">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                    img.label === 'Before'
                      ? 'bg-slate-700/90 text-slate-200'
                      : 'bg-teal-700/90 text-white'
                  }`}>
                    {img.label}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div role="img" aria-label="Wheel and rim detail gallery" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {wheelImages.map((img) => (
              <button
                key={img.src}
                onClick={() => openLightbox(img)}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                aria-label={`View full size: ${img.alt}`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2 — Interior Before & After */}
      <section id="interior" className="py-20 bg-ink" aria-labelledby="interior-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-400 mb-2">Before & After</p>
            <h2 id="interior-heading" className="text-3xl font-extrabold text-white">Interior Detailing</h2>
            <p className="text-slate-400 mt-2 text-sm">Side-by-side results from our hot-water extraction and deep clean process</p>
          </div>
          <div role="img" aria-label="Interior detailing before and after gallery" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {interiorImages.map((img) => (
              <button
                key={img.src}
                onClick={() => openLightbox(img)}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                aria-label={`View full size: ${img.alt}`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                <div className="absolute top-3 left-3">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                    img.label === 'Before'
                      ? 'bg-slate-700/90 text-slate-200'
                      : 'bg-teal-700/90 text-white'
                  }`}>
                    {img.label}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* More interior highlights */}
          <div className="mt-12">
            <h3 className="text-lg font-semibold text-white mb-4">More Interior Results</h3>
            <div role="img" aria-label="Additional interior detailing highlights" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {interiorHighlights.map((img) => (
                <button
                  key={img.src}
                  onClick={() => openLightbox(img)}
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                  aria-label={`View full size: ${img.alt}`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 — Foam Treatment */}
      <section id="foam" className="py-20 bg-ink" aria-labelledby="foam-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-400 mb-2">Process</p>
            <h2 id="foam-heading" className="text-3xl font-extrabold text-white">The Detail Process</h2>
            <p className="text-slate-400 mt-2 text-sm">Our foam pre-wash stage safely loosens contaminants before contact washing</p>
          </div>
          <div
            role="img"
            aria-label="Foam treatment process gallery"
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {foamImages.map((img) => (
              <button
                key={img.src}
                onClick={() => openLightbox(img)}
                className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-black group focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                aria-label={`View full size: ${img.alt}`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-contain group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div
            className="relative w-full max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightbox.src}
              alt={lightbox.alt}
              width={1200}
              height={900}
              className="object-contain w-full h-full max-h-[85vh]"
              sizes="100vw"
            />
          </div>
        </div>
      )}

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
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-semibold transition-all hover:shadow-glow"
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
