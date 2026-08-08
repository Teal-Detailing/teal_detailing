import type { Metadata } from 'next'
import Link from 'next/link'
import BookingForm from '@/components/ui/BookingForm'

export const metadata: Metadata = {
  title: 'Auto Detailing in Palm Beach County',
  description:
    'Teal Detailing offers premium mobile car detailing throughout Palm Beach County. Boca Raton, West Palm Beach, Delray Beach, Boynton Beach, and surrounding areas.',
  openGraph: {
    title: 'Auto Detailing in Palm Beach County | Teal Detailing',
    description:
      'Teal Detailing offers premium mobile car detailing throughout Palm Beach County. Boca Raton, West Palm Beach, Delray Beach, Boynton Beach, and surrounding areas.',
    url: 'https://tealdetailing.com/palm-beach',
    images: [{ url: '/images/icons/logo-1024.webp', width: 1024, height: 1024, alt: 'Teal Detailing' }],
  },
  alternates: { canonical: 'https://tealdetailing.com/palm-beach' },
}

const neighborhoods = [
  { name: 'Boca Raton', href: '/boca-raton/mobile-car-detailing' },
  { name: 'West Palm Beach' }, { name: 'Delray Beach' }, { name: 'Boynton Beach' },
  { name: 'Lake Worth' }, { name: 'Wellington' }, { name: 'Palm Beach Gardens' }, { name: 'Jupiter' },
  { name: 'Royal Palm Beach' }, { name: 'Greenacres' }, { name: 'Riviera Beach' }, { name: 'North Palm Beach' },
  { name: 'Palm Beach' }, { name: 'Tequesta' }, { name: 'Loxahatchee' }, { name: 'Lantana' },
]

const areaServices = [
  { slug: 'ceramic-coating', name: 'Ceramic Coating' },
  { slug: 'clay-bar-treatment', name: 'Clay Bar Treatment' },
  { slug: 'exterior-detailing', name: 'Exterior Detailing' },
  { slug: 'headlight-restoration', name: 'Headlight Restoration' },
  { slug: 'interior-detailing', name: 'Interior Detailing' },
  { slug: 'mobile-car-detailing', name: 'Mobile Car Detailing' },
  { slug: 'paint-correction', name: 'Paint Correction' },
  { slug: 'pet-hair-removal', name: 'Pet Hair Removal' },
  { slug: 'stain-removal', name: 'Stain Removal' },
  { slug: 'engine-bay-cleaning', name: 'Engine Bay Cleaning' },
]

export default function PalmBeachPage() {
  return (
    <>
      <section className="bg-hero-gradient pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-400 mb-4">
            Service Area
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Car Detailing in Palm Beach County
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed max-w-2xl mx-auto">
            Teal Detailing brings concierge-level mobile car detailing to Palm Beach County.
            From Boca Raton estates to Jupiter waterfront homes — we detail where luxury
            lives.
          </p>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                We Serve All of Palm Beach County
              </h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Our Palm Beach technicians are experienced with luxury and exotic vehicles.
                We handle everything from daily drivers to weekend Porsches with the same
                meticulous attention to detail.
              </p>
              <div className="grid grid-cols-2 gap-2 mb-8">
                {neighborhoods.map((n) => (
                  <div key={n.name} className="flex items-center gap-2 text-sm text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0" />
                    {n.href ? (
                      <Link href={n.href} className="hover:text-teal-700 hover:underline transition-colors">
                        {n.name}
                      </Link>
                    ) : (
                      n.name
                    )}
                  </div>
                ))}
              </div>
              <div className="bg-teal-50 rounded-2xl p-5 border border-teal-100">
                <h3 className="font-semibold text-teal-900 mb-2">
                  Palm Beach County Luxury Offer
                </h3>
                <p className="text-sm text-teal-800 leading-relaxed">
                  Gold package clients in Palm Beach County receive a complimentary
                  engine bay inspection and cabin air filter check — compliments of Teal Detailing.
                </p>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-2xl shadow-card-hover border border-slate-100 p-6">
                <BookingForm location="Palm Beach County" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" aria-labelledby="pb-services-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 id="pb-services-heading" className="text-2xl font-bold text-slate-900">
              Services Available in Palm Beach County
            </h2>
            <p className="text-slate-500 mt-2 text-sm">
              All 10 services available county-wide — we come to you
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {areaServices.map(({ slug, name }) => (
              <Link
                key={slug}
                href={`/palm-beach/${slug}`}
                className="group flex flex-col items-center gap-2 p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:border-teal-300 hover:bg-teal-50 transition-colors text-center"
              >
                <span className="text-sm font-semibold text-slate-800 group-hover:text-teal-700 transition-colors">
                  {name}
                </span>
                <span className="text-xs text-teal-700 font-medium">Learn More →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50" aria-labelledby="pb-why-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 id="pb-why-heading" className="text-2xl font-bold text-slate-900 mb-4">
            Premium Care for Discerning Palm Beach Drivers
          </h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Palm Beach County is home to some of Florida&apos;s finest vehicles. Our
            technicians are trained on luxury finishes — matte paint, carbon fiber, chrome
            delete, and delicate leather interiors — and use only the safest, most effective
            products available.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { title: 'Luxury Vehicle Expertise', desc: 'Trained on exotic and luxury finishes including matte, satin, and PPF-wrapped vehicles' },
              { title: 'White-Glove Service', desc: 'Booties, microfiber-only contact, and careful handling of every interior surface' },
              { title: 'Discreet & Professional', desc: 'We work efficiently and quietly — perfect for home, office, or gated community' },
            ].map(({ title, desc }) => (
              <div key={title} className="bg-white rounded-xl p-5 text-left shadow-card border border-slate-100">
                <h3 className="font-semibold text-slate-900 text-sm mb-2">{title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-hero-gradient py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-extrabold text-white mb-3">
            Ready to Book in Palm Beach County?
          </h2>
          <p className="text-slate-300 mb-6 text-sm">
            Same-week availability · No travel fees · 5-star service guaranteed
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact" className="px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-semibold text-sm transition-all hover:shadow-glow">
              Book Online
            </Link>
            <a href="tel:+16452488292" className="px-6 py-3 rounded-xl border border-white/20 text-white font-semibold text-sm hover:bg-white/10 transition-colors">
              Call (645) 248-8292
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
