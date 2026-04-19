import type { Metadata } from 'next'
import Link from 'next/link'
import BookingForm from '@/components/ui/BookingForm'

export const metadata: Metadata = {
  title: 'Auto Detailing in Broward County',
  description:
    'Teal Detailing provides premium mobile car detailing across Broward County. Fort Lauderdale, Hollywood, Pembroke Pines, Weston, and more. Same-week appointments available.',
  alternates: { canonical: 'https://tealdetailing.com/broward' },
  openGraph: {
    title: 'Auto Detailing in Broward County | Teal Detailing',
    description:
      'Teal Detailing provides premium mobile car detailing across Broward County. Fort Lauderdale, Hollywood, Pembroke Pines, Weston, and more.',
    url: 'https://tealdetailing.com/broward',
    images: [{ url: '/images/icons/logo-1024.webp', width: 1024, height: 1024, alt: 'Teal Detailing' }],
  },
}

const neighborhoods = [
  'Fort Lauderdale', 'Hollywood', 'Pembroke Pines', 'Miramar',
  'Weston', 'Davie', 'Plantation', 'Sunrise',
  'Coral Springs', 'Pompano Beach', 'Deerfield Beach', 'Hallandale Beach',
  'Dania Beach', 'Tamarac', 'Margate', 'Coconut Creek',
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
]

export default function BrowardPage() {
  return (
    <>
      <section className="bg-hero-gradient pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-400 mb-4">
            Service Area
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Car Detailing in Broward County
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed max-w-2xl mx-auto">
            From Fort Lauderdale to Coral Springs, Teal Detailing brings premium mobile car
            detailing directly to Broward County residents and businesses — with no hassle
            and no compromises on quality.
          </p>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                We Serve All of Broward County
              </h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Our Broward-based technicians cover the county coast to coast. Book online
                and choose your preferred date — we respond within 15 minutes.
              </p>
              <div className="grid grid-cols-2 gap-2 mb-8">
                {neighborhoods.map((n) => (
                  <div key={n} className="flex items-center gap-2 text-sm text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0" />
                    {n}
                  </div>
                ))}
              </div>
              <div className="bg-teal-50 rounded-2xl p-5 border border-teal-100">
                <h3 className="font-semibold text-teal-900 mb-2">
                  Broward County Special Offer
                </h3>
                <p className="text-sm text-teal-800 leading-relaxed">
                  New customers in Broward receive a complimentary interior air freshener
                  upgrade with any Economy or Silver package booking.
                </p>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-2xl shadow-card-hover border border-slate-100 p-6">
                <BookingForm location="Broward County" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" aria-labelledby="broward-services-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 id="broward-services-heading" className="text-2xl font-bold text-slate-900">
              Services Available in Broward County
            </h2>
            <p className="text-slate-500 mt-2 text-sm">
              All 8 services available county-wide — we come to you
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {areaServices.map(({ slug, name }) => (
              <Link
                key={slug}
                href={`/broward/${slug}`}
                className="group flex flex-col items-center gap-2 p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:border-teal-300 hover:bg-teal-50 transition-colors text-center"
              >
                <span className="text-sm font-semibold text-slate-800 group-hover:text-teal-700 transition-colors">
                  {name}
                </span>
                <span className="text-xs text-teal-500 font-medium">Learn More →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50" aria-labelledby="broward-why-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 id="broward-why-heading" className="text-2xl font-bold text-slate-900 mb-4">
            The Broward Advantage
          </h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Broward drivers deal with the same South Florida heat and humidity as Miami — but
            also heavy inland traffic and airborne pollutants. Our detailing services address
            all of it, keeping your vehicle pristine year-round.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { title: 'Traffic Film Removal', desc: 'Deep cleaning to remove road grime and brake dust from heavy commuter traffic' },
              { title: 'Paint Protection', desc: "Wax and sealant layers that shield against Florida's relentless UV rays" },
              { title: 'Flexible Scheduling', desc: 'Early morning and weekend slots available for busy Broward professionals' },
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
            Ready to Book in Broward?
          </h2>
          <p className="text-slate-300 mb-6 text-sm">
            Same-week availability · No travel fees · 5-star service guaranteed
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact" className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-semibold text-sm transition-all hover:shadow-glow">
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
