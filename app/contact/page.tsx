import type { Metadata } from 'next'
import BookingForm from '@/components/ui/BookingForm'
import { PHONE_DISPLAY, PHONE_HREF, EMAIL_DISPLAY, EMAIL_HREF } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Contact & Book Your Detail',
  description:
    'Book your mobile car detail with Teal Detailing. Same-week availability across Miami-Dade, Broward, and Palm Beach. We respond within 15 minutes.',
  alternates: { canonical: 'https://tealdetailing.com/contact' },
  openGraph: {
    title: 'Contact & Book Your Detail | Teal Detailing',
    description:
      'Book your mobile car detail with Teal Detailing. Same-week availability across Miami-Dade, Broward, and Palm Beach.',
    url: 'https://tealdetailing.com/contact',
    images: [{ url: '/images/icons/logo-1024.webp', width: 1024, height: 1024, alt: 'Teal Detailing' }],
  },
}

// Maps URL ?plan= query value to the full service option label
const planMap: Record<string, string> = {
  Economy: 'Economy Detail ($99)',
  Silver: 'Silver Detail ($179)',
  Gold: 'Gold Detail ($249)',
}

const infoCards = [
  {
    icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
    label: 'Phone',
    value: PHONE_DISPLAY,
    href: PHONE_HREF,
  },
  {
    icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    label: 'Email',
    value: EMAIL_DISPLAY,
    href: EMAIL_HREF,
  },
  {
    icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
    label: 'Service Area',
    value: 'Miami-Dade · Broward · Palm Beach',
    href: null,
  },
  {
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    label: 'Hours',
    value: 'Every Day · 8 AM – 10 PM',
    href: null,
  },
]

export default function ContactPage({
  searchParams,
}: {
  searchParams: { plan?: string; service?: string }
}) {
  const defaultService = searchParams?.plan
    ? (planMap[searchParams.plan] ?? undefined)
    : (searchParams?.service ?? undefined)
  return (
    <>
      {/* Hero */}
      <section className="bg-hero-gradient pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-400 mb-4">
            Get in Touch
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Book Your Detail Today
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed max-w-xl mx-auto">
            Fill out the form below or give us a call. We respond within 15 minutes
            and accommodate same-week appointments.
          </p>
        </div>
      </section>

      {/* Info cards + form */}
      <section className="py-20 bg-slate-50" aria-labelledby="contact-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Info */}
            <div className="order-last lg:order-first">
              <h2 id="contact-heading" className="text-2xl font-bold text-slate-900 mb-6">
                Contact Information
              </h2>
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {infoCards.map(({ icon, label, value, href }) => (
                  <article
                    key={label}
                    className="bg-white rounded-2xl p-5 shadow-card border border-slate-100 flex gap-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={icon} />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-0.5">
                        {label}
                      </p>
                      {href ? (
                        <a href={href} className="text-sm font-medium text-slate-900 hover:text-teal-600 transition-colors">
                          {value}
                        </a>
                      ) : (
                        <p className="text-sm font-medium text-slate-900">{value}</p>
                      )}
                    </div>
                  </article>
                ))}
              </div>

              {/* Service area map */}
              <div className="rounded-2xl overflow-hidden border border-slate-200 h-64">
                <iframe
                  title="Teal Detailing service area — Miami-Dade, Broward & Palm Beach"
                  src="https://maps.google.com/maps?q=South+Florida&z=8&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Form */}
            <div className="order-first lg:order-last">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Request a Quote</h2>
              <div className="bg-white rounded-2xl shadow-card-hover border border-slate-100 p-6">
                <BookingForm defaultService={defaultService} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
