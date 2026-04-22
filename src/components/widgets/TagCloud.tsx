import Link from 'next/link'

type Props = {
  tags: { id: number; slug: string; title: string; materialsCount: number }[]
}

export function TagCloud({ tags }: Props) {
  const maxCount = Math.max(...tags.map((t) => t.materialsCount))

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Link
          key={tag.id}
          href={`/tags/${tag.slug}`}
          className="px-2 py-1 rounded bg-accent hover:bg-accent/80 transition-colors"
          style={{
            fontSize: `${Math.max(0.75, Math.min(1.1, 0.75 + (tag.materialsCount / maxCount) * 0.35))}rem`,
          }}
        >
          {tag.title}
        </Link>
      ))}
    </div>
  )
}
