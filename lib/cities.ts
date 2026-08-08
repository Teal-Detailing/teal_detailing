export interface CityFaqItem {
  q: string
  a: string
}

export interface CityData {
  slug: string
  name: string
  county: { slug: string; name: string }
  metaTitle: string
  metaDescription: string
  heroIntro: string
  neighborhoods: string[]
  angleTitle: string
  angleBody: string
  featuredReviewNames?: string[]
  extraFaq?: CityFaqItem[]
}

export const cities: CityData[] = [
  {
    slug: 'miami',
    name: 'Miami',
    county: { slug: 'miami-dade', name: 'Miami-Dade County' },
    metaTitle: 'Mobile Car Detailing in Miami, FL',
    metaDescription:
      'Mobile car detailing in Miami, FL. We come to your condo, office, or valet garage — no water or electricity hookup needed. Same-day availability, 5-star rated.',
    heroIntro:
      "Most Miami cars live between a condo garage and a valet stand, not a driveway with a hose. That's exactly why mobile detailing works so well here — our team brings its own water and power, so a high-rise parking garage or a metered street spot is all we need to get your car looking showroom-fresh.",
    neighborhoods: [
      'Downtown Miami', 'Brickell', 'Coconut Grove', 'Coral Way',
      'Little Havana', 'Edgewater', 'Wynwood', 'Upper Eastside',
      'Flagami', 'Allapattah',
    ],
    angleTitle: 'Built for Condo and Garage Living',
    angleBody:
      "No outdoor spigot? No problem. Because we carry our own water supply and run equipment off a battery station instead of a generator, we can detail your car in a covered garage or a tight condo parking spot without needing a single hookup — or bothering your neighbors with noise or fumes.",
    featuredReviewNames: ['Ariane B.', 'Erik G.'],
    extraFaq: [
      {
        q: 'Can you detail my car in a condo or apartment parking garage?',
        a: "Yes — this is one of the most common setups we work in across Miami. As long as we have access to the vehicle and enough room to move around it, a covered garage spot works fine. We don't need an outdoor hookup of any kind.",
      },
    ],
  },
  {
    slug: 'fort-lauderdale',
    name: 'Fort Lauderdale',
    county: { slug: 'broward', name: 'Broward County' },
    metaTitle: 'Mobile Car Detailing in Fort Lauderdale, FL',
    metaDescription:
      'Mobile car detailing in Fort Lauderdale, FL. We come to your home, dock, or waterfront driveway across Las Olas, Victoria Park, Rio Vista, and more.',
    heroIntro:
      "Fort Lauderdale's canals and waterfront driveways bring their own paint problems — salt air off the water and constant humidity speed up oxidation and water spotting. We bring the full setup to your driveway or dock-side parking, so your car gets the same protection whether you live on the water in Rio Vista or a few blocks inland.",
    neighborhoods: [
      'Las Olas Isles', 'Victoria Park', 'Rio Vista', 'Coral Ridge',
      'Colee Hammock', 'Harbor Beach', 'Tarpon River', 'Sailboat Bend',
    ],
    angleTitle: 'Protection Against Salt Air and Humidity',
    angleBody:
      "Cars parked near Fort Lauderdale's canals and waterways take a beating from salt spray and constant humidity. Our ceramic coating and sealant options are chosen specifically to hold up against that — and because we come to you, your car doesn't need to sit out any longer than necessary to get protected.",
  },
  {
    slug: 'hollywood-fl',
    name: 'Hollywood',
    county: { slug: 'broward', name: 'Broward County' },
    metaTitle: 'Mobile Car Detailing in Hollywood, FL',
    metaDescription:
      'Mobile car detailing in Hollywood, FL — serving Hollywood Beach, Downtown Hollywood, and surrounding neighborhoods. We come to you, same-day availability.',
    heroIntro:
      "Living near Hollywood Beach means sand and salt spray find their way into every seat crease and floor mat faster than almost anywhere else in Broward. Whether you're a few blocks from the Broadwalk or further inland near Downtown Hollywood, we bring a full mobile setup to wherever your car is parked.",
    neighborhoods: [
      'Hollywood Beach', 'Downtown Hollywood', 'Emerald Hills', 'Hollywood Hills',
      'Hillcrest', 'Highland Gardens', 'Park East',
    ],
    angleTitle: 'Beach-Town Sand and Salt, Handled',
    angleBody:
      "Sand in the carpet and salt film on the paint are the two biggest complaints we hear from Hollywood clients — both are exactly what our hot-water extraction and full exterior wash are built to handle. No need to drive to a shop; we work right where your car is parked, beach gear and all.",
  },
  {
    slug: 'boca-raton',
    name: 'Boca Raton',
    county: { slug: 'palm-beach', name: 'Palm Beach County' },
    metaTitle: 'Mobile Car Detailing in Boca Raton, FL',
    metaDescription:
      'Mobile car detailing in Boca Raton, FL. Concierge-level service for gated communities, luxury, and exotic vehicles — we come to you.',
    heroIntro:
      "Boca Raton's gated communities and HOA-managed neighborhoods mean guest access can be its own hassle for an outside shop. As a mobile service, we simply schedule with your gate or clubhouse ahead of time and come straight to your driveway — no drop-off, no towing a car through traffic on Federal Highway.",
    neighborhoods: [
      'East Boca', 'Royal Palm Yacht & Country Club', 'Boca Del Mar', 'Golden Triangle',
      'Spanish River', 'Central Boca', 'West Boca Raton',
    ],
    angleTitle: 'Concierge Service for Gated Communities',
    angleBody:
      "We regularly coordinate directly with gate attendants and HOA offices across Boca Raton so getting our van in is one less thing for you to manage. Our technicians are trained on delicate luxury and exotic finishes — matte wraps, ceramic-coated paint, and PPF — so your vehicle is in careful hands regardless of what's in the garage.",
  },
  {
    slug: 'pembroke-pines',
    name: 'Pembroke Pines',
    county: { slug: 'broward', name: 'Broward County' },
    metaTitle: 'Mobile Car Detailing in Pembroke Pines, FL',
    metaDescription:
      'Mobile car detailing in Pembroke Pines, FL. We come to your driveway across Chapel Trail, Silver Lakes, Pembroke Falls, and more — same-day availability.',
    heroIntro:
      "Pembroke Pines is a driveway city — wide, family-friendly, and full of the SUVs and minivans that actually need the deepest interior cleaning. We bring the full setup right to your driveway, so you don't have to load the kids back into a dirty car just to drop it off somewhere else.",
    neighborhoods: [
      'Chapel Trail', 'Silver Lakes', 'Century Village', 'Pembroke Falls',
      'Encantada', 'Grand Palms', 'Towngate', 'Pembroke Isles',
    ],
    angleTitle: 'Built for Family Driveways',
    angleBody:
      "Crushed goldfish crackers, sandy cleats, spilled juice boxes — our Gold package's steam cleaning and odor elimination are made for exactly this kind of daily family wear. We work in your driveway while you're home, so there's no need to arrange a ride or coordinate a drop-off.",
    featuredReviewNames: ['Damion'],
  },
]

export function getCityBySlug(slug: string): CityData | undefined {
  return cities.find((c) => c.slug === slug)
}
