import { Suspense } from 'react'
import {
  getPopularMaterials,
  getPopularThisMonth,
  getPopularTags,
} from '@/lib/queries'
import { MaterialCard } from '@/components/widgets/MaterialCard'
import { PopularList } from '@/components/widgets/PopularList'
import { TagCloud } from '@/components/widgets/TagCloud'
import { SearchForm } from '@/components/layout/SearchForm'
import { Skeleton } from '@/components/ui/skeleton'

export default async function HomePage() {
  const [popular, thisMonth, tags] = await Promise.all([
    getPopularMaterials(6),
    getPopularThisMonth(10),
    getPopularTags(30),
  ])

  return (
    <div className="space-y-12">
      {/* Hero поиск */}
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">ContentEngine</h1>
        <p className="text-muted-foreground mb-8">
          Лучшие материалы по технологиям, науке и культуре
        </p>
        <div className="max-w-lg mx-auto">
          <SearchForm large />
        </div>
      </section>

      {/* Основной контент + сайдбар */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Популярные материалы */}
        <section className="lg:col-span-2">
          <h2 className="font-semibold text-lg mb-4">Популярные материалы</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {popular.map((material) => (
              <MaterialCard key={material.id} material={material} />
            ))}
          </div>
        </section>

        {/* Сайдбар */}
        <aside className="space-y-8">
          <PopularList items={thisMonth} title="Популярное в этом месяце" />
        </aside>
      </div>

      {/* Облако тегов */}
      {tags.length > 0 && (
        <section>
          <h2 className="font-semibold text-lg mb-4">Теги</h2>
          <TagCloud tags={tags} />
        </section>
      )}
    </div>
  )
}
