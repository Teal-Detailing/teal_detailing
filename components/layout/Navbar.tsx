'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { PHONE_DISPLAY, PHONE_HREF } from '@/lib/constants'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/gallery', label: 'Our Work' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

const services = [
  { href: '/services/mobile-car-detailing', label: 'Mobile Detailing' },
  { href: '/services/interior-detailing', label: 'Interior Detailing' },
  { href: '/services/exterior-detailing', label: 'Exterior Detailing' },
  { href: '/services/ceramic-coating', label: 'Ceramic Coating' },
  { href: '/services/paint-correction', label: 'Paint Correction' },
  { href: '/services/headlight-restoration', label: 'Headlight Restoration' },
  { href: '/services/pet-hair-removal', label: 'Pet Hair Removal' },
  { href: '/services/stain-removal', label: 'Stain Removal' },
  { href: '/services/engine-bay-cleaning', label: 'Engine Bay Cleaning' },
  { href: '/services/clay-bar-treatment', label: 'Clay Bar Treatment' },
]

const serviceAreas = [
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

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [areasOpen, setAreasOpen] = useState(false)
  const servicesCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const areasCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pathname = usePathname()

  function openServices() {
    if (servicesCloseTimer.current) clearTimeout(servicesCloseTimer.current)
    setServicesOpen(true)
  }

  function scheduleCloseServices() {
    servicesCloseTimer.current = setTimeout(() => setServicesOpen(false), 120)
  }

  function openAreas() {
    if (areasCloseTimer.current) clearTimeout(areasCloseTimer.current)
    setAreasOpen(true)
  }

  function scheduleCloseAreas() {
    areasCloseTimer.current = setTimeout(() => setAreasOpen(false), 120)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setServicesOpen(false)
    setAreasOpen(false)
  }, [pathname])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  const isServicesActive = pathname.startsWith('/services')
  const isAreaActive = serviceAreas.some(({ href }) => pathname.startsWith(href.split('/mobile-car-detailing')[0]))

  const navItemClass = (active: boolean) =>
    `px-3 py-2 rounded-lg text-[1.05rem] font-semibold transition-colors ${
      active
        ? 'text-teal-700 bg-teal-50'
        : scrolled
        ? 'text-slate-700 hover:text-teal-600 hover:bg-slate-50'
        : 'text-white/90 hover:text-white hover:bg-white/10'
    }`

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <Image
              src="/images/icons/logo-256.webp"
              alt="Teal Detailing"
              width={40}
              height={40}
              className="rounded-lg"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/" className={navItemClass(isActive('/'))}>Home</Link>

            {/* Services Dropdown */}
            <div className="relative" onMouseEnter={openServices} onMouseLeave={scheduleCloseServices}>
              <button
                className={`flex items-center gap-1 ${navItemClass(isServicesActive)}`}
                aria-expanded={servicesOpen}
                aria-haspopup="true"
                aria-label="Services menu"
              >
                Services
                <svg className={`w-3.5 h-3.5 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {servicesOpen && (
                <div
                  className="absolute top-full left-0 w-[440px] rounded-xl bg-white shadow-card-hover border border-slate-100 overflow-hidden p-2"
                  onMouseEnter={openServices}
                  onMouseLeave={scheduleCloseServices}
                >
                  <div className="grid grid-cols-2 gap-0.5">
                    {services.map(({ href, label }) => (
                      <Link
                        key={href}
                        href={href}
                        className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                          isActive(href)
                            ? 'bg-teal-50 text-teal-700 font-medium'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-teal-600'
                        }`}
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                  <Link
                    href="/services"
                    className="flex items-center justify-center mt-1 px-3 py-2.5 rounded-lg text-sm font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 transition-colors"
                  >
                    View All Services & Pricing →
                  </Link>
                </div>
              )}
            </div>

            {/* Service Areas Dropdown */}
            <div className="relative" onMouseEnter={openAreas} onMouseLeave={scheduleCloseAreas}>
              <button
                className={`flex items-center gap-1 ${navItemClass(isAreaActive)}`}
                aria-expanded={areasOpen}
                aria-haspopup="true"
                aria-label="Service areas menu"
              >
                Service Areas
                <svg className={`w-3.5 h-3.5 transition-transform ${areasOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {areasOpen && (
                <div
                  className="absolute top-full left-0 w-[440px] rounded-xl bg-white shadow-card-hover border border-slate-100 overflow-hidden p-2"
                  onMouseEnter={openAreas}
                  onMouseLeave={scheduleCloseAreas}
                >
                  <div className="grid grid-cols-2 gap-0.5">
                    {serviceAreas.map(({ href, label }) => (
                      <Link
                        key={href}
                        href={href}
                        className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                          isActive(href)
                            ? 'bg-teal-50 text-teal-700 font-medium'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-teal-600'
                        }`}
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {navLinks.slice(1).map(({ href, label }) => (
              <Link key={href} href={href} className={navItemClass(isActive(href))}>
                {label}
              </Link>
            ))}
          </div>

          {/* Phone + CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={PHONE_HREF}
              className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                scrolled ? 'text-slate-700 hover:text-teal-600' : 'text-white/90 hover:text-white'
              }`}
            >
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {PHONE_DISPLAY}
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold transition-all duration-200 hover:shadow-glow"
            >
              Get a Quote
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              scrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/10'
            }`}
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile slide-down menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 py-2 pb-4 space-y-0.5 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <Link
              href="/"
              className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg mx-2 transition-colors ${
                isActive('/') ? 'bg-teal-50 text-teal-700' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Home
            </Link>

            <div className="px-4 pt-2 pb-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 px-0 mb-1">
                Services
              </p>
            </div>
            {services.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center px-6 py-2 text-sm font-medium rounded-lg mx-2 transition-colors ${
                  isActive(href) ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/services"
              className="flex items-center px-6 py-2 text-sm font-semibold text-teal-700 mx-2 rounded-lg hover:bg-teal-50 transition-colors"
            >
              View All Services & Pricing →
            </Link>

            <div className="px-4 pt-3 pb-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 px-0 mb-1">
                Service Areas
              </p>
            </div>
            {serviceAreas.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center px-6 py-2 text-sm font-medium rounded-lg mx-2 transition-colors ${
                  isActive(href) ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {label}
              </Link>
            ))}

            {navLinks.slice(1).map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg mx-2 mt-2 transition-colors ${
                  isActive(href) ? 'bg-teal-50 text-teal-700' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {label}
              </Link>
            ))}

            <div className="px-4 pt-2">
              <Link
                href="/contact"
                className="flex items-center justify-center py-2.5 px-4 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold transition-colors"
              >
                Get a Quote
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
