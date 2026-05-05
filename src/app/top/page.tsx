import type { Metadata } from 'next'
import Link from 'next/link'
import { getTopMaterials } from '@/lib/queries'
import { Eye, ThumbsUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'Топ 100 материалов',
  description: 'Самые популярные материалы по количеству просмотров',
}

export const revalidate = 3600 // ISR — обновлять раз в час

export default async function TopPage() {
  const materials = await getTopMaterials(100)

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Топ 100 материалов</h1>

      <div className="flex flex-col divide-y">
        {materials.map((material, index) => (
          <div key={material.id} className="py-4 flex gap-4 items-start">
            <span className="text-2xl font-bold text-muted-foreground/30 w-12 shrink-0 text-right">
              {index + 1}
            </span>
            <div className="flex-1 min-w-0">
              <Link
                href={`/details/${material.slug}`}
                className="font-medium hover:underline line-clamp-2"
              >
                {material.title}
              </Link>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                {material.category && (
                  <Link
                    href={`/${material.category.slug}`}
                    className="hover:underline"
                  >
                    {material.category.title}
                  </Link>
                )}
                <span className="flex items-center gap-1">
                  <Eye size={10} /> {material.views.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <ThumbsUp size={10} /> {material.rating}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
