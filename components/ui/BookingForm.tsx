'use client'

import { useState, useEffect, useRef } from 'react'
import DatePicker, { formatDisplayDate } from './DatePicker'
import { PHONE_DISPLAY } from '@/lib/constants'

interface BookingFormProps {
  location?: string
  defaultService?: string
  compact?: boolean
}

const vehicleTypes = [
  'Sedan',
  'SUV / Crossover',
  'Truck',
  'Van / Minivan',
  'Coupe',
  'Sports Car',
  'Luxury / Exotic',
]

const serviceOptions = [
  'Economy Detail ($109)',
  'Silver Detail ($179)',
  'Gold Detail ($279)',
  'Ceramic Coating',
  'Clay Bar Treatment',
  'Exterior Detailing',
  'Headlight Restoration',
  'Interior Detailing',
  'Mobile Car Detailing',
  'Paint Correction',
  'Pet Hair Removal',
  'Other / Custom Quote',
]

const packageAccent: Record<string, string> = {
  'Economy Detail ($109)': 'bg-slate-100 text-slate-700 border-slate-300',
  'Silver Detail ($179)': 'bg-blue-50 text-blue-700 border-blue-200',
  'Gold Detail ($279)': 'bg-amber-50 text-amber-700 border-amber-300',
}

const timeSlots = [
  { value: 'morning',   label: 'Morning',   hours: '8am – 12pm' },
  { value: 'afternoon', label: 'Afternoon', hours: '12pm – 4pm' },
  { value: 'evening',   label: 'Evening',   hours: '4pm – 8pm'  },
]

export default function BookingForm({ location, defaultService, compact = false }: BookingFormProps) {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [recaptchaToken, setRecaptchaToken] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const recaptchaRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<number | null>(null)
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    vehicleType: '',
    service: defaultService ?? '',
    timeSlot: '',
    message: '',
  })

  // Mount reCAPTCHA widget
  useEffect(() => {
    if (!siteKey || !recaptchaRef.current) return

    const render = () => {
      if (!recaptchaRef.current || widgetIdRef.current !== null || !window.grecaptcha) return
      widgetIdRef.current = window.grecaptcha.render(recaptchaRef.current, {
        sitekey: siteKey,
        callback: (token: string) => setRecaptchaToken(token),
        'expired-callback': () => setRecaptchaToken(''),
      })
    }

    if (window.grecaptcha?.render) {
      render()
    } else {
      const timer = setInterval(() => {
        if (window.grecaptcha?.render) { clearInterval(timer); render() }
      }, 150)
      return () => clearInterval(timer)
    }
  }, [siteKey])

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, name: e.target.value.replace(/[0-9]/g, '') }))
  }

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10)
    let formatted = ''
    if (digits.length === 0) formatted = ''
    else if (digits.length <= 3) formatted = `(${digits}`
    else if (digits.length <= 6) formatted = `(${digits.slice(0, 3)}) ${digits.slice(3)}`
    else formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
    setForm(prev => ({ ...prev, phone: formatted }))
  }

  function resetRecaptcha() {
    if (widgetIdRef.current !== null) {
      window.grecaptcha?.reset(widgetIdRef.current)
      setRecaptchaToken('')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!selectedDate) {
      setError('Please select a preferred date.')
      return
    }
    if (!form.timeSlot) {
      setError('Please select a preferred time of day.')
      return
    }
    if (siteKey && !recaptchaToken) {
      setError('Please complete the reCAPTCHA challenge.')
      return
    }

    setSubmitting(true)
    setError('')

    const formName = compact ? 'quote-compact' : 'quote-full'
    const slot = timeSlots.find(t => t.value === form.timeSlot)
    const timeLabel = slot ? `${slot.label} (${slot.hours})` : form.timeSlot

    try {
      const response = await fetch('/__forms.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          'form-name': formName,
          'bot-field': '',
          name: form.name,
          phone: form.phone,
          email: form.email || '',
          vehicleType: form.vehicleType || '',
          service: form.service || '',
          date: formatDisplayDate(selectedDate),
          timeSlot: timeLabel,
          location: location || '',
          message: form.message || '',
        }).toString(),
      })

      if (!response.ok) {
        throw new Error('Submission failed')
      }

      setSubmitted(true)
      resetRecaptcha()
    } catch {
      setError(`Something went wrong. Please call us at ${PHONE_DISPLAY} or try again.`)
      resetRecaptcha()
    } finally {
      setSubmitting(false)
    }
  }

  function clearService() {
    setForm(prev => ({ ...prev, service: '' }))
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12 px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-teal-500/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-slate-900">Request Received!</h3>
        <p className="text-slate-600 text-sm leading-relaxed max-w-xs">
          Thanks, {form.name.split(' ')[0]}! We&apos;ll confirm your appointment within 15 minutes.
        </p>
        {selectedDate && form.timeSlot && (
          <div className="flex flex-col items-center gap-1 text-xs text-slate-500">
            <span className="font-medium text-slate-700">{formatDisplayDate(selectedDate)}</span>
            <span>{timeSlots.find(t => t.value === form.timeSlot)?.label}</span>
          </div>
        )}
        {form.service && (
          <p className="text-xs text-teal-600 font-medium">Package: {form.service}</p>
        )}
        <button
          onClick={() => {
            setSubmitted(false)
            setSelectedDate(undefined)
            setForm({ name:'', phone:'', email:'', vehicleType:'', service:'', timeSlot:'', message:'' })
          }}
          className="text-teal-600 text-sm font-medium underline underline-offset-2"
        >
          Submit another request
        </button>
      </div>
    )
  }

  const selectedPackage = serviceOptions.slice(0, 3).includes(form.service) ? form.service : null
  const formName = compact ? 'quote-compact' : 'quote-full'

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
      name={formName}
    >
      <input type="hidden" name="form-name" value={formName} />
      <p style={{ display: 'none' }}>
        <label>Don&apos;t fill this out: <input name="bot-field" /></label>
      </p>

      {/* Header */}
      <div className="text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-teal-500">Free Quote</p>
        <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
          {location ? `Book in ${location}` : (
            <>Book Your Detailing Today — <span className="text-teal-600 whitespace-nowrap">Get Up To 30% OFF!</span></>
          )}
        </h3>
        <p className="text-sm text-slate-500 mt-0.5">We come to you — same day availability</p>
      </div>

      {/* Pre-selected package banner */}
      {selectedPackage && (
        <div
          className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium ${
            packageAccent[selectedPackage] ?? 'bg-teal-50 text-teal-700 border-teal-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            <span>{selectedPackage}</span>
          </div>
          <button
            type="button"
            onClick={clearService}
            className="text-current opacity-50 hover:opacity-100 transition-opacity text-lg leading-none"
            aria-label="Clear selection"
          >
            ×
          </button>
        </div>
      )}

      {/* Name + Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1">
            Full Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleNameChange}
            placeholder="John Smith"
            className="w-full px-3 py-3 text-base font-medium rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-1">
            Phone *
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            value={form.phone}
            onChange={handlePhoneChange}
            placeholder="(305) 555-0100"
            className="w-full px-3 py-3 text-base font-medium rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
          />
        </div>
      </div>

      {/* Full form fields */}
      {!compact && (
        <>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1">
              Email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="w-full px-3 py-3 text-base font-medium rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="vehicleType" className="block text-sm font-semibold text-slate-700 mb-1">
                Vehicle Type *
              </label>
              <select
                id="vehicleType"
                name="vehicleType"
                required
                value={form.vehicleType}
                onChange={handleChange}
                className="w-full px-3 py-3 text-base font-medium rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
              >
                <option value="">Select…</option>
                {vehicleTypes.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="service" className="block text-sm font-semibold text-slate-700 mb-1">
                Service Needed *
              </label>
              <select
                id="service"
                name="service"
                required
                value={form.service}
                onChange={handleChange}
                className={`w-full px-3 py-3 text-base font-medium rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition ${
                  selectedPackage ? 'border-teal-400 ring-1 ring-teal-300' : 'border-slate-200'
                }`}
              >
                <option value="">Select…</option>
                {serviceOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </>
      )}

      {/* Preferred Date */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">
          Preferred Date *
        </label>
        <DatePicker
          value={selectedDate}
          onChange={setSelectedDate}
          placeholder="Select a date…"
        />
      </div>

      {/* Preferred Time */}
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">
          Preferred Time *
        </label>
        <div className="grid grid-cols-3 gap-2">
          {timeSlots.map(slot => (
            <button
              key={slot.value}
              type="button"
              onClick={() => setForm(prev => ({ ...prev, timeSlot: slot.value }))}
              className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border text-center transition-all duration-150 ${
                form.timeSlot === slot.value
                  ? 'border-teal-400 bg-teal-50 text-teal-700 ring-1 ring-teal-300'
                  : 'border-slate-200 text-slate-600 hover:border-teal-300 hover:bg-slate-50'
              }`}
            >
              <span className="text-sm font-bold leading-tight">{slot.label}</span>
              <span className="text-xs text-slate-400 mt-0.5 leading-tight">{slot.hours}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-1">
          {compact ? 'Notes' : 'Additional Notes'}
        </label>
        <textarea
          id="message"
          name="message"
          rows={2}
          value={form.message}
          onChange={handleChange}
          placeholder={
            compact
              ? 'Any details about your vehicle or service needs…'
              : 'Location, special requests, or anything else we should know…'
          }
          className="w-full px-3 py-3 text-base font-medium rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition resize-none"
        />
      </div>

      {/* reCAPTCHA */}
      {siteKey && (
        <div className="flex justify-center">
          <div ref={recaptchaRef} />
        </div>
      )}

      {error && (
        <p className="text-xs text-red-600 text-center">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3.5 px-6 rounded-xl bg-teal-500 hover:bg-teal-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-base transition-all duration-200 hover:shadow-glow active:scale-[0.98]"
      >
        {submitting ? 'Sending…' : 'Get My Free Quote'}
      </button>
      <p className="text-center text-sm text-slate-400">
        No commitment · We respond in 15 minutes
      </p>
    </form>
  )
}
