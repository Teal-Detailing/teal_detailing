import Image from 'next/image'

const reviews = [
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

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.173c.969 0 1.371 1.24.588 1.81l-3.376 2.453a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.376-2.453a1 1 0 00-1.175 0l-3.376 2.453c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.173a1 1 0 00.95-.69l1.288-3.967z" />
        </svg>
      ))}
    </div>
  )
}

export default function Reviews() {
  return (
    <section className="py-20 bg-slate-50" aria-labelledby="reviews-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12">
          <p className="text-[0.9rem] font-semibold uppercase tracking-widest text-teal-700 mb-3">
            Client Reviews
          </p>
          <h2 id="reviews-heading" className="text-[2.16rem] sm:text-[2.88rem] font-extrabold text-slate-900">
            What Our Clients Say
          </h2>
          <p className="mt-3 text-slate-500 max-w-xl mx-auto text-[1.2rem] leading-relaxed">
            A sample of our Google Reviews — and there are many more where these came from!
          </p>
        </div>

        {/* Cards — horizontal scroll on mobile, 3-col on desktop */}
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0">
          {reviews.map((r) => (
            <article
              key={r.name}
              className="flex-shrink-0 w-[80vw] sm:w-[60vw] lg:w-auto snap-start bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-card-hover transition-shadow p-6 flex flex-col gap-4"
            >
              {/* Google logo + quote */}
              <div className="flex items-center justify-between">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-6 h-6 flex-shrink-0">
                  <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.6 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
                  <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19.1 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.6 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
                  <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.3 0-9.7-3.4-11.3-8H6.3C9.7 35.7 16.3 44 24 44z"/>
                  <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.6l6.2 5.2C37 39 44 34 44 24c0-1.3-.1-2.6-.4-3.9z"/>
                </svg>
                <div className="text-4xl font-serif text-teal-100 leading-none select-none">&ldquo;</div>
              </div>
              <div className="flex-1 flex items-center -mt-3">
                <p className="text-slate-700 text-[1.3rem] leading-relaxed whitespace-pre-line">
                  {r.text}
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-teal-500 flex items-center justify-center">
                    {r.avatar ? (
                      <Image src={r.avatar} alt={r.name} width={40} height={40} className="object-cover w-full h-full" />
                    ) : (
                      <span className="text-white font-bold text-[1rem]">{r.name.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-[1.2rem] font-semibold text-slate-900">{r.name}</p>
                    <p className="text-[1.05rem] text-slate-500">{r.location}</p>
                  </div>
                </div>
                <StarRating count={r.stars} />
              </div>
            </article>
          ))}

          {/* See more on Google */}
          <a
            href="https://www.google.com/maps/place/Teal+Detailing+Miami/@25.9339812,-80.1378231,1442m/data=!3m1!1e3!4m8!3m7!1s0x88d9ad5fc13f3c61:0xc5db57643a7c8a00!8m2!3d25.9339812!4d-80.1352482!9m1!1b1!16s%2Fg%2F11yy3gz2s6?entry=ttu&g_ep=EgoyMDI2MDQyMC4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex flex-shrink-0 snap-start rounded-2xl border-2 border-dashed border-slate-200 hover:border-teal-400 transition-colors p-6 flex-col items-center justify-center gap-4 text-center group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-10 h-10">
              <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.6 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19.1 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.6 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.3 0-9.7-3.4-11.3-8H6.3C9.7 35.7 16.3 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.6l6.2 5.2C37 39 44 34 44 24c0-1.3-.1-2.6-.4-3.9z"/>
            </svg>
            <div>
              <p className="text-[1.05rem] font-bold text-slate-900 group-hover:text-teal-600 transition-colors">See All Our Reviews</p>
              <p className="text-[0.9rem] text-slate-500 mt-1">Read more on Google →</p>
            </div>
          </a>
        </div>
      </div>
    </section>
  )
}
