import { notFound } from 'next/navigation'
import { getTagBySlug, getMaterialsByTag } from '@/lib/queries'
import { MaterialsTable } from './MaterialsTable'
import { Pagination } from './Pagination'

type Props = {
  tagSlug: string
  page: number
}

export async function TagPageContent({ tagSlug, page }: Props) {
  const tag = await getTagBySlug(tagSlug)
  if (!tag) notFound()

  const result = await getMaterialsByTag({ tagId: tag.id, page })

  if (page > 1 && result.items.length === 0) notFound()

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <p className="text-sm text-muted-foreground mb-1">Тег</p>
        <h1 className="text-2xl font-bold">#{tag.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {page > 1 ? `Страница ${page} · ` : ''}
          Материалов: {result.total}
        </p>
      </div>

      <MaterialsTable materials={result.items} />

      <Pagination
        page={page}
        totalPages={result.totalPages}
        basePath={`/tags/${tagSlug}`}
      />
    </div>
  )
}
