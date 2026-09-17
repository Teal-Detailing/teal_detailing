import type { MetadataRoute } from 'next'
import { serviceSlugs } from '@/lib/services'
import { cities } from '@/lib/cities'
import { getAllPosts } from '@/lib/blog'

const SITE = 'https://tealdetailing.com'

const counties = ['miami-dade', 'broward', 'palm-beach']

// Replaces the hand-maintained public/sitemap.xml. Everything here is derived
// from the same data the pages render from, so a new service, city, or blog
// post shows up in the sitemap on the next build instead of waiting for
// someone to remember to add it.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, changeFrequency: 'weekly', priority: 1.0, lastModified: now },
    { url: `${SITE}/services`, changeFrequency: 'weekly', priority: 0.9, lastModified: now },
    { url: `${SITE}/blog`, changeFrequency: 'weekly', priority: 0.8, lastModified: now },
    { url: `${SITE}/gallery`, changeFrequency: 'monthly', priority: 0.8, lastModified: now },
    { url: `${SITE}/about`, changeFrequency: 'monthly', priority: 0.7, lastModified: now },
    { url: `${SITE}/contact`, changeFrequency: 'monthly', priority: 0.7, lastModified: now },
  ]

  const countyPages: MetadataRoute.Sitemap = counties.map((county) => ({
    url: `${SITE}/${county}`,
    changeFrequency: 'monthly',
    priority: 0.8,
    lastModified: now,
  }))

  const servicePages: MetadataRoute.Sitemap = serviceSlugs.map((slug) => ({
    url: `${SITE}/services/${slug}`,
    changeFrequency: 'monthly',
    priority: 0.8,
    lastModified: now,
  }))

  const countyServicePages: MetadataRoute.Sitemap = counties.flatMap((county) =>
    serviceSlugs.map((slug) => ({
      url: `${SITE}/${county}/${slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      lastModified: now,
    }))
  )

  const cityPages: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${SITE}/${city.slug}/mobile-car-detailing`,
    changeFrequency: 'monthly',
    priority: 0.7,
    lastModified: now,
  }))

  // Posts carry their real publish/update date rather than the build date -
  // an honest lastmod is what makes recrawl scheduling work in our favour.
  const blogPages: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${SITE}/blog/${post.slug}`,
    changeFrequency: 'monthly',
    priority: 0.6,
    lastModified: new Date(post.updated ?? post.date),
  }))

  return [
    ...staticPages,
    ...countyPages,
    ...servicePages,
    ...countyServicePages,
    ...cityPages,
    ...blogPages,
  ]
}
