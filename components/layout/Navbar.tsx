'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/gallery', label: 'Our Work' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

const serviceAreas = [
  { href: '/service-areas/miami-dade', label: 'Miami-Dade' },
  { href: '/service-areas/broward', label: 'Broward' },
  { href: '/service-areas/palm-beach', label: 'Palm Beach' },
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
            <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center">
              <svg className="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M5 3l14 0M5 3c-1.1 0-2 .9-2 2v3M5 3l0 5M19 3c1.1 0 2 .9 2 2v3M19 3l0 5M3 8h18M3 8c0 5.5 2.5 9.5 9 11.5M21 8c0 5.5-2.5 9.5-9 11.5" />
              </svg>
            </div>
            <span className={`text-lg font-bold tracking-tight transition-colors ${scrolled ? 'text-slate-900' : 'text-white'}`}>
              Teal<span className="text-teal-400">.</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
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
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname.startsWith('/service-areas')
                    ? 'text-teal-500 bg-teal-50'
                    : scrolled
                    ? 'text-slate-700 hover:text-teal-600 hover:bg-slate-50'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
                aria-expanded={areasOpen}
                aria-haspopup="true"
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

          {/* CTA */}
          <div className="hidden md:block">
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
