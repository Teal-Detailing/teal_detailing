import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Teal Detailing privacy policy — how we collect, use, and protect your personal information.',
  alternates: { canonical: 'https://tealdetailing.com/privacy-policy' },
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="bg-hero-gradient pt-32 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-400 mb-4">
            Legal
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">Privacy Policy</h1>
          <p className="text-slate-400 text-sm">Last updated: August 6, 2026</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-slate max-w-none">

            <h2 className="text-2xl font-bold text-slate-900 mt-0 mb-4">1. Who We Are</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Teal Detailing LLC (&quot;Teal Detailing,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) provides mobile
              car detailing services across Miami-Dade, Broward, and Palm Beach counties in South
              Florida. Our website is{' '}
              <Link href="/" className="text-teal-600 hover:text-teal-500">
                tealdetailing.com
              </Link>
              . Questions? Email us at{' '}
              <a href="mailto:info@tealdetailing.com" className="text-teal-600 hover:text-teal-500">
                info@tealdetailing.com
              </a>
              .
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Information We Collect</h2>

            <h3 className="text-lg font-semibold text-slate-800 mb-2">2a. Information You Provide</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              When you submit a booking or quote request through our website, we collect:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-1 mb-6 ml-2">
              <li>Full name</li>
              <li>Phone number</li>
              <li>Email address</li>
              <li>Vehicle type</li>
              <li>Service requested</li>
              <li>Any additional notes you choose to provide</li>
            </ul>
            <p className="text-slate-600 leading-relaxed mb-6">
              Form submissions are processed by{' '}
              <a
                href="https://web3forms.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-600 hover:text-teal-500"
              >
                Web3Forms
              </a>{' '}
              and forwarded to{' '}
              <a href="mailto:info@tealdetailing.com" className="text-teal-600 hover:text-teal-500">
                info@tealdetailing.com
              </a>
              . We use this information solely to respond to your inquiry and schedule your
              detailing appointment.
            </p>

            <h3 className="text-lg font-semibold text-slate-800 mb-2">2b. Analytics Data</h3>
            <p className="text-slate-600 leading-relaxed mb-6">
              We use Google Analytics 4 (GA4) to understand how visitors interact with our website.
              GA4 may collect information such as your approximate geographic location, browser
              type, device type, pages visited, and time spent on the site. This data is aggregated
              and does not personally identify you. Analytics cookies are only activated after you
              consent via our cookie banner.
            </p>

            <h3 className="text-lg font-semibold text-slate-800 mb-2">2c. Spam Prevention</h3>
            <p className="text-slate-600 leading-relaxed mb-6">
              Our forms use a hidden honeypot field to help filter out automated spam submissions.
              This check runs entirely within our form provider (Web3Forms) and does not collect
              any additional information about you.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Cookies</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              We use the following types of cookies:
            </p>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-2 pr-4 font-semibold text-slate-800">Cookie</th>
                    <th className="py-2 pr-4 font-semibold text-slate-800">Purpose</th>
                    <th className="py-2 font-semibold text-slate-800">Duration</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600">
                  <tr className="border-b border-slate-100">
                    <td className="py-2 pr-4 font-mono text-xs">teal-cookie-consent</td>
                    <td className="py-2 pr-4">Stores your cookie preference (accepted / declined)</td>
                    <td className="py-2">localStorage (persistent)</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-mono text-xs">_ga, _ga_*</td>
                    <td className="py-2 pr-4">Google Analytics — distinguishes unique visitors</td>
                    <td className="py-2">2 years (if accepted)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-slate-600 leading-relaxed mb-6">
              You can withdraw your analytics consent at any time by clearing your browser&apos;s
              local storage or by clearing cookies in your browser settings.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. How We Use Your Information</h2>
            <ul className="list-disc list-inside text-slate-600 space-y-1 mb-6 ml-2">
              <li>To respond to booking inquiries and schedule appointments</li>
              <li>To contact you about your service (phone, text, or email)</li>
              <li>To improve our website based on anonymized usage patterns</li>
              <li>To prevent spam and fraudulent form submissions</li>
            </ul>
            <p className="text-slate-600 leading-relaxed mb-6">
              We do not sell, rent, or share your personal information with third parties for
              marketing purposes.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Data Retention</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Form submission data is retained in our email inbox and Web3Forms dashboard for as
              long as necessary to fulfill your service request. If you would like your data
              removed, contact us at{' '}
              <a href="mailto:info@tealdetailing.com" className="text-teal-600 hover:text-teal-500">
                info@tealdetailing.com
              </a>
              .
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Third-Party Services</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              We rely on the following third-party services. Each has its own privacy policy:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-1 mb-6 ml-2">
              <li>
                <a
                  href="https://www.netlify.com/privacy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:text-teal-500"
                >
                  Netlify
                </a>{' '}
                — website hosting
              </li>
              <li>
                <a
                  href="https://web3forms.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:text-teal-500"
                >
                  Web3Forms
                </a>{' '}
                — form submission processing
              </li>
              <li>
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:text-teal-500"
                >
                  Google Analytics
                </a>{' '}
                — anonymous site analytics (consent-gated)
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Your Rights</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Depending on your location, you may have rights under applicable privacy laws (such
              as CCPA for California residents or GDPR for EU residents) including the right to
              access, correct, or delete your personal data. To exercise any of these rights,
              contact us at{' '}
              <a href="mailto:info@tealdetailing.com" className="text-teal-600 hover:text-teal-500">
                info@tealdetailing.com
              </a>
              .
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Changes to This Policy</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              We may update this policy occasionally. Changes will be posted on this page with
              an updated date. Continued use of our website after changes constitutes acceptance
              of the revised policy.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Contact Us</h2>
            <p className="text-slate-600 leading-relaxed">
              Questions about this privacy policy? Reach us at:
            </p>
            <address className="not-italic text-slate-600 mt-3 space-y-1">
              <p className="font-semibold text-slate-800">Teal Detailing LLC</p>
              <p>South Florida, FL</p>
              <p>
                <a href="mailto:info@tealdetailing.com" className="text-teal-600 hover:text-teal-500">
                  info@tealdetailing.com
                </a>
              </p>
              <p>
                <a href="tel:+16452488292" className="text-teal-600 hover:text-teal-500">
                  (645) 248-8292
                </a>
              </p>
            </address>
          </div>
        </div>
      </section>
    </>
  )
}
