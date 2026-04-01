'use client'

export default function FloatingPhone() {
  return (
    <a
      href="tel:+16452488292"
      aria-label="Call Teal Detailing at (645) 248-8292"
      className="fixed bottom-20 right-4 z-50 w-14 h-14 rounded-full bg-teal-500 hover:bg-teal-400 transition-colors flex items-center justify-center"
      style={{ boxShadow: '0 4px 24px rgba(20,184,166,0.5)' }}
    >
      {/* pulse ring */}
      <span className="absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-60 animate-ping" />
      <svg
        className="w-6 h-6 text-white relative z-10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        />
      </svg>
    </a>
  )
}
