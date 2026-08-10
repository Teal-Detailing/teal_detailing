import Link from 'next/link'
import Image from 'next/image'
import { PHONE_DISPLAY, PHONE_HREF, EMAIL_DISPLAY, EMAIL_HREF } from '@/lib/constants'

const services = [
  { href: '/services/ceramic-coating', label: 'Ceramic Coating' },
  { href: '/services/clay-bar-treatment', label: 'Clay Bar Treatment' },
  { href: '/services/exterior-detailing', label: 'Exterior Detailing' },
  { href: '/services/headlight-restoration', label: 'Headlight Restoration' },
  { href: '/services/interior-detailing', label: 'Interior Detailing' },
  { href: '/services/mobile-car-detailing', label: 'Mobile Car Detailing' },
  { href: '/services/paint-correction', label: 'Paint Correction' },
  { href: '/services/pet-hair-removal', label: 'Pet Hair Removal' },
  { href: '/services/stain-removal', label: 'Stain Removal' },
  { href: '/services/engine-bay-cleaning', label: 'Engine Bay Cleaning' },
]

const areas = [
  { href: '/miami/mobile-car-detailing', label: 'Miami' },
  { href: '/miami-beach/mobile-car-detailing', label: 'Miami Beach' },
  { href: '/coral-gables/mobile-car-detailing', label: 'Coral Gables' },
  { href: '/doral/mobile-car-detailing', label: 'Doral' },
  { href: '/aventura/mobile-car-detailing', label: 'Aventura' },
  { href: '/fort-lauderdale/mobile-car-detailing', label: 'Fort Lauderdale' },
  { href: '/hollywood-fl/mobile-car-detailing', label: 'Hollywood' },
  { href: '/pembroke-pines/mobile-car-detailing', label: 'Pembroke Pines' },
  { href: '/boca-raton/mobile-car-detailing', label: 'Boca Raton' },
  { href: '/west-palm-beach/mobile-car-detailing', label: 'West Palm Beach' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-ink text-slate-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src="/images/icons/logo-256.webp"
                alt="Teal Detailing"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="text-lg font-bold text-white tracking-tight">
                Teal<span className="text-teal-400">.</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 mb-5">
              South Florida&apos;s premium mobile car detailing service. We come to your home or
              office — no hassle, just results.
            </p>
            <a
              href={PHONE_HREF}
              className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-teal-500/10 border border-teal-500/30 hover:bg-teal-500/20 transition-colors group"
            >
              <svg className="w-4 h-4 text-teal-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <div>
                <p className="text-[10px] text-slate-400 leading-none mb-0.5">Call or text</p>
                <p className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors">
                  {PHONE_DISPLAY}
                </p>
              </div>
            </a>
            <p className="text-sm mt-3">
              <a href={EMAIL_HREF} className="hover:text-teal-400 transition-colors">
                {EMAIL_DISPLAY}
              </a>
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Services
            </h3>
            <ul className="space-y-2">
              {services.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm hover:text-teal-400 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Areas + Company */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Service Areas
            </h3>
            <ul className="space-y-2">
              {areas.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm hover:text-teal-400 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mt-8 mb-4">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm hover:text-teal-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-sm hover:text-teal-400 transition-colors">
                  Our Work
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:text-teal-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Hours
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>Every Day</span>
                <span className="text-white font-medium">8 AM – 10 PM</span>
              </li>
            </ul>
            <Link
              href="/contact"
              className="mt-5 inline-flex items-center justify-center w-full py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold transition-colors"
            >
              Get My Quote
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>© {year} Teal Detailing LLC. All rights reserved. South Florida, FL.</p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-slate-300 transition-colors">
              About
            </Link>
            <Link href="/gallery" className="hover:text-slate-300 transition-colors">
              Our Work
            </Link>
            <Link href="/contact" className="hover:text-slate-300 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
