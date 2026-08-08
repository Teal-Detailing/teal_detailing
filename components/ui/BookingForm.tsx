'use client'

import { useState } from 'react'
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

const vehicleSurcharges: Record<string, number> = {
  'Sedan': 0,
  'Coupe': 0,
  'Sports Car': 0,
  'SUV / Crossover': 10,
  'Truck': 10,
  'Van / Minivan': 20,
  'Luxury / Exotic': 20,
}

const extraServices = [
  'Ceramic Coating',
  'Clay Bar Treatment',
  'Exterior Detailing',
  'Headlight Restoration',
  'Interior Detailing',
  'Mobile Car Detailing',
  'Paint Correction',
  'Pet Hair Removal',
  'Stain Removal',
  'Engine Bay Cleaning',
  'Other / Custom Quote',
]

function getPackageOptions(surcharge: number) {
  return [
    `Economy Detail ($${99 + surcharge})`,
    `Silver Detail ($${179 + surcharge})`,
    `Gold Detail ($${249 + surcharge})`,
  ]
}

function getPackageAccent(service: string): string {
  if (service.startsWith('Economy')) return 'bg-slate-100 text-slate-700 border-slate-300'
  if (service.startsWith('Silver')) return 'bg-blue-50 text-blue-700 border-blue-200'
  if (service.startsWith('Gold')) return 'bg-amber-50 text-amber-700 border-amber-300'
  return 'bg-teal-50 text-teal-700 border-teal-200'
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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    vehicleType: '',
    services: defaultService ? [defaultService] : [] as string[],
    timeSlot: '',
    message: '',
  })


  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleVehicleTypeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newType = e.target.value
    const newSurcharge = vehicleSurcharges[newType] ?? 0
    const newPackages = getPackageOptions(newSurcharge)
    const oldPackages = getPackageOptions(vehicleSurcharges[form.vehicleType] ?? 0)
    setForm(prev => ({
      ...prev,
      vehicleType: newType,
      services: prev.services.map(s => {
        const idx = oldPackages.indexOf(s)
        return idx !== -1 ? newPackages[idx] : s
      }),
    }))
  }

  function togglePackage(option: string) {
    const packageOptions = getPackageOptions(vehicleSurcharges[form.vehicleType] ?? 0)
    setForm(prev => {
      const withoutPackages = prev.services.filter(s => !packageOptions.includes(s))
      const isSelected = prev.services.includes(option)
      return { ...prev, services: isSelected ? withoutPackages : [...withoutPackages, option] }
    })
  }

  function toggleExtraService(option: string) {
    setForm(prev => ({
      ...prev,
      services: prev.services.includes(option)
        ? prev.services.filter(s => s !== option)
        : [...prev.services, option],
    }))
  }

  function removeService(option: string) {
    setForm(prev => ({ ...prev, services: prev.services.filter(s => s !== option) }))
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


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!compact && !selectedDate) {
      setError('Please select a preferred date.')
      return
    }
    if (!compact && !form.timeSlot) {
      setError('Please select a preferred time of day.')
      return
    }
    if (!compact && form.services.length === 0) {
      setError('Please select at least one service.')
      return
    }
    setSubmitting(true)
    setError('')

    const formName = compact ? 'quote-compact' : 'quote-full'
    const slot = timeSlots.find(t => t.value === form.timeSlot)
    const timeLabel = slot ? `${slot.label} (${slot.hours})` : form.timeSlot
    const serviceLabel = form.services.join(' + ')

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: 'dfe29cf1-1805-4522-b998-a41c2c100e2f',
          subject: `New Booking Request — ${serviceLabel || 'General Inquiry'}`,
          from_name: 'Teal Detailing Website',
          botcheck: false,
          name: form.name,
          phone: form.phone,
          email: form.email || 'info@tealdetailing.com',
          vehicle_type: form.vehicleType || 'not provided',
          service: serviceLabel || 'not provided',
          date: selectedDate ? formatDisplayDate(selectedDate) : 'not provided',
          time_slot: timeLabel || 'not provided',
          location: location || 'not provided',
          message: form.message || '',
          form_type: formName,
        }),
      })

      const data = await response.json()
      if (!data.success) {
        throw new Error(data.message || 'Submission failed')
      }

      setSubmitted(true)
    } catch {
      setError(`Something went wrong. Please call us at ${PHONE_DISPLAY} or try again.`)
    } finally {
      setSubmitting(false)
    }
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
        {form.services.length > 0 && (
          <p className="text-xs text-teal-700 font-medium">
            {form.services.length === 1 ? 'Service' : 'Services'}: {form.services.join(', ')}
          </p>
        )}
        <button
          onClick={() => {
            setSubmitted(false)
            setSelectedDate(undefined)
            setForm({ name:'', phone:'', email:'', vehicleType:'', services:[], timeSlot:'', message:'' })
          }}
          className="text-teal-700 text-sm font-medium underline underline-offset-2"
        >
          Submit another request
        </button>
      </div>
    )
  }

  const currentSurcharge = vehicleSurcharges[form.vehicleType] ?? 0
  const currentPackageOptions = getPackageOptions(currentSurcharge)
  const formName = compact ? 'quote-compact' : 'quote-full'

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >

      {/* Header */}
      <div className="text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-teal-700">Free Quote</p>
        <p className="text-xl font-extrabold text-slate-900 mt-0.5">
          {location ? `Book in ${location}` : (
            <>Book Your Detailing Today — <span className="text-teal-700 whitespace-nowrap">Get Up To 24% OFF!</span></>
          )}
        </p>
        <p className="text-sm text-slate-500 mt-0.5">We come to you — same day availability</p>
      </div>

      {/* Selected services summary */}
      {form.services.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {form.services.map(s => (
            <div
              key={s}
              className={`flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full border text-sm font-medium ${getPackageAccent(s)}`}
            >
              <span>{s}</span>
              <button
                type="button"
                onClick={() => removeService(s)}
                className="text-current opacity-50 hover:opacity-100 transition-opacity text-lg leading-none"
                aria-label={`Remove ${s}`}
              >
                ×
              </button>
            </div>
          ))}
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

          <div>
            <label htmlFor="vehicleType" className="block text-sm font-semibold text-slate-700 mb-1">
              Vehicle Type *
            </label>
            <select
              id="vehicleType"
              name="vehicleType"
              required
              value={form.vehicleType}
              onChange={handleVehicleTypeChange}
              className="w-full px-3 py-3 text-base font-medium rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
            >
              <option value="">Select…</option>
              {vehicleTypes.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>

          <div>
            <span className="block text-sm font-semibold text-slate-700 mb-1">
              Service(s) Needed *
            </span>
            <p className="text-xs text-slate-500 mb-2">
              Pick a package and/or any add-ons — you can select more than one.
            </p>

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">Package</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {currentPackageOptions.map(opt => {
                const isSelected = form.services.includes(opt)
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => togglePackage(opt)}
                    aria-pressed={isSelected}
                    className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      isSelected
                        ? 'bg-teal-700 border-teal-700 text-white'
                        : 'border-slate-200 text-slate-600 hover:border-teal-300 hover:bg-slate-50'
                    }`}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">Additional Services</p>
            <div className="flex flex-wrap gap-2">
              {extraServices.map(opt => {
                const isSelected = form.services.includes(opt)
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleExtraService(opt)}
                    aria-pressed={isSelected}
                    className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      isSelected
                        ? 'bg-teal-700 border-teal-700 text-white'
                        : 'border-slate-200 text-slate-600 hover:border-teal-300 hover:bg-slate-50'
                    }`}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}

      {/* Preferred Date */}
      {!compact && (
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
      )}

      {/* Preferred Time */}
      {!compact && (
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
                <span className="text-xs text-slate-500 mt-0.5 leading-tight">{slot.hours}</span>
              </button>
            ))}
          </div>
        </div>
      )}

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

      {error && (
        <p className="text-xs text-red-600 text-center">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3.5 px-6 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-base transition-all duration-200 hover:shadow-glow active:scale-[0.98]"
      >
        {submitting ? 'Sending…' : 'Get My Free Quote'}
      </button>
      <p className="text-center text-sm text-slate-500">
        No commitment · We respond in 15 minutes
      </p>
    </form>
  )
}
