import type { Metadata } from 'next'
import { getCategoryBySlug } from '@/lib/queries'
import { CategoryPageContent } from '@/components/widgets/CategoryPageContent'

type Props = {
  params: Promise<{ categorySlug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug } = await params
  const category = await getCategoryBySlug(categorySlug)
  if (!category) return {}
  return {
    title: category.title,
    description: category.description ?? undefined,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { categorySlug } = await params
  return <CategoryPageContent categorySlug={categorySlug} page={1} />
}
