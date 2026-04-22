import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Eye, ThumbsUp } from 'lucide-react'

type Props = {
  material: {
    id: number
    slug: string
    title: string
    description?: string
    image?: string | null
    views: number
    rating: number
    createdAt: Date
    category?: { slug: string; title: string }
    tags?: { tag: { slug: string; title: string } }[]
  }
  showImage?: boolean
}

export function MaterialCard({ material, showImage = true }: Props) {
  return (
    <Link href={`/details/${material.slug}`} className="group block">
      <div className="border rounded-lg overflow-hidden hover:border-foreground/30 transition-colors">
        {showImage && material.image && (
          <div className="relative aspect-video bg-muted">
            <Image
              src={material.image}
              alt={material.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="p-4">
          {material.category && (
            <Link
              href={`/${material.category.slug}`}
              className="text-xs text-muted-foreground hover:text-foreground mb-2 block"
            >
              {material.category.title}
            </Link>
          )}
          <h3 className="font-semibold group-hover:underline line-clamp-2 mb-2">
            {material.title}
          </h3>
          {material.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {material.description}
            </p>
          )}
          {material.tags && material.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {material.tags.slice(0, 3).map(({ tag }) => (
                <Badge key={tag.slug} variant="secondary" className="text-xs">
                  {tag.title}
                </Badge>
              ))}
            </div>
          )}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye size={12} /> {material.views.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <ThumbsUp size={12} /> {material.rating}
            </span>
            <span className="ml-auto">
              {new Date(material.createdAt).toLocaleDateString('ru-RU')}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
