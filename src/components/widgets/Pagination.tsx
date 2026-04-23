import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Props = {
  page: number
  totalPages: number
  basePath: string
}

export function Pagination({ page, totalPages, basePath }: Props) {
  if (totalPages <= 1) return null

  // Показываем максимум 5 страниц вокруг текущей
  const pages: (number | '...')[] = []
  const delta = 2

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= page - delta && i <= page + delta)
    ) {
      pages.push(i)
    } else if (i === page - delta - 1 || i === page + delta + 1) {
      pages.push('...')
    }
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      {page > 1 && (
        <Button variant="ghost" size="icon" asChild>
          <Link href={page - 1 === 1 ? basePath : `${basePath}/${page - 1}`}>
            <ChevronLeft size={16} />
          </Link>
        </Button>
      )}

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`dots-${i}`} className="px-2 text-muted-foreground">
            ...
          </span>
        ) : (
          <Button
            key={p}
            variant={p === page ? 'default' : 'ghost'}
            size="icon"
            asChild
          >
            <Link href={p === 1 ? basePath : `${basePath}/${p}`}>{p}</Link>
          </Button>
        )
      )}

      {page < totalPages && (
        <Button variant="ghost" size="icon" asChild>
          <Link href={`${basePath}/${page + 1}`}>
            <ChevronRight size={16} />
          </Link>
        </Button>
      )}
    </div>
  )
}
