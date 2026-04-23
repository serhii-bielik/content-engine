import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Eye, ThumbsUp } from 'lucide-react'

type Material = {
  id: number
  slug: string
  title: string
  description: string
  views: number
  rating: number
  createdAt: Date
  category?: { slug: string; title: string }
  tags?: { tag: { slug: string; title: string } }[]
}

type Props = {
  materials: Material[]
}

export function MaterialsTable({ materials }: Props) {
  if (materials.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Материалы не найдены
      </div>
    )
  }

  return (
    <div className="flex flex-col divide-y">
      {materials.map((material) => (
        <div key={material.id} className="py-4 flex gap-4">
          <div className="flex-1 min-w-0">
            <Link
              href={`/details/${material.slug}`}
              className="font-medium hover:underline line-clamp-2"
            >
              {material.title}
            </Link>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {material.description}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {material.tags?.slice(0, 3).map(({ tag }) => (
                <Badge key={tag.slug} variant="secondary" className="text-xs">
                  <Link href={`/tags/${tag.slug}`}>{tag.title}</Link>
                </Badge>
              ))}
              <span className="text-xs text-muted-foreground ml-auto flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Eye size={12} /> {material.views.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <ThumbsUp size={12} /> {material.rating}
                </span>
                <span>
                  {new Date(material.createdAt).toLocaleDateString('ru-RU')}
                </span>
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
