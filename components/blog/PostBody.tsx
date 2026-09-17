import Link from 'next/link'
import Image from 'next/image'
import { MDXRemote } from 'next-mdx-remote/rsc'
import type { MDXComponents } from 'mdx/types'
import remarkGfm from 'remark-gfm'

// Internal links go through next/link so a reader moving from a post into a
// service or city page gets a client transition instead of a full reload;
// outbound links get the usual safety rel.
function Anchor({ href = '', children, ...rest }: React.ComponentPropsWithoutRef<'a'>) {
  const isInternal = href.startsWith('/') || href.startsWith('#')

  if (isInternal) {
    return (
      <Link href={href} className="text-teal-700 font-medium underline underline-offset-2 hover:text-teal-600">
        {children}
      </Link>
    )
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-teal-700 font-medium underline underline-offset-2 hover:text-teal-600"
      {...rest}
    >
      {children}
    </a>
  )
}

function PostImage({ src = '', alt = '' }: React.ComponentPropsWithoutRef<'img'>) {
  return (
    <span className="block my-8">
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={800}
        className="rounded-2xl w-full h-auto shadow-card"
        sizes="(max-width: 768px) 100vw, 768px"
      />
      {alt ? (
        <span className="block text-center text-sm text-slate-500 mt-3">{alt}</span>
      ) : null}
    </span>
  )
}

const components: MDXComponents = {
  a: Anchor,
  img: PostImage,
}

export default function PostBody({ source }: { source: string }) {
  return (
    <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-p:leading-relaxed prose-li:leading-relaxed prose-strong:text-slate-900 prose-blockquote:border-l-teal-500 prose-blockquote:not-italic prose-table:text-sm">
      <MDXRemote
        source={source}
        components={components}
        options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
      />
    </div>
  )
}
