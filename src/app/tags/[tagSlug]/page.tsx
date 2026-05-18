import type { Metadata } from 'next'
import { getTagBySlug } from '@/lib/queries'
import { TagPageContent } from '@/components/widgets/TagPageContent'

export const revalidate = 3600

type Props = {
  params: Promise<{ tagSlug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tagSlug } = await params
  const tag = await getTagBySlug(tagSlug)
  if (!tag) return {}
  return {
    title: `#${tag.title}`,
    description: `Материалы по тегу ${tag.title}`,
  }
}

export default async function TagPage({ params }: Props) {
  const { tagSlug } = await params
  return <TagPageContent tagSlug={tagSlug} page={1} />
}
