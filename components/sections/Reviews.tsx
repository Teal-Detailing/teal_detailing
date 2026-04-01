const reviews = [
  {
    name: 'Marcus T.',
    location: 'Miami, FL',
    stars: 5,
    text: 'Teal Detailing completely transformed my car. The ceramic coating looks incredible and their team was professional from start to finish.',
  },
  {
    name: 'Daniela R.',
    location: 'Coral Gables, FL',
    stars: 5,
    text: 'I had pet hair removal done and honestly couldn\'t believe the results. My seats look brand new. Will 100% be back.',
  },
  {
    name: 'James W.',
    location: 'Brickell, FL',
    stars: 5,
    text: 'Booked mobile detailing and they showed up on time, were super thorough, and my car has never looked this clean.',
  },
  {
    name: 'Sofia M.',
    location: 'Doral, FL',
    stars: 5,
    text: 'The paint correction made my older car look like it just came off the lot. Highly recommend the Gold package.',
  },
  {
    name: 'Carlos B.',
    location: 'Hialeah, FL',
    stars: 5,
    text: 'Fast response, great communication, and excellent work. The headlight restoration alone was worth every penny.',
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
    <section className="py-20 bg-white" aria-labelledby="reviews-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-500 mb-3">
            Client Reviews
          </p>
          <h2 id="reviews-heading" className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            What Our Clients Say
          </h2>
          <p className="mt-3 text-slate-500 max-w-xl mx-auto text-base leading-relaxed">
            Trusted by hundreds of South Florida drivers
          </p>
        </div>

        {/* Cards — horizontal scroll on mobile, 3-col on desktop */}
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0">
          {reviews.map((r) => (
            <article
              key={r.name}
              className="flex-shrink-0 w-[80vw] sm:w-[60vw] lg:w-auto snap-start bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-card-hover transition-shadow p-6 flex flex-col gap-4"
            >
              {/* Quote mark */}
              <div className="text-4xl font-serif text-teal-100 leading-none select-none">
                &ldquo;
              </div>
              <p className="text-slate-700 text-sm leading-relaxed -mt-3">
                {r.text}
              </p>
              <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{r.name}</p>
                  <p className="text-xs text-slate-400">{r.location}</p>
                </div>
                <StarRating count={r.stars} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
