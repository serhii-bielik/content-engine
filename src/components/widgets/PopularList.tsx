import Link from 'next/link'
import { Eye } from 'lucide-react'

type Item = {
  id: number
  slug: string
  title: string
  views: number
  category?: { slug: string; title: string }
}

type Props = {
  items: Item[]
  title: string
}

export function PopularList({ items, title }: Props) {
  return (
    <div>
      <h2 className="font-semibold text-lg mb-4">{title}</h2>
      <div className="flex flex-col gap-2">
        {items.map((item, index) => (
          <div key={item.id} className="flex items-start gap-3">
            <span className="text-2xl font-bold text-muted-foreground/30 w-8 shrink-0">
              {index + 1}
            </span>
            <div className="flex-1 min-w-0">
              <Link
                href={`/details/${item.slug}`}
                className="text-sm font-medium hover:underline line-clamp-2"
              >
                {item.title}
              </Link>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                {item.category && (
                  <Link
                    href={`/${item.category.slug}`}
                    className="hover:underline"
                  >
                    {item.category.title}
                  </Link>
                )}
                <span className="flex items-center gap-1">
                  <Eye size={10} /> {item.views.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
