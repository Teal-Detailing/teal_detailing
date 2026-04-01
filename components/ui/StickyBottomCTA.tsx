'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function StickyBottomCTA() {
  const pathname = usePathname()

  // Don't show on the contact page — the form is already right there
  if (pathname === '/contact') return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
        {/* Left label — hidden on very small screens */}
        <p className="hidden sm:block text-xs text-slate-500 flex-1 leading-tight">
          Mobile detailing · Miami-Dade · Broward · Palm Beach
        </p>

        {/* Buttons always visible, full-width on mobile */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Link
            href="/services"
            className="flex-1 sm:flex-none text-center px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:border-teal-500 hover:text-teal-400 text-sm font-medium transition-colors"
          >
            View Pricing
          </Link>
          <Link
            href="/contact"
            className="flex-1 sm:flex-none text-center px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-white text-sm font-semibold transition-all hover:shadow-glow"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  )
}
