'use client'

import { useState } from 'react'
import { PHONE_DISPLAY } from '@/lib/constants'

const faqs = [
  {
    q: 'How does mobile car detailing work? Do I need to provide water or electricity?',
    a: "No — we bring everything with us. Our team arrives with its own water supply and powers all equipment off a battery station instead of a gasoline generator, so there's no noise, no fumes, and nothing you need to hook up. Just give us a place to park and we handle the rest.",
  },
  {
    q: 'What areas do you serve?',
    a: 'We provide mobile detailing across all of South Florida, including Miami-Dade, Broward, and Palm Beach counties — from Miami and Fort Lauderdale to Boca Raton and West Palm Beach.',
  },
  {
    q: 'How long does a detail take?',
    a: "It depends on the package and your vehicle's condition. An Economy detail is typically the quickest, while Silver and Gold packages involve deeper interior work and take longer. We'll give you a time estimate when you book.",
  },
  {
    q: "What's the difference between the Economy, Silver, and Gold packages?",
    a: 'Economy is a quick refresh — exterior hand wash and interior vacuum. Silver adds deep interior cleaning, tire shine, and trim care. Gold is our full transformation package with steam cleaning, leather conditioning, pet hair removal, odor elimination, and a premium hand wax. Full details and pricing are on our Services page.',
  },
  {
    q: 'Do you offer ceramic coating? How long does it last?',
    a: "Yes. Our ceramic coating service includes full paint decontamination and a one-step polish before application. Unlike wax, which wears away in weeks, a properly applied ceramic coating can protect your paint for years.",
  },
  {
    q: 'Do I need to be present during the service?',
    a: "Not necessarily — as long as we have access to your vehicle and a place to park, you're free to go about your day. Many customers book us while they're at work or running errands."
  },
  {
    q: 'How far in advance should I book?',
    a: "We offer same-day and same-week availability in most cases. We recommend booking a few days ahead for weekend slots, but reach out and we'll do our best to fit your schedule.",
  },
  {
    q: 'What if it rains on my appointment day?',
    a: "South Florida weather happens — if rain is likely to affect your service, we'll reach out to reschedule at no extra cost, or adjust to a covered location if one is available.",
  },
  {
    q: 'Are you insured?',
    a: "Yes, Teal Detailing is fully insured for your peace of mind.",
  },
  {
    q: 'How do I book an appointment?',
    a: `Fill out the quote form on this site, or call us at ${PHONE_DISPLAY} — we typically respond within 15 minutes to confirm your appointment.`,
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-20 bg-white" aria-labelledby="faq-heading">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map(({ q, a }) => ({
              '@type': 'Question',
              name: q,
              acceptedAnswer: {
                '@type': 'Answer',
                text: a,
              },
            })),
          }),
        }}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-[0.9rem] font-semibold uppercase tracking-widest text-teal-700 mb-3">
            FAQ
          </p>
          <h2 id="faq-heading" className="text-[2.16rem] sm:text-[2.88rem] font-extrabold text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-slate-600 max-w-xl mx-auto text-[1.2rem] leading-relaxed">
            Everything you need to know before booking your detail.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {faqs.map((item, i) => {
            const isOpen = openIndex === i
            return (
              <div
                key={item.q}
                className="rounded-2xl border border-slate-200 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 bg-white hover:bg-slate-50 transition-colors"
                >
                  <span className="font-semibold text-slate-900">{item.q}</span>
                  <svg
                    className={`w-5 h-5 flex-shrink-0 text-teal-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-slate-600 leading-relaxed text-[0.95rem]">
                    {item.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
