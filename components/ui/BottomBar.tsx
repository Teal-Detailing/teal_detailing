'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { SMS_HREF } from '@/lib/constants'

const CONSENT_KEY = 'teal-cookie-consent'

export default function BottomBar() {
  const pathname = usePathname()
  const [bannerMounted, setBannerMounted] = useState(false)
  const [bannerOpen, setBannerOpen] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(CONSENT_KEY)) {
      setBannerMounted(true)
      const t = setTimeout(() => setBannerOpen(true), 80)
      return () => clearTimeout(t)
    }
  }, [])

  function handleConsent(accepted: boolean) {
    localStorage.setItem(CONSENT_KEY, accepted ? 'granted' : 'denied')
    if (accepted && typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'denied',
      })
    }
    setBannerOpen(false)
    setTimeout(() => setBannerMounted(false), 380)
  }

  const hideCTA = pathname === '/contact'

  function handleViewPricing() {
    if (pathname === '/') {
      document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.location.href = '/#packages'
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex flex-col">
      {/* CTA Bar — Text / View Pricing / Book */}
      {!hideCTA && (
        <div className="bg-ink/95 backdrop-blur-md border-t border-slate-800">
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center gap-3">
            <p className="hidden sm:block text-xs text-slate-400 flex-1 leading-tight">
              Mobile detailing · Miami-Dade · Broward · Palm Beach
            </p>
            <div className="grid grid-cols-3 sm:flex sm:items-center gap-2 w-full sm:w-auto">
              <a
                href={SMS_HREF}
                className="flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2.5 sm:py-2 rounded-lg border border-slate-700 text-slate-300 hover:border-teal-500 hover:text-teal-400 text-sm font-semibold sm:font-medium transition-colors"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8-1.06 0-2.077-.162-3.02-.46L3 21l1.54-4.03A7.955 7.955 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                Text
              </a>
              <button
                onClick={handleViewPricing}
                className="flex items-center justify-center px-3 sm:px-4 py-2.5 sm:py-2 rounded-lg border border-slate-700 text-slate-300 hover:border-teal-500 hover:text-teal-400 text-sm font-semibold sm:font-medium transition-colors"
              >
                <span className="sm:hidden">Pricing</span>
                <span className="hidden sm:inline">View Pricing</span>
              </button>
              <Link
                href="/contact"
                className="flex items-center justify-center px-3 sm:px-5 py-2.5 sm:py-2 rounded-lg bg-teal-700 hover:bg-teal-600 text-white text-sm font-semibold transition-colors"
              >
                Book
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Cookie Consent Banner */}
      {bannerMounted && (
        <div
          style={{
            maxHeight: bannerOpen ? '140px' : '0px',
            overflow: 'hidden',
            transition: 'max-height 0.36s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <div className="bg-ink border-t border-slate-800 px-4 py-3">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <p className="text-xs text-slate-400 flex-1 leading-relaxed">
                We use cookies and Google Analytics to understand how visitors use our site.{' '}
                <Link
                  href="/privacy-policy"
                  className="text-teal-400 underline underline-offset-2 hover:text-teal-300 transition-colors"
                >
                  Privacy Policy
                </Link>
              </p>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleConsent(false)}
                  className="px-4 py-1.5 rounded-lg border border-slate-600 text-slate-400 hover:text-slate-200 hover:border-slate-500 text-xs font-medium transition-colors"
                >
                  Decline
                </button>
                <button
                  onClick={() => handleConsent(true)}
                  className="px-4 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-600 text-white text-xs font-semibold transition-colors"
                >
                  Accept
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
