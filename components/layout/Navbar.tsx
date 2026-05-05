'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { PHONE_DISPLAY, PHONE_HREF } from '@/lib/constants'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/gallery', label: 'Our Work' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

const serviceAreas = [
  { href: '/miami-dade', label: 'Miami-Dade' },
  { href: '/broward', label: 'Broward' },
  { href: '/palm-beach', label: 'Palm Beach' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [areasOpen, setAreasOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pathname = usePathname()

  function openAreas() {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setAreasOpen(true)
  }

  function scheduleClose() {
    closeTimer.current = setTimeout(() => setAreasOpen(false), 120)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setAreasOpen(false)
  }, [pathname])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  const isAreaActive = pathname.startsWith('/miami-dade') || pathname.startsWith('/broward') || pathname.startsWith('/palm-beach')

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
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-3 py-2 rounded-lg text-[1.05rem] font-semibold transition-colors ${
                  isActive(href)
                    ? 'text-teal-500 bg-teal-50'
                    : scrolled
                    ? 'text-slate-700 hover:text-teal-600 hover:bg-slate-50'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                {label}
              </Link>
            ))}

            {/* Service Areas Dropdown */}
            <div
              className="relative"
              onMouseEnter={openAreas}
              onMouseLeave={scheduleClose}
            >
              <button
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-[1.05rem] font-semibold transition-colors ${
                  isAreaActive
                    ? 'text-teal-500 bg-teal-50'
                    : scrolled
                    ? 'text-slate-700 hover:text-teal-600 hover:bg-slate-50'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
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
                  className="absolute top-full left-0 w-44 rounded-xl bg-white shadow-card-hover border border-slate-100 overflow-hidden"
                  onMouseEnter={openAreas}
                  onMouseLeave={scheduleClose}
                >
                  {serviceAreas.map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      className={`flex items-center px-4 py-2.5 text-sm transition-colors ${
                        isActive(href)
                          ? 'bg-teal-50 text-teal-600 font-medium'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-teal-600'
                      }`}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
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
              className="inline-flex items-center px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold transition-all duration-200 hover:shadow-glow"
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
          <div className="md:hidden bg-white border-t border-slate-100 py-2 pb-4 space-y-0.5">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg mx-2 transition-colors ${
                  isActive(href) ? 'bg-teal-50 text-teal-600' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {label}
              </Link>
            ))}
            <div className="px-4 pt-1 pb-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 px-0 mb-1">
                Service Areas
              </p>
            </div>
            {serviceAreas.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center px-6 py-2 text-sm font-medium rounded-lg mx-2 transition-colors ${
                  isActive(href) ? 'bg-teal-50 text-teal-600' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {label}
              </Link>
            ))}
            <div className="px-4 pt-2">
              <Link
                href="/contact"
                className="flex items-center justify-center py-2.5 px-4 rounded-lg bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold transition-colors"
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
