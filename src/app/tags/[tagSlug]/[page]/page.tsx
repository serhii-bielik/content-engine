import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getTagBySlug } from '@/lib/queries'
import { TagPageContent } from '@/components/widgets/TagPageContent'

type Props = {
  params: Promise<{ tagSlug: string; page: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tagSlug, page } = await params
  const tag = await getTagBySlug(tagSlug)
  if (!tag) return {}
  return {
    title: `#${tag.title} — страница ${page}`,
  }
}

export default async function TagPageN({ params }: Props) {
  const { tagSlug, page: pageParam } = await params
  const page = parseInt(pageParam)
  if (isNaN(page) || page <= 1 || page > 50) notFound()
  return <TagPageContent tagSlug={tagSlug} page={page} />
}
