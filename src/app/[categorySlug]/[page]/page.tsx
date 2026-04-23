import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getCategoryBySlug } from '@/lib/queries'
import { CategoryPageContent } from '@/components/widgets/CategoryPageContent'

type Props = {
  params: Promise<{ categorySlug: string; page: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug, page } = await params
  const category = await getCategoryBySlug(categorySlug)
  if (!category) return {}
  return {
    title: `${category.title} — страница ${page}`,
    description: category.description ?? undefined,
  }
}

export default async function CategoryPageN({ params }: Props) {
  const { categorySlug, page: pageParam } = await params
  const page = parseInt(pageParam)

  if (isNaN(page) || page <= 1 || page > 50) notFound()

  return <CategoryPageContent categorySlug={categorySlug} page={page} />
}
