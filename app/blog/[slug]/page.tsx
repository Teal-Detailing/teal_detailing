import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getPostBySlug, getPostSlugs, getRelatedPosts, formatPostDate, categories } from '@/lib/blog'
import { servicesData } from '@/lib/services'
import { getCityBySlug } from '@/lib/cities'
import PostBody from '@/components/blog/PostBody'
import { PHONE_DISPLAY, PHONE_HREF } from '@/lib/constants'

const SITE = 'https://tealdetailing.com'

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPostBySlug(params.slug)
  if (!post) return {}

  const url = `${SITE}/blog/${post.slug}`
  const image = post.image ?? '/images/icons/logo-1024.webp'

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.keywords,
    authors: [{ name: post.author }],
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title: `${post.title} | Teal Detailing`,
      description: post.excerpt,
      url,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      authors: [post.author],
      images: [{ url: image, alt: post.imageAlt ?? post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [image],
    },
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)
  if (!post) notFound()

  const url = `${SITE}/blog/${post.slug}`
  const related = getRelatedPosts(post)
  const linkedServices = (post.relatedServices ?? []).map((slug) => ({
    slug,
    name: servicesData[slug].name,
  }))
  const linkedCities = (post.relatedCities ?? [])
    .map((slug) => getCityBySlug(slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))

  const schema: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE}/blog` },
        { '@type': 'ListItem', position: 3, name: post.title, item: url },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      dateModified: post.updated ?? post.date,
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      url,
      image: `${SITE}${post.image ?? '/images/icons/logo-1024.webp'}`,
      author: { '@type': 'Organization', name: post.author, url: SITE },
      publisher: {
        '@type': 'Organization',
        '@id': `${SITE}/#business`,
        name: 'Teal Detailing',
        logo: { '@type': 'ImageObject', url: `${SITE}/images/icons/logo-512.webp` },
      },
      wordCount: post.content.trim().split(/\s+/).length,
      keywords: (post.keywords ?? []).join(', '),
      about: linkedServices.map((s) => ({ '@type': 'Service', name: s.name })),
    },
  ]

  // A FAQPage block only earns rich results when the answers actually appear
  // on the page, so this is emitted in lockstep with the rendered FAQ below.
  if (post.faqs?.length) {
    schema.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: post.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: { '@type': 'Answer', text: faq.a },
      })),
    })
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <article>
        <header className="bg-hero-gradient pt-32 pb-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-sm text-slate-400">
                <li><Link href="/" className="hover:text-teal-400">Home</Link></li>
                <li aria-hidden="true">/</li>
                <li><Link href="/blog" className="hover:text-teal-400">Blog</Link></li>
              </ol>
            </nav>

            <p className="text-xs font-semibold uppercase tracking-widest text-teal-400 mb-4">
              {categories[post.category]}
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-5">
              {post.title}
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed mb-6">{post.excerpt}</p>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-400">
              <span className="text-slate-300">{post.author}</span>
              <span aria-hidden="true">·</span>
              <time dateTime={post.date}>{formatPostDate(post.date)}</time>
              <span aria-hidden="true">·</span>
              <span>{post.readingMinutes} min read</span>
              {post.updated ? (
                <>
                  <span aria-hidden="true">·</span>
                  <span>Updated {formatPostDate(post.updated)}</span>
                </>
              ) : null}
            </div>
          </div>
        </header>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {post.image ? (
            // A fixed frame, since case-study photos come straight off a phone
            // and are usually portrait - uncropped they'd push the post a full
            // screen down.
            <div className="relative aspect-[16/10] mb-12 rounded-2xl overflow-hidden shadow-card bg-slate-100">
              <Image
                src={post.image}
                alt={post.imageAlt ?? post.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          ) : null}

          <PostBody source={post.content} />

          {post.faqs?.length ? (
            <section className="mt-16 pt-12 border-t border-slate-200">
              <h2 className="text-2xl font-bold tracking-tight mb-8">
                Frequently asked questions
              </h2>
              <dl className="space-y-6">
                {post.faqs.map((faq) => (
                  <div key={faq.q} className="bg-slate-50 rounded-xl p-6">
                    <dt className="font-semibold text-slate-900 mb-2">{faq.q}</dt>
                    <dd className="text-slate-600 leading-relaxed">{faq.a}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}

          {linkedServices.length || linkedCities.length ? (
            <section className="mt-16 pt-12 border-t border-slate-200">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500 mb-5">
                Related from Teal Detailing
              </h2>
              <div className="flex flex-wrap gap-2.5">
                {linkedServices.map((service) => (
                  <Link
                    key={service.slug}
                    href={`/services/${service.slug}`}
                    className="px-4 py-2 rounded-lg bg-teal-50 text-teal-800 text-sm font-medium border border-teal-200 hover:bg-teal-100 transition-colors"
                  >
                    {service.name}
                  </Link>
                ))}
                {linkedCities.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/${city.slug}/mobile-car-detailing`}
                    className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium border border-slate-200 hover:bg-slate-200 transition-colors"
                  >
                    Detailing in {city.name}
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          <section className="mt-16 rounded-2xl bg-hero-gradient p-8 sm:p-10 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Want this done for you?
            </h2>
            <p className="text-slate-300 leading-relaxed mb-7 max-w-lg mx-auto">
              We bring everything to your home or office across Miami-Dade, Broward, and Palm
              Beach — water and power included.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-semibold transition-all hover:shadow-glow"
              >
                Get a Free Quote
              </Link>
              <a
                href={PHONE_HREF}
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/10 transition-colors"
              >
                Call {PHONE_DISPLAY}
              </a>
            </div>
          </section>

          {related.length ? (
            <section className="mt-16 pt-12 border-t border-slate-200">
              <h2 className="text-2xl font-bold tracking-tight mb-6">Keep reading</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                {related.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/blog/${item.slug}`}
                    className="block p-5 rounded-xl border border-slate-200 hover:border-teal-300 hover:shadow-card transition-all"
                  >
                    <p className="text-xs font-semibold uppercase tracking-widest text-teal-700 mb-2">
                      {categories[item.category]}
                    </p>
                    <h3 className="font-semibold text-slate-900 leading-snug mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">{item.excerpt}</p>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </article>
    </>
  )
}
