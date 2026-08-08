'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import PricingCard from '@/components/ui/PricingCard'
import { pricingPlans } from '@/lib/plans'

function StarOutline() {
  return (
    <svg className="w-10 h-10 drop-shadow-[0_0_6px_rgba(45,212,191,0.6)]" viewBox="0 0 24 24" fill="none" stroke="#2DD4BF" strokeWidth="1.5" strokeLinejoin="round">
      <path d="M12 2l2.939 6.326L22 9.274l-5 4.861 1.18 6.865L12 17.77l-6.18 3.23L7 14.135 2 9.274l7.061-.948L12 2z" />
    </svg>
  )
}

const basePrices = [99, 179, 249]
const baseOldPrices = [129, 229, 329]

const carTypes = [
  {
    id: 'sedan',
    label: 'Sedan & Coupe',
    surcharge: 0,
    icon: (selected: boolean) => <Image src="/icons/sedan.png" alt="Sedan & Coupe" width={512} height={512} className={`w-20 h-20 object-contain transition-all duration-200 ${selected ? '' : 'brightness-0 invert opacity-70'}`} />,
  },
  {
    id: 'suv',
    label: 'Small SUV & Truck',
    surcharge: 10,
    icon: (selected: boolean) => <Image src="/icons/suv.png" alt="Small SUV & Truck" width={512} height={512} className={`w-20 h-20 object-contain transition-all duration-200 ${selected ? '' : 'brightness-0 invert opacity-70'}`} />,
  },
  {
    id: 'large',
    label: 'Large SUV, Truck & Van',
    surcharge: 20,
    icon: (selected: boolean) => <Image src="/icons/large.png" alt="Large SUV, Truck & Van" width={512} height={512} className={`w-20 h-20 object-contain transition-all duration-200 ${selected ? '' : 'brightness-0 invert opacity-70'}`} />,
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
        <div className="flex justify-center mb-10">
          <div className="inline-flex flex-col sm:flex-row gap-2 bg-white/5 border border-white/10 rounded-2xl p-2 w-full sm:w-auto">
            {carTypes.map((car, i) => (
              <button
                key={car.id}
                onClick={() => handleCarChange(i)}
                className={`flex flex-row sm:flex-col items-center gap-3 sm:gap-1.5 px-4 py-3 rounded-xl transition-all duration-200 text-left sm:text-center ${
                  selectedCar === i
                    ? 'bg-teal-700 text-white shadow-glow'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <div className="flex-shrink-0">{car.icon(selectedCar === i)}</div>
                <span className="text-xs font-semibold">{car.label}</span>
              </button>
            ))}
          </div>
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
        <div className="mt-6 rounded-2xl border-2 border-teal-500 overflow-hidden flex flex-col sm:flex-row items-stretch">
          <div className="flex flex-col items-center justify-center px-6 py-4 gap-0.5">
            <div className="flex gap-0.5">
              <StarOutline />
            </div>
            <div className="flex gap-0.5">
              <StarOutline /><StarOutline />
            </div>
            <div className="flex gap-0.5">
              <StarOutline />
            </div>
          </div>
          <div className="flex-1 px-6 py-5 flex flex-col justify-center gap-2">
            <p className="text-[1.2rem] font-extrabold text-teal-400 uppercase tracking-wide">Add-On Available:</p>
            <p className="text-slate-300 text-[1rem] leading-relaxed max-w-md">
              For tough stains, spills and spot treatment, ask us about our additional stain removal service.
            </p>
          </div>
          <div className="relative w-full sm:w-56 h-40 sm:h-auto flex-shrink-0">
            <Image
              src="/services/stain-removal.webp"
              alt="Stain removal service"
              fill
              className="object-cover"
            />
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
