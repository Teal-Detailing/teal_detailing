import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { servicesData, type ServiceSlug } from '@/lib/services'
import { getCityBySlug } from '@/lib/cities'

export const BLOG_DIR = path.join(process.cwd(), 'content/blog')

export const categories = {
  guide: 'Guides',
  'case-study': 'Our Work',
  local: 'South Florida',
} as const

export type BlogCategory = keyof typeof categories

export interface BlogFaq {
  q: string
  a: string
}

// The shape every post's frontmatter must satisfy. This doubles as the
// contract the post-writing agent generates against, so the fields are
// deliberately explicit - relatedServices/relatedCities exist so each post
// links back into the money pages rather than dead-ending.
export interface PostFrontmatter {
  title: string
  date: string
  updated?: string
  excerpt: string
  category: BlogCategory
  author: string
  image?: string
  imageAlt?: string
  relatedServices?: ServiceSlug[]
  relatedCities?: string[]
  keywords?: string[]
  faqs?: BlogFaq[]
  draft?: boolean
  // Hash of the completed-job ID a case study was written from. Hashed
  // because the repo is public and the raw ID is internal; the content agent
  // only needs it to avoid writing about the same job twice.
  sourceJob?: string
}

export interface Post extends PostFrontmatter {
  slug: string
  content: string
  readingMinutes: number
}

export interface PostSummary extends Omit<Post, 'content'> {}

const REQUIRED_FIELDS: (keyof PostFrontmatter)[] = [
  'title', 'date', 'excerpt', 'category', 'author',
]

// Posts are written by an agent, so a malformed file is a question of when,
// not if. Failing the build with the offending filename beats silently
// shipping a post with no title or a category that renders nowhere.
export function validateFrontmatter(slug: string, data: Record<string, unknown>): PostFrontmatter {
  for (const field of REQUIRED_FIELDS) {
    if (!data[field]) {
      throw new Error(`Blog post "${slug}" is missing required frontmatter: ${field}`)
    }
  }

  const category = data.category as string
  if (!(category in categories)) {
    throw new Error(
      `Blog post "${slug}" has unknown category "${category}". ` +
      `Expected one of: ${Object.keys(categories).join(', ')}`
    )
  }

  if (Number.isNaN(Date.parse(data.date as string))) {
    throw new Error(`Blog post "${slug}" has an unparseable date: ${data.date}`)
  }

  for (const service of (data.relatedServices as string[]) ?? []) {
    if (!(service in servicesData)) {
      throw new Error(`Blog post "${slug}" references unknown service "${service}"`)
    }
  }

  for (const city of (data.relatedCities as string[]) ?? []) {
    if (!getCityBySlug(city)) {
      throw new Error(`Blog post "${slug}" references unknown city "${city}"`)
    }
  }

  return data as unknown as PostFrontmatter
}

function readPost(fileName: string): Post {
  const slug = fileName.replace(/\.mdx?$/, '')
  const raw = fs.readFileSync(path.join(BLOG_DIR, fileName), 'utf8')
  const { data, content } = matter(raw)
  const frontmatter = validateFrontmatter(slug, data)

  const words = content.trim().split(/\s+/).length

  return {
    ...frontmatter,
    slug,
    content,
    readingMinutes: Math.max(1, Math.round(words / 225)),
  }
}

function postFiles(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return []
  return fs.readdirSync(BLOG_DIR).filter((f) => /\.mdx?$/.test(f))
}

// Drafts stay out of production entirely but render locally, so a post the
// agent has opened a PR for can be previewed on a branch deploy before it
// is ever indexable.
function isVisible(post: Post): boolean {
  return !post.draft || process.env.NODE_ENV === 'development'
}

export function getAllPosts(): PostSummary[] {
  return postFiles()
    .map(readPost)
    .filter(isVisible)
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
    .map(({ content, ...summary }) => summary)
}

export function getPostSlugs(): string[] {
  return postFiles().map(readPost).filter(isVisible).map((p) => p.slug)
}

export function getPostBySlug(slug: string): Post | undefined {
  const file = postFiles().find((f) => f.replace(/\.mdx?$/, '') === slug)
  if (!file) return undefined
  const post = readPost(file)
  return isVisible(post) ? post : undefined
}

export function getPostsByCategory(category: BlogCategory): PostSummary[] {
  return getAllPosts().filter((p) => p.category === category)
}

// Prefers posts sharing a service, then a city, then falls back to recency -
// so a related-posts rail is never empty on a thin blog.
export function getRelatedPosts(post: Post, limit = 3): PostSummary[] {
  const others = getAllPosts().filter((p) => p.slug !== post.slug)

  const score = (candidate: PostSummary) => {
    const services = new Set(post.relatedServices ?? [])
    const cities = new Set(post.relatedCities ?? [])
    let points = 0
    for (const s of candidate.relatedServices ?? []) if (services.has(s)) points += 3
    for (const c of candidate.relatedCities ?? []) if (cities.has(c)) points += 2
    if (candidate.category === post.category) points += 1
    return points
  }

  return others
    .map((p) => ({ post: p, points: score(p) }))
    .sort((a, b) => b.points - a.points || Date.parse(b.post.date) - Date.parse(a.post.date))
    .slice(0, limit)
    .map(({ post: p }) => p)
}

export function formatPostDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
  })
}
