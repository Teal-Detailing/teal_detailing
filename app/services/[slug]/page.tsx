import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

// ── Service data ──────────────────────────────────────────────────────────────

const servicesData = {
  'ceramic-coating': {
    name: 'Ceramic Coating',
    tagline: 'The ultimate shield for your paint.',
    heroSub: 'Nano-ceramic protection that bonds directly to your clear coat — repelling water, dirt, and UV damage for years.',
    what: [
      'Ceramic coating is a liquid polymer that chemically bonds to your vehicle\'s factory paint, creating a permanent layer of protection. Unlike traditional wax that sits on top of the paint and wears away in weeks, ceramic coating bonds at the molecular level and can last years with proper maintenance.',
      'The result is a hydrophobic surface that causes water to bead and roll off, taking dirt and grime with it. This means your car stays cleaner longer and is dramatically easier to wash. UV protection is built in, preventing oxidation and color fading from South Florida\'s intense sun.',
      'Teal\'s ceramic coating service includes full paint decontamination, a one-step machine polish to remove minor imperfections, and precise application by our certified technicians — ensuring the coating bonds perfectly and performs for the long haul.',
    ],
    why: [
      { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', title: 'Certified Application', desc: 'Our technicians are trained in proper surface preparation and coating application for a flawless bond.' },
      { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', title: 'Full Prep Included', desc: 'Every coating job starts with clay bar, decontamination, and a one-step polish — no shortcuts.' },
      { icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z', title: 'Mobile Service', desc: 'We apply ceramic coating at your home or office — no need to leave your vehicle at a shop.' },
    ],
  },
  'clay-bar-treatment': {
    name: 'Clay Bar Treatment',
    tagline: 'Silky-smooth paint that glass can\'t match.',
    heroSub: 'A clay bar treatment removes bonded contaminants that even the best car wash can\'t touch — leaving paint so smooth it squeaks.',
    what: [
      'Over time, your car\'s paint accumulates embedded contaminants — brake dust, industrial fallout, tree sap, rail dust, and road grime that bond chemically to your clear coat. Regular washing removes surface dirt but leaves these contaminants behind, making your paint feel rough and look dull.',
      'A clay bar treatment uses a pliable clay compound and lubricant to safely lift and remove these bonded particles from the surface. The result is paint that feels smooth as glass and is properly prepared to absorb wax, sealant, or ceramic coating for maximum bonding and protection.',
      'Teal\'s clay bar service is gentle on your clear coat, safe on all paint types, and pairs perfectly with our exterior detailing and ceramic coating packages. It\'s one of the most impactful single treatments you can do for your car\'s appearance and long-term paint health.',
    ],
    why: [
      { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', title: 'Safe on All Finishes', desc: 'Our professional-grade clay bars are safe for factory paint, wraps, and PPF-protected vehicles.' },
      { icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343', title: 'Maximum Prep Quality', desc: 'Proper clay bar prep means your wax, sealant, or coating bonds deeper and lasts significantly longer.' },
      { icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z', title: 'Mobile Convenience', desc: 'We bring everything needed right to your driveway — no appointment at a shop required.' },
    ],
  },
  'exterior-detailing': {
    name: 'Exterior Detailing',
    tagline: 'Showroom shine at your doorstep.',
    heroSub: 'A comprehensive exterior treatment — hand wash, clay bar, polish, and wax — that restores your car\'s finish and protects it from South Florida\'s elements.',
    what: [
      'Exterior detailing goes far beyond a standard car wash. It\'s a systematic, multi-stage process designed to clean, correct, and protect every surface of your vehicle\'s exterior — from the paint and glass to the trim, tires, and wheels.',
      'Our exterior detail starts with a thorough hand wash using pH-balanced soap and soft microfiber mitts to avoid scratching. We follow with clay bar decontamination, iron remover for brake dust, and a light machine polish to remove surface imperfections. The finish is sealed with a premium wax or sealant to protect against UV rays, oxidation, and South Florida\'s salt air.',
      'The difference between a car wash and a proper exterior detail is visible immediately — and it lasts. Your paint will look deeper, feel smoother, and stay cleaner far longer after a professional exterior detail from Teal.',
    ],
    why: [
      { icon: 'M5 3l14 0M5 3c-1.1 0-2 .9-2 2v3M19 3c1.1 0 2 .9 2 2v3M3 8h18M3 8c0 5.5 2.5 9.5 9 11.5M21 8c0 5.5-2.5 9.5-9 11.5', title: 'Premium Products', desc: 'We use Meguiar\'s, Chemical Guys, and Adams Polishes — never cheap, high-risk alternatives.' },
      { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', title: 'Satisfaction Guaranteed', desc: 'If the result isn\'t right, we return within 48 hours at no charge — no questions asked.' },
      { icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z', title: 'Mobile, No Water Hookup', desc: 'Our self-contained system brings everything — water, power, and equipment — directly to you.' },
    ],
  },
  'headlight-restoration': {
    name: 'Headlight Restoration',
    tagline: 'See clearly. Look sharp.',
    heroSub: 'Restore yellowed, hazy headlights to crystal-clear clarity — improving both your car\'s appearance and your nighttime safety.',
    what: [
      'Headlights are made from polycarbonate plastic that\'s coated with a UV-resistant film at the factory. Over time — especially in South Florida\'s intense sun — that UV film breaks down, causing the plastic to oxidize and turn yellow, cloudy, or hazy. The result is reduced light output, compromised visibility at night, and a car that looks years older than it is.',
      'Our headlight restoration process uses a multi-stage wet sanding and buffing technique to remove the damaged oxidized layer, progressively refining the surface until it\'s crystal clear. We finish with a UV-resistant sealant to protect the restored surface from re-yellowing for years to come.',
      'The visual transformation is dramatic. Headlights that looked beyond repair often come out looking factory-new. And beyond aesthetics, properly restored headlights can improve your light output by as much as 70%, making nighttime driving significantly safer.',
    ],
    why: [
      { icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z', title: 'Multi-Stage Process', desc: 'We use 3+ grits of wet sanding plus machine buffing — not the single-step kits sold at auto stores.' },
      { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', title: 'UV Sealant Included', desc: 'Every restoration is sealed with a UV-resistant coating to prevent re-yellowing for years.' },
      { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', title: 'Fast & Mobile', desc: 'Most headlight restorations are completed in under an hour, right at your home or office.' },
    ],
  },
  'interior-detailing': {
    name: 'Interior Detailing',
    tagline: 'A fresh start for every surface inside.',
    heroSub: 'Deep clean every interior surface — hot-water extraction, leather conditioning, odor elimination — leaving your cabin feeling brand new.',
    what: [
      'Interior detailing is a thorough, deep-clean of every surface inside your vehicle. It goes far beyond vacuuming and wiping — it\'s a systematic process that removes dirt, stains, bacteria, and odors from every crevice, fabric, and hard surface in your cabin.',
      'Our interior detail begins with a full vacuum of all seats, carpets, floor mats, trunk, and under-seat areas. We then use hot-water extraction on fabric surfaces to lift embedded dirt and stains that surface cleaning can\'t touch. Leather surfaces are cleaned with pH-balanced products and conditioned to prevent cracking and drying. Dashboard, console, door panels, and all hard surfaces are cleaned and protected with UV-resistant dressing.',
      'The result is a cabin that not only looks clean — it smells clean, feels clean, and is significantly more hygienic. South Florida\'s heat and humidity can accelerate mold and bacteria growth inside vehicles; a proper interior detail resets everything and protects against it.',
    ],
    why: [
      { icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', title: 'Professional Extraction', desc: 'Our truck-mounted hot-water extraction lifts embedded grime that surface cleaners leave behind.' },
      { icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z', title: 'Leather-Safe Products', desc: 'We use pH-balanced cleaners and conditioning treatments that protect and restore leather long-term.' },
      { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', title: 'Odor Elimination', desc: 'We treat the source of odors — not just mask them — for a genuinely fresh-smelling cabin.' },
    ],
  },
  'mobile-car-detailing': {
    name: 'Mobile Car Detailing',
    tagline: 'We come to you — no hassle, no downtime.',
    heroSub: 'Full professional car detailing at your home, office, or anywhere in South Florida — with zero inconvenience to your schedule.',
    what: [
      'Mobile car detailing means bringing the full detailing experience directly to you — your home, office, apartment building, or anywhere else you park. Our self-contained vans carry all the water, power, and professional equipment needed to perform a complete detail without relying on your utilities.',
      'There\'s no need to drive to a shop, wait around, or arrange a ride back. You book a time, we arrive, and you go about your day. By the time we\'re done, your car is detailed, parked, and ready — without you lifting a finger.',
      'Our mobile service covers all of Miami-Dade, Broward, and Palm Beach counties. Whether you want a quick exterior refresh or a complete Gold package transformation, we can do it wherever your car is parked. It\'s professional-grade detailing made as convenient as possible.',
    ],
    why: [
      { icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4', title: 'Fully Self-Contained', desc: 'Our vans carry water, power, and all equipment — no hookups or access to your utilities needed.' },
      { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', title: 'Same-Week Availability', desc: 'We offer flexible scheduling including early mornings, evenings, and weekends across all 3 counties.' },
      { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', title: 'Licensed & Insured', desc: 'Every Teal technician is background-checked, trained in-house, and covered by full liability insurance.' },
    ],
  },
  'paint-correction': {
    name: 'Paint Correction',
    tagline: 'Erase the past. Reveal perfection.',
    heroSub: 'Machine polishing removes swirl marks, light scratches, water spots, and oxidation — revealing the deep, mirror-like finish your paint was always capable of.',
    what: [
      'Paint correction is the process of using machine polishers and specialized compounds to remove surface-level paint defects from your clear coat. These defects — swirl marks from improper washing, light scratches, water spots, bird dropping etching, and oxidation — scatter light rather than reflecting it cleanly, giving paint a dull, hazy, or spider-webbed appearance.',
      'Our correction process uses dual-action polishers with progressively finer compounds and polishes, carefully removing only as much clear coat as necessary to eliminate each defect. The result is a surface that reflects light uniformly and deeply — the hallmark of truly corrected paint.',
      'Paint correction is particularly impactful on darker vehicles, where swirl marks show most prominently. We use paint thickness gauges throughout the process to ensure your clear coat is never compromised. Once corrected, the paint is typically sealed or ceramic coated to protect the results.',
    ],
    why: [
      { icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z', title: 'Certified Technicians', desc: 'Our polishing technicians are trained to correct paint safely, without burning through your clear coat.' },
      { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', title: 'Paint Gauge Monitoring', desc: 'We measure your clear coat thickness before and during correction to protect against over-polishing.' },
      { icon: 'M5 3l14 0M5 3c-1.1 0-2 .9-2 2v3M19 3c1.1 0 2 .9 2 2v3M3 8h18M3 8c0 5.5 2.5 9.5 9 11.5M21 8c0 5.5-2.5 9.5-9 11.5', title: 'Premium Polishes', desc: 'We use professional compounds from Meguiar\'s, Chemical Guys, and Rupes — not consumer-grade kits.' },
    ],
  },
  'pet-hair-removal': {
    name: 'Pet Hair Removal',
    tagline: 'Because your car deserves better than fur.',
    heroSub: 'Specialized tools and techniques to extract embedded pet hair from every seat, carpet, and crevice — completely and without damaging your upholstery.',
    what: [
      'Pet hair in a car is notoriously difficult to remove. Unlike surface debris, pet hair weaves into fabric fibers and works its way into every gap between cushions, under seats, and into carpet pile. Standard vacuuming often moves it around more than it removes it.',
      'Our pet hair removal service uses a combination of specialized rubber rakes, compressed air, and professional-grade vacuum tools designed specifically for pet hair extraction. We work methodically through every seat, seat back, carpet section, trunk, and hard-to-reach area — including under seats and between console gaps.',
      'The result is an interior that\'s genuinely free of pet hair, not just surface-level clean. We finish with a thorough vacuum and interior wipe-down so your cabin looks and smells fresh. For heavy pet hair cases, we recommend pairing this service with a full interior detail for the best results.',
    ],
    why: [
      { icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z', title: 'Specialized Tools', desc: 'Rubber rakes, compressed air, and high-powered vacuum heads specifically designed for pet hair.' },
      { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', title: 'Safe on All Upholstery', desc: 'Our process is effective on fabric, velour, and carpet without pulling or damaging fibers.' },
      { icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', title: 'Thorough Coverage', desc: 'We reach every gap, crevice, and under-seat area — not just the visible surface.' },
    ],
  },
} as const

type ServiceSlug = keyof typeof servicesData

const slugs = Object.keys(servicesData) as ServiceSlug[]

// ── Pricing data ──────────────────────────────────────────────────────────────

const pricingTiers = [
  {
    tier: 'economy' as const,
    name: 'Economy',
    price: '$109',
    subtitle: 'Essential care for everyday drivers',
    features: [
      'Exterior hand wash & rinse',
      'Window cleaning (interior & exterior)',
      'Tire & rim scrub',
      'Interior vacuum (seats, carpets, trunk)',
      'Dashboard & console wipe-down',
      'Door jambs & sill cleaning',
      'Air freshener',
    ],
  },
  {
    tier: 'silver' as const,
    name: 'Silver',
    price: '$179',
    subtitle: 'Full detail — inside and out',
    features: [
      'Exterior hand wash & rinse',
      'Window cleaning (interior & exterior)',
      'Tire & rim scrub',
      'Interior vacuum (seats, carpets, trunk)',
      'Dashboard & console wipe-down',
      'Door jambs & sill cleaning',
      'Air freshener',
      'Full interior deep clean',
      'Seat & carpet hot-water extraction',
      'Door panels & headliner detail',
      'Leather/vinyl conditioning',
      'Trunk full detail',
      'Tire dressing & shine',
      'Exterior spray wax',
    ],
  },
  {
    tier: 'gold' as const,
    name: 'Gold',
    price: '$279',
    subtitle: 'Premium transformation & protection',
    features: [
      'Exterior hand wash & rinse',
      'Window cleaning (interior & exterior)',
      'Tire & rim scrub',
      'Interior vacuum (seats, carpets, trunk)',
      'Dashboard & console wipe-down',
      'Door jambs & sill cleaning',
      'Air freshener',
      'Full interior deep clean',
      'Seat & carpet hot-water extraction',
      'Door panels & headliner detail',
      'Leather/vinyl conditioning',
      'Trunk full detail',
      'Tire dressing & shine',
      'Exterior spray wax',
      'Clay bar paint decontamination',
      'Machine polish & swirl removal',
      'Hand wax & paint sealant',
      'Deep leather conditioning & protection',
      'Headlight restoration',
      'Exterior plastic trim restoration',
      'Premium branded gift included',
    ],
  },
]

// ── generateStaticParams ──────────────────────────────────────────────────────

export function generateStaticParams() {
  return slugs.map((slug) => ({ slug }))
}

// ── generateMetadata ──────────────────────────────────────────────────────────

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const service = servicesData[params.slug as ServiceSlug]
  if (!service) return {}
  return {
    title: `${service.name} in South Florida`,
    description: `Professional mobile ${service.name.toLowerCase()} service across Miami-Dade, Broward, and Palm Beach. ${service.heroSub}`,
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ServicePage({ params }: { params: { slug: string } }) {
  const service = servicesData[params.slug as ServiceSlug]
  if (!service) notFound()

  return (
    <>
      {/* Hero */}
      <section className="bg-hero-gradient pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-400 mb-4">
            Teal Detailing
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            {service.name}
          </h1>
          <p className="text-xl sm:text-2xl font-medium text-teal-300 mb-4">
            {service.tagline}
          </p>
          <p className="text-slate-300 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            {service.heroSub}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-semibold text-base transition-all hover:shadow-glow"
          >
            Get a Free Quote
          </Link>
        </div>
      </section>

      {/* What is [Service]? */}
      <section className="py-20 bg-white" aria-labelledby="what-heading">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="what-heading" className="text-3xl font-extrabold text-slate-900 mb-8">
            What is {service.name}?
          </h2>
          <div className="space-y-5">
            {service.what.map((para, i) => (
              <p key={i} className="text-slate-600 text-base leading-relaxed">
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Teal */}
      <section className="py-20 bg-slate-50" aria-labelledby="why-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="why-heading" className="text-3xl font-extrabold text-slate-900">
              Why Choose Teal for {service.name}?
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {service.why.map(({ icon, title, desc }) => (
              <article
                key={title}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-card hover:shadow-card-hover transition-shadow flex flex-col gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={icon} />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-[#0a0a0f]" aria-labelledby="service-pricing-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-400 mb-3">
              Pricing
            </p>
            <h2 id="service-pricing-heading" className="text-3xl font-extrabold text-white">
              Choose Your Package
            </h2>
            <p className="mt-3 text-slate-400 max-w-xl mx-auto">
              No hidden fees. Every package includes our satisfaction guarantee.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 items-end">
            {/* Economy */}
            {(() => {
              const plan = pricingTiers[0]
              return (
                <article className="rounded-2xl overflow-hidden bg-[#e8e8e8] border border-[#d0d0d0]">
                  <div className="px-6 py-5 bg-[#d8d8d8]">
                    <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">Economy</span>
                    <div className="mt-2">
                      <span className="text-2xl font-bold text-slate-700">{plan.price}</span>
                    </div>
                    <p className="text-xs mt-1 text-slate-500">{plan.subtitle}</p>
                  </div>
                  <div className="px-6 py-5">
                    <ul className="space-y-2">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-xs text-slate-600">
                          <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/contact?plan=Economy"
                      className="mt-6 block w-full text-center py-2.5 rounded-xl font-semibold text-sm bg-slate-700 hover:bg-slate-600 text-white transition-colors"
                    >
                      Book Economy
                    </Link>
                  </div>
                </article>
              )
            })()}

            {/* Silver */}
            {(() => {
              const plan = pricingTiers[1]
              return (
                <article
                  className="rounded-2xl overflow-hidden bg-[#0f1117] border border-[#b0b8c1]/30"
                  style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
                >
                  {/* Silver accent bar */}
                  <div className="h-1 w-full bg-gradient-to-r from-[#8d9caa] via-[#b0b8c1] to-[#8d9caa]" />
                  <div className="px-6 py-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold uppercase tracking-widest text-[#b0b8c1]">Silver</span>
                      <span className="inline-block w-4 h-0.5 rounded bg-gradient-to-r from-[#8d9caa] to-[#b0b8c1]" />
                    </div>
                    <div>
                      <span className="text-3xl font-bold text-white">{plan.price}</span>
                    </div>
                    <p className="text-xs mt-1 text-slate-400">{plan.subtitle}</p>
                  </div>
                  <div className="px-6 pb-6">
                    <ul className="space-y-2">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-xs text-slate-300">
                          <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[#b0b8c1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/contact?plan=Silver"
                      className="mt-6 block w-full text-center py-2.5 rounded-xl font-semibold text-sm text-[#0f1117] transition-all"
                      style={{ background: 'linear-gradient(135deg, #8d9caa, #b0b8c1, #8d9caa)' }}
                    >
                      Book Silver
                    </Link>
                  </div>
                </article>
              )
            })()}

            {/* Gold */}
            {(() => {
              const plan = pricingTiers[2]
              return (
                <article
                  className="rounded-2xl overflow-hidden bg-[#0f1117] border border-[#c9a84c]/30 relative"
                  style={{ boxShadow: '0 8px 40px rgba(201,168,76,0.25)' }}
                >
                  {/* Best Value ribbon */}
                  <div className="absolute top-4 right-4 z-10">
                    <span
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold text-[#0f1117]"
                      style={{ background: 'linear-gradient(135deg, #c9a84c, #f0d080)' }}
                    >
                      ★ Best Value
                    </span>
                  </div>
                  {/* Gold accent bar */}
                  <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #c9a84c, #f0d080, #c9a84c)' }} />
                  <div className="px-6 py-5">
                    <span className="text-xs font-semibold uppercase tracking-widest text-[#f0d080]">Gold</span>
                    <div className="mt-2">
                      <span className="text-3xl font-bold text-white">{plan.price}</span>
                    </div>
                    <p className="text-xs mt-1 text-slate-400">{plan.subtitle}</p>
                  </div>
                  <div className="px-6 pb-6">
                    <ul className="space-y-2">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-xs text-slate-300">
                          <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[#f0d080]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/contact?plan=Gold"
                      className="mt-6 block w-full text-center py-2.5 rounded-xl font-bold text-sm text-[#0f1117] transition-all"
                      style={{ background: 'linear-gradient(135deg, #c9a84c, #f0d080, #c9a84c)' }}
                    >
                      Book Gold
                    </Link>
                  </div>
                </article>
              )
            })()}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-hero-gradient py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Book Your {service.name} Today
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
