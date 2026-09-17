import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getAllPosts, formatPostDate, categories } from '@/lib/blog'

const SITE = 'https://tealdetailing.com'

export const metadata: Metadata = {
  title: 'Car Detailing Guides & South Florida Car Care',
  description:
    'Practical car care advice from a working South Florida detailing crew — salt air, sun damage, interior wear, and what actually keeps a car looking new down here.',
  alternates: {
    canonical: `${SITE}/blog`,
    types: { 'application/rss+xml': `${SITE}/blog/rss.xml` },
  },
  openGraph: {
    type: 'website',
    title: 'Car Detailing Guides & South Florida Car Care | Teal Detailing',
    description:
      'Practical car care advice from a working South Florida detailing crew.',
    url: `${SITE}/blog`,
  },
}

export default function BlogIndexPage() {
  const posts = getAllPosts()
  const [featured, ...rest] = posts

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'Blog',
              name: 'Teal Detailing Blog',
              description:
                'Car care guides and detailing insight from South Florida.',
              url: `${SITE}/blog`,
              publisher: {
                '@type': 'Organization',
                '@id': `${SITE}/#business`,
                name: 'Teal Detailing',
              },
              blogPost: posts.slice(0, 10).map((post) => ({
                '@type': 'BlogPosting',
                headline: post.title,
                url: `${SITE}/blog/${post.slug}`,
                datePublished: post.date,
              })),
            },
            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
                { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE}/blog` },
              ],
            },
          ]),
        }}
      />

      <section className="bg-hero-gradient pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-400 mb-4">
            Teal Detailing
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-5">
            Car Care, South Florida Edition
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Salt air, relentless sun, and afternoon downpours do things to a car that generic
            advice never accounts for. Here&apos;s what we see on real vehicles, every week.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        {posts.length === 0 ? (
          <p className="text-center text-slate-500 py-12">
            New articles are on the way — check back soon.
          </p>
        ) : (
          <>
            <Link
              href={`/blog/${featured.slug}`}
              className="group block rounded-2xl border border-slate-200 overflow-hidden hover:border-teal-300 hover:shadow-card-hover transition-all mb-14"
            >
              <div className="grid md:grid-cols-2">
                {featured.image ? (
                  <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[300px] bg-slate-100">
                    <Image
                      src={featured.image}
                      alt={featured.imageAlt ?? featured.title}
                      fill
                      priority
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                ) : null}
                <div className="p-7 sm:p-9 flex flex-col justify-center">
                  <p className="text-xs font-semibold uppercase tracking-widest text-teal-700 mb-3">
                    {categories[featured.category]}
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-snug mb-3 group-hover:text-teal-800 transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-slate-600 leading-relaxed mb-5">{featured.excerpt}</p>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <time dateTime={featured.date}>{formatPostDate(featured.date)}</time>
                    <span aria-hidden="true">·</span>
                    <span>{featured.readingMinutes} min read</span>
                  </div>
                </div>
              </div>
            </Link>

            {rest.length ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col rounded-2xl border border-slate-200 overflow-hidden hover:border-teal-300 hover:shadow-card transition-all"
                  >
                    {post.image ? (
                      <div className="relative aspect-[16/10] bg-slate-100">
                        <Image
                          src={post.image}
                          alt={post.imageAlt ?? post.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                    ) : null}
                    <div className="p-6 flex flex-col flex-1">
                      <p className="text-xs font-semibold uppercase tracking-widest text-teal-700 mb-2.5">
                        {categories[post.category]}
                      </p>
                      <h2 className="font-bold text-lg leading-snug mb-2.5 group-hover:text-teal-800 transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-sm text-slate-600 leading-relaxed mb-5 flex-1">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                        <span aria-hidden="true">·</span>
                        <span>{post.readingMinutes} min read</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : null}
          </>
        )}
      </div>
    </>
  )
}
