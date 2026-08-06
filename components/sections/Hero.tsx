import Image from 'next/image'
import Link from 'next/link'
import BookingForm from '@/components/ui/BookingForm'
import { PHONE_DISPLAY, PHONE_HREF } from '@/lib/constants'

const trustBadges = [
  {
    icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
    label: '5-Star Rated',
  },
  {
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    label: 'Fully Insured',
  },
  {
    icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
    label: 'We Come to You',
  },
  {
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    label: 'Same Day Appointment',
  },
]

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background photo */}
      <Image
        src="/hero-bg.png"
        alt="Hero background"
        fill
        className="object-cover object-center"
        priority
      />
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 lg:max-w-[90rem] overflow-x-hidden">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Left / mobile-only column ── */}
          <div className="flex flex-col gap-8">

            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-teal-300 text-xs font-semibold tracking-wide">
                Mobile Detailing · South Florida
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-white">
                <span className="lg:whitespace-nowrap">Luxury Mobile Car Detailing</span> <span className="text-gradient-teal lg:whitespace-nowrap">in Miami, Broward, Palm Beach</span>
              </h1>
              <p className="text-slate-300 leading-relaxed max-w-2xl text-[1rem] lg:text-[1.5rem] font-bold">
                Teal Detailing brings professional mobile car detailing directly to your location across South Florida. Specializing in:
              </p>
              <div className="flex flex-wrap gap-x-2 gap-y-1 text-slate-300 font-sans text-[0.85rem] lg:text-[1.25rem] font-bold">
                {[
                  { label: 'Full Detail', href: '/services/mobile-car-detailing' },
                  { label: 'Interior Deep Clean', href: '/services/interior-detailing' },
                  { label: 'Ceramic Coating', href: '/services/ceramic-coating' },
                  { label: 'Paint Correction', href: '/services/paint-correction' },
                  { label: 'Headlight Restoration', href: '/services/headlight-restoration' },
                ].map(({ label, href }) => (
                  <span key={label} className="flex items-center gap-2">
                    <span className="text-teal-400">·</span>
                    <Link href={href} className="hover:text-teal-300 transition-colors underline underline-offset-2">
                      {label}
                    </Link>
                  </span>
                ))}
              </div>
            </div>

            {/* Trust badges — desktop only (form replaces them on mobile) */}
            <div className="hidden lg:grid grid-cols-2 gap-3">
              {trustBadges.map(({ icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2.5 px-3 py-3 rounded-xl bg-white/5 border border-white/10"
                >
                  <svg
                    className="w-4 h-4 text-teal-400 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={icon} />
                  </svg>
                  <span className="text-[1rem] font-semibold text-white/80">{label}</span>
                </div>
              ))}
            </div>

            {/* Phone — shown on mobile below the form */}
            <div className="flex items-center gap-3 lg:hidden">
              <a
                href={PHONE_HREF}
                className="flex items-center gap-2.5 text-white font-medium hover:text-teal-300 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-slate-400 leading-none mb-0.5">Call us direct</p>
                  <p className="text-sm font-semibold">{PHONE_DISPLAY}</p>
                </div>
              </a>
              <div className="h-6 w-px bg-white/10" />
              <p className="text-slate-400" style={{ fontSize: '1rem' }}>
                <span className="text-white font-semibold">700+</span> happy customers
              </p>
            </div>

            {/* Desktop-only phone row */}
            <div className="hidden lg:flex items-center gap-4">
              <a
                href={PHONE_HREF}
                className="flex items-center gap-2 text-white font-semibold hover:text-teal-300 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center">
                  <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-slate-400 leading-none mb-0.5">Call us direct</p>
                  <p className="text-base">{PHONE_DISPLAY}</p>
                </div>
              </a>
              <div className="h-8 w-px bg-white/10" />
              <p className="text-slate-400" style={{ fontSize: '1rem' }}>
                <span className="text-white font-semibold">700+</span> happy customers
              </p>
            </div>
          </div>

          {/* ── Right column — compact booking form (mobile + desktop) ── */}
          <div className="lg:flex lg:flex-col lg:items-end gap-3">
            <div className="w-full max-w-md">
              <div className="bg-white rounded-2xl shadow-glow p-6">
                <BookingForm compact />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
