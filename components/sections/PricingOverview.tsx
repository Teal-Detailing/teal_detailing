'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import PricingCard from '@/components/ui/PricingCard'
import { pricingPlans } from '@/lib/plans'

const basePrices = [99, 179, 249]
const baseOldPrices = [129, 229, 329]

const carTypes = [
  {
    id: 'sedan',
    label: 'Sedan & Coupe',
    surcharge: 0,
    icon: (selected: boolean) => (
      <Image
        src="/icons/sedan.png"
        alt="Sedan & Coupe"
        width={512}
        height={512}
        className={`w-16 h-16 sm:w-20 sm:h-20 object-contain transition-all duration-300 brightness-0 invert ${selected ? 'opacity-100' : 'opacity-40 group-hover:opacity-60'}`}
      />
    ),
  },
  {
    id: 'suv',
    label: 'Small SUV & Truck',
    surcharge: 10,
    icon: (selected: boolean) => (
      <Image
        src="/icons/suv.png"
        alt="Small SUV & Truck"
        width={512}
        height={512}
        className={`w-16 h-16 sm:w-20 sm:h-20 object-contain transition-all duration-300 brightness-0 invert ${selected ? 'opacity-100' : 'opacity-40 group-hover:opacity-60'}`}
      />
    ),
  },
  {
    id: 'large',
    label: 'Large SUV, Truck & Van',
    surcharge: 20,
    icon: (selected: boolean) => (
      <Image
        src="/icons/large.png"
        alt="Large SUV, Truck & Van"
        width={512}
        height={512}
        className={`w-16 h-16 sm:w-20 sm:h-20 object-contain transition-all duration-300 brightness-0 invert ${selected ? 'opacity-100' : 'opacity-40 group-hover:opacity-60'}`}
      />
    ),
  },
]

export default function PricingOverview() {
  const [selectedCar, setSelectedCar] = useState(0)
  const [animating, setAnimating] = useState(false)

  function handleCarChange(index: number) {
    if (index === selectedCar) return
    setAnimating(true)
    setTimeout(() => {
      setSelectedCar(index)
      setAnimating(false)
    }, 200)
  }

  const surcharge = carTypes[selectedCar].surcharge

  const adjustedPlans = pricingPlans.map((plan, i) => ({
    ...plan,
    price: `$${basePrices[i] + surcharge}`,
    oldPrice: `$${baseOldPrices[i] + surcharge}`,
  }))

  return (
    <section id="packages" className="py-20 bg-ink" aria-labelledby="pricing-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-[0.9rem] font-semibold uppercase tracking-widest text-teal-400 mb-3">
            Transparent Pricing
          </p>
          <h2 id="pricing-heading" className="text-[2.16rem] sm:text-[2.88rem] font-extrabold text-white">
            Choose Your Package
          </h2>
          <p className="mt-3 text-slate-400 max-w-xl mx-auto text-[1.2rem] leading-relaxed">
            No hidden fees. No surprises. Every package includes our satisfaction guarantee.
          </p>
        </div>

        {/* Car type toggle */}
        <p className="text-center text-slate-400 text-sm mb-3">
          Select your vehicle size — price updates automatically below
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 mb-10">
          {carTypes.map((car, i) => {
            const selected = selectedCar === i
            return (
              <button
                key={car.id}
                onClick={() => handleCarChange(i)}
                aria-pressed={selected}
                className={`group relative flex flex-row sm:flex-col items-center gap-4 sm:gap-3 px-6 py-5 sm:w-48 rounded-2xl overflow-hidden bg-gradient-to-b from-[#181b21] to-[#0a0c0f] ring-1 transition-all duration-300 text-left sm:text-center ${
                  selected
                    ? 'ring-teal-400/50 shadow-glow'
                    : 'ring-white/10 hover:ring-white/20'
                }`}
              >
                <span
                  className={`absolute top-0 left-0 h-[3px] w-full bg-gradient-to-r from-teal-700 via-teal-300 to-teal-700 transition-opacity duration-300 ${
                    selected ? 'opacity-100' : 'opacity-0'
                  }`}
                />
                <div className="flex-shrink-0">{car.icon(selected)}</div>
                <span
                  className={`text-xs font-bold uppercase tracking-[0.15em] transition-colors duration-300 ${
                    selected ? 'text-teal-300' : 'text-slate-400 group-hover:text-slate-300'
                  }`}
                >
                  {car.label}
                </span>
              </button>
            )
          })}
        </div>

        {/* Pricing cards */}
        <div
          className={`flex flex-col sm:flex-row sm:items-start gap-6 transition-opacity duration-200 ${animating ? 'opacity-0' : 'opacity-100'}`}
        >
          {adjustedPlans.map((plan) => (
            <div key={plan.name} className="flex-1">
              <PricingCard {...plan} />
            </div>
          ))}
        </div>

        {/* Full price list — always rendered so every vehicle-size price is visible, not just the selected tab */}
        <div className="mt-10">
          <h3 className="text-center text-white font-bold text-lg mb-1">Full Price List by Vehicle Size</h3>
          <p className="text-center text-slate-400 text-sm mb-5">
            Every price, every size, up front — no need to ask.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-white/5">
                  <th scope="col" className="px-4 py-3 text-left font-semibold text-slate-300">Package</th>
                  {carTypes.map((car) => (
                    <th key={car.id} scope="col" className="px-4 py-3 text-right font-semibold text-slate-300">
                      {car.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pricingPlans.map((plan, i) => (
                  <tr key={plan.name} className="border-t border-white/10">
                    <th scope="row" className="px-4 py-3 text-left font-semibold text-white">{plan.name}</th>
                    {carTypes.map((car) => (
                      <td key={car.id} className="px-4 py-3 text-right text-base sm:text-lg font-extrabold text-teal-400">
                        ${basePrices[i] + car.surcharge}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add-on banner */}
        <div className="mt-10 rounded-[28px] overflow-hidden bg-gradient-to-b from-[#181b21] to-[#0a0c0f] ring-1 ring-teal-500/25 shadow-dark-card hover:shadow-glow transition-shadow duration-300 flex flex-col sm:flex-row items-stretch">
          <div className="flex-1 px-8 py-8 sm:py-10 flex flex-col justify-center">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-teal-400">Extra Care</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">Deep Stain Extraction</h3>
            <p className="text-slate-400 text-base leading-relaxed mt-3 max-w-md">
              Tough stains, spills or heavily soiled upholstery? Add professional extraction to any detailing package.
            </p>
            <div className="flex items-center gap-2.5 mt-6">
              <span className="text-lg font-extrabold text-teal-400">From $99</span>
              <span className="text-slate-600">·</span>
              <Link
                href="/services/stain-removal"
                className="inline-flex items-center gap-1 text-white font-semibold hover:text-teal-300 transition-colors"
              >
                Learn More
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
          <div className="relative w-full sm:w-72 h-48 sm:h-auto flex-shrink-0">
            <Image
              src="/services/stain-removal.webp"
              alt="Deep stain extraction service"
              fill
              className="object-cover"
            />
            <div className="hidden sm:block absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#0a0c0f] to-transparent" />
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-teal-500 text-teal-400 font-semibold hover:bg-teal-500/10 transition-colors text-sm"
          >
            View All Services & Details
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
