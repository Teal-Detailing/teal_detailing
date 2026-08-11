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
      'Mobile car detailing in Miami, FL. We come to your condo, office, or valet garage — no water or electricity hookup needed. Same-day appointments when available, 5-star rated.',
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
      'Mobile car detailing in Hollywood, FL — serving Hollywood Beach, Downtown Hollywood, and surrounding neighborhoods. We come to you, same-day appointments when available.',
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
      'Mobile car detailing in Pembroke Pines, FL. We come to your driveway across Chapel Trail, Silver Lakes, Pembroke Falls, and more — same-day appointments when available.',
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
  {
    slug: 'miami-beach',
    name: 'Miami Beach',
    county: { slug: 'miami-dade', name: 'Miami-Dade County' },
    metaTitle: 'Mobile Car Detailing in Miami Beach, FL',
    metaDescription:
      'Mobile car detailing in Miami Beach, FL. We come to your condo garage or valet stand across South Beach, Mid-Beach, and North Beach — same-day appointments when available.',
    heroIntro:
      "Being on a barrier island means Miami Beach cars get hit with ocean salt spray and UV exposure worse than almost anywhere else in South Florida. Between that and the valet-and-garage reality of beachfront condo living, we built our mobile setup specifically to work without a hookup and to protect paint against exactly this kind of exposure.",
    neighborhoods: [
      'South Beach', 'Mid-Beach', 'North Beach', 'Sunset Harbour',
      'Flamingo Park', 'Venetian Islands', 'Art Deco District',
    ],
    angleTitle: 'Built to Handle Ocean Salt Air',
    angleBody:
      "Cars parked steps from the ocean take on salt film fast, and it eats into unprotected paint and chrome quickly. Our ceramic coating and sealant options are chosen specifically to push back against that — and since we work in garages and valet areas without needing a hookup, your car doesn't have to sit out in it any longer than necessary.",
  },
  {
    slug: 'coral-gables',
    name: 'Coral Gables',
    county: { slug: 'miami-dade', name: 'Miami-Dade County' },
    metaTitle: 'Mobile Car Detailing in Coral Gables, FL',
    metaDescription:
      'Mobile car detailing in Coral Gables, FL. Driveway service across the Biltmore Section, Old Cutler, Gables Estates, and more — no hookup needed.',
    heroIntro:
      "Coral Gables' tree-lined streets and Mediterranean Revival architecture come with some of the strictest HOA and city aesthetic rules in Miami-Dade — which is exactly why a quiet, no-hose, no-generator mobile setup fits so well here. We work in your driveway without the noise or mess that can draw a neighbor's attention.",
    neighborhoods: [
      'Downtown Coral Gables', 'Biltmore Section', 'Old Cutler', 'Gables Estates',
      'University Area', 'Ponce-Davis',
    ],
    angleTitle: 'Quiet Service for a Quiet City',
    angleBody:
      "Because we run on a battery station instead of a gas generator and bring our own water, there's no noise, fumes, or hose stretched across the lawn — just a clean, discreet detail in your own driveway, done the way a neighborhood like Coral Gables expects.",
  },
  {
    slug: 'doral',
    name: 'Doral',
    county: { slug: 'miami-dade', name: 'Miami-Dade County' },
    metaTitle: 'Mobile Car Detailing in Doral, FL',
    metaDescription:
      'Mobile car detailing in Doral, FL. We come to your driveway or office across Downtown Doral, Doral Isles, Costa Doral, and more — same-day appointments when available.',
    heroIntro:
      "Doral's newer subdivisions and business parks mean wide driveways and plenty of covered parking — a great match for mobile detailing. Whether your car sits in a Downtown Doral driveway or an office garage near one of the business parks, we bring the full setup to you.",
    neighborhoods: [
      'Downtown Doral', 'Doral Isles', 'Costa Doral', 'Doral Pointe',
      'Doral Business Park Area', 'Doral Golf Course Area',
    ],
    angleTitle: "Built for Doral's Driveways and Office Parks",
    angleBody:
      "A lot of Doral's growth is newer construction with real driveways and garage space, unlike the street parking common closer to downtown Miami — which makes it one of the easiest areas for us to work in. We also detail company vehicles and fleet cars on-site at Doral's business parks.",
  },
  {
    slug: 'aventura',
    name: 'Aventura',
    county: { slug: 'miami-dade', name: 'Miami-Dade County' },
    metaTitle: 'Mobile Car Detailing in Aventura, FL',
    metaDescription:
      'Mobile car detailing in Aventura, FL. We come to your high-rise garage or marina parking across Aventura — no hookup needed, same-day appointments when available.',
    heroIntro:
      "Aventura is high-rise condo and marina living — which usually means covered garage parking, not a driveway with a hose. That's exactly the setup our mobile service is built for: we bring our own water and run equipment off a battery station, so a parking garage near the mall or a marina lot works just fine.",
    neighborhoods: [
      'Aventura Marina District', 'Turnberry Area', 'Williams Island', 'Biscayne Cove',
    ],
    angleTitle: 'Built for High-Rise Garage Parking',
    angleBody:
      "No outdoor spigot in a covered garage isn't a problem for us — it's the norm we're built around. We regularly detail vehicles for Aventura's high-rise residents without ever needing an outdoor hookup or bothering neighbors with noise or fumes.",
  },
  {
    slug: 'west-palm-beach',
    name: 'West Palm Beach',
    county: { slug: 'palm-beach', name: 'Palm Beach County' },
    metaTitle: 'Mobile Car Detailing in West Palm Beach, FL',
    metaDescription:
      'Mobile car detailing in West Palm Beach, FL. We come to your home or condo across Downtown, El Cid, Flamingo Park, Northwood, and more.',
    heroIntro:
      "West Palm Beach's mix of downtown condos and historic waterfront neighborhoods means every car's parking situation looks a little different — and our mobile setup is built to handle all of it, from a Clematis Street garage to a driveway in El Cid, without needing a single hookup from you.",
    neighborhoods: [
      'Downtown / Clematis District', 'El Cid', 'SoSo', 'Flamingo Park',
      'Northwood', 'CityPlace / Rosemary District',
    ],
    angleTitle: 'From Downtown Condos to Historic Driveways',
    angleBody:
      "Whether you're in a high-rise near Clematis Street or a historic home in El Cid or Flamingo Park, we bring the same full setup — our own water, battery-powered equipment, and no need for you to be home the entire time.",
  },
]

export function getCityBySlug(slug: string): CityData | undefined {
  return cities.find((c) => c.slug === slug)
}
