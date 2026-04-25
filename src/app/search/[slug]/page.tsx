import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  searchMaterials,
  getAllCategories,
  saveSearchQuery,
} from '@/lib/queries'
import { MaterialsTable } from '@/components/widgets/MaterialsTable'
import { Pagination } from '@/components/widgets/Pagination'
import { CategoryFilter } from '@/components/widgets/CategoryFilter'

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ q?: string; category?: string; page?: string }>
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { q } = await searchParams
  return {
    title: q ? `Поиск: ${q}` : 'Поиск',
  }
}

export default async function SearchPage({ params, searchParams }: Props) {
  const { q, category, page: pageParam } = await searchParams
  const query = q?.trim() ?? ''
  const page = Math.max(1, parseInt(pageParam ?? '1'))
  const categoryId = category ? parseInt(category) : undefined

  if (!query) notFound()

  // Сохраняем запрос и ищем параллельно
  const [result, categories] = await Promise.all([
    searchMaterials({ query, categoryId, page }),
    getAllCategories(),
    saveSearchQuery(query),
  ])

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Результаты поиска:{' '}
          <span className="text-muted-foreground">{query}</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Найдено материалов: {result.total}
        </p>
      </div>

      <CategoryFilter categories={categories} currentCategoryId={categoryId} />

      <MaterialsTable materials={result.items} />

      <Pagination
        page={page}
        totalPages={result.totalPages}
        basePath={`/search/${(await params).slug}`}
      />
    </div>
  )
}
