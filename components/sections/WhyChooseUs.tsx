import ServiceFeature from '@/components/ui/ServiceFeature'

const features = [
  {
    iconPath:
      'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
    title: 'No Noise, No Fumes',
    description:
      'Our waterless and low-water processes use biodegradable, eco-friendly products — safe for your driveway, your family, and the environment.',
  },
  {
    iconPath:
      'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
    title: 'Premium Chemical Partners',
    description:
      'We use industry-leading products from Meguiar\'s, Chemical Guys, and Adams Polishes — the same brands trusted by dealerships and collectors.',
  },
  {
    iconPath:
      'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
    title: 'Full-Service Range',
    description:
      'From a quick exterior wash to a full clay bar and machine polish — we handle every level of detail so you can choose exactly what your vehicle needs.',
  },
  {
    iconPath:
      'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h3m10 4a2 2 0 110-4h-3',
    title: 'Branded Gift with Gold',
    description:
      'Every Gold package comes with a Teal Detailing premium microfiber kit — the perfect gift for car enthusiasts or as a reminder to maintain that showroom shine.',
  },
  {
    iconPath:
      'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
    title: '5-Star Reputation',
    description:
      'Over 200 verified 5-star reviews across Google and Yelp. Our customers come back — and send their friends. See why South Florida trusts Teal Detailing.',
  },
]

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-slate-50" aria-labelledby="why-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-500 mb-3">
            Why Teal Detailing
          </p>
          <h2 id="why-heading" className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            The Detail Difference
          </h2>
          <p className="mt-3 text-slate-600 max-w-xl mx-auto text-base leading-relaxed">
            We combine professional-grade products, meticulous technique, and true
            mobile convenience to deliver results you can see and feel.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <ServiceFeature
              key={f.title}
              iconPath={f.iconPath}
              title={f.title}
              description={f.description}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
