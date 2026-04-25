'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'

type Category = { id: number; slug: string; title: string }

type Props = {
  categories: Category[]
  currentCategoryId?: number
}

export function CategoryFilter({ categories, currentCategoryId }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function handleSelect(categoryId?: number) {
    const params = new URLSearchParams(searchParams.toString())
    if (categoryId) {
      params.set('category', categoryId.toString())
    } else {
      params.delete('category')
    }
    params.delete('page')
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button
        variant={!currentCategoryId ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleSelect()}
      >
        Все категории
      </Button>
      {categories.map((cat) => (
        <Button
          key={cat.id}
          variant={currentCategoryId === cat.id ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleSelect(cat.id)}
        >
          {cat.title}
        </Button>
      ))}
    </div>
  )
}
