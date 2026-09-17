import { getAllPosts } from '@/lib/blog'

const SITE = 'https://tealdetailing.com'

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// A feed is cheap to serve and is how aggregators, newsletter tools, and
// other writers pick posts up without us pitching them one at a time.
export function GET(): Response {
  const posts = getAllPosts()
  const updated = posts[0] ? new Date(posts[0].date) : new Date()

  const items = posts
    .map(
      (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE}/blog/${post.slug}</link>
      <guid isPermaLink="true">${SITE}/blog/${post.slug}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    </item>`
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Teal Detailing Blog</title>
    <link>${SITE}/blog</link>
    <description>Car care guides and detailing insight from South Florida.</description>
    <language>en-us</language>
    <lastBuildDate>${updated.toUTCString()}</lastBuildDate>
    <atom:link href="${SITE}/blog/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
