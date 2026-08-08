export interface Review {
  name: string
  location: string
  stars: number
  text: string
  avatar?: string
}

export const reviews: Review[] = [
  {
    name: 'Jose M.',
    location: 'Hallandale, FL',
    stars: 5,
    text: 'Outstanding service from start to finish. Booking was quick and easy, communication was fast, and the whole experience was seamless. Super friendly, professional, and very fairly priced.\n\nMost importantly, the car looked incredible — excellent attention to detail and a truly thorough job. You can tell they take pride in their work.\n\nI\'ll definitely be booking regularly and highly recommend this mobile car wash to anyone looking for convenience and top-quality results.',
    avatar: '/reviews/jose-m.png',
  },
  {
    name: 'Damion',
    location: 'Pembroke Pines, FL',
    stars: 5,
    text: 'Teal Detailing Miami did a fantastic job. They showed up right on time at my location and got straight to work. The interior was cleaned perfectly; seats, dashboard, and everything in between. My car was left absolutely spotless. Professional, convenient, and high-quality work. Highly recommend!',
  },
  {
    name: 'Ariane B.',
    location: 'Miami, FL',
    stars: 5,
    text: 'Had my first experience with Teal Detailing today. Great experience, great customer service and detailing with their Gold Package!!! My car looks and smells great. They definitely earned a call back.',
  },
  {
    name: 'Chris B.',
    location: 'Lauderdale Lakes, FL',
    stars: 5,
    text: 'One guy. One guy is all it took and my car looks amazing from inside and out. I\'ve had people come out with 2-3 guys and it has never looked or felt this clean before. I\'m 100% pleased. I had the silver package and it looks this great, so imagine what the gold package looks like. The price was definitely worth it and I\'ll definitely be using Teal Detailing again.',
  },
  {
    name: 'Erik G.',
    location: 'Miami, FL',
    stars: 5,
    text: 'I reached out to Teal Detailing and it was my 2nd time. They absolutely do a wonderful job and take their time cleaning and detailing the car. I would totally recommend them. 👍',
  },
]
