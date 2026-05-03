import { notFound } from 'next/navigation'
import { getCategoryBySlug, getMaterialsByCategory } from '@/lib/queries'
import { getCachedPopularInCategory } from '@/lib/cached-queries'
import { MaterialsTable } from './MaterialsTable'
import { PopularList } from './PopularList'
import { Pagination } from './Pagination'

type Props = {
  categorySlug: string
  page: number
}

export async function CategoryPageContent({ categorySlug, page }: Props) {
  const category = await getCategoryBySlug(categorySlug)
  if (!category) notFound()

  const [result, popular] = await Promise.all([
    getMaterialsByCategory({ categoryId: category.id, page }),
    getCachedPopularInCategory(category.id),
  ])

  if (page > 1 && result.items.length === 0) notFound()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{category.title}</h1>
          {category.description && (
            <p className="text-muted-foreground mt-1">{category.description}</p>
          )}
          <p className="text-sm text-muted-foreground mt-1">
            {page > 1 ? `Страница ${page} из ${result.totalPages} · ` : ''}
            Всего материалов: {result.total}
          </p>
        </div>
        <MaterialsTable materials={result.items} />
        <Pagination
          page={page}
          totalPages={result.totalPages}
          basePath={`/${categorySlug}`}
        />
      </div>
      <aside>
        <PopularList
          items={popular}
          title={`Популярное в «${category.title}»`}
        />
      </aside>
    </div>
  )
}
