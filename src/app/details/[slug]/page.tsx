import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import {
  getMaterialBySlug,
  getSimilarMaterials,
  getPopularInCategory,
} from '@/lib/queries'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { PopularList } from '@/components/widgets/PopularList'
import { VoteButtons } from '@/components/widgets/VoteButtons'
import { ViewCounter } from '@/components/widgets/ViewCounter'
import { Eye, Calendar, Flag } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const material = await getMaterialBySlug(slug)
  if (!material) return {}

  return {
    title: material.title,
    description: material.description.slice(0, 160),
    openGraph: {
      title: material.title,
      description: material.description.slice(0, 160),
      images: material.image ? [{ url: material.image }] : [],
    },
  }
}

export default async function MaterialPage({ params }: Props) {
  const { slug } = await params
  const material = await getMaterialBySlug(slug)

  if (!material || !material.isPublished) notFound()

  // Материал скрыт из-за жалоб
  if (material.isHidden) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <h1 className="text-2xl font-bold mb-4">Материал недоступен</h1>
        <p className="text-muted-foreground mb-2">
          Этот материал был скрыт после рассмотрения жалобы.
        </p>
        {material.hiddenReason && (
          <p className="text-sm text-muted-foreground border rounded p-3 mt-4">
            Причина: {material.hiddenReason}
          </p>
        )}
        <Link href="/" className="text-blue-500 hover:underline mt-6 block">
          Вернуться на главную
        </Link>
      </div>
    )
  }

  const [similar, popular] = await Promise.all([
    getSimilarMaterials(material.id, material.category.id),
    getPopularInCategory(material.category.id),
  ])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <ViewCounter materialId={material.id} />

      <article className="lg:col-span-2">
        {/* Хлебные крошки */}
        <nav className="text-sm text-muted-foreground mb-4 flex items-center gap-2">
          <Link href="/" className="hover:underline">
            Главная
          </Link>
          <span>/</span>
          <Link href={`/${material.category.slug}`} className="hover:underline">
            {material.category.title}
          </Link>
        </nav>

        <h1 className="text-3xl font-bold mb-4">{material.title}</h1>

        {/* Мета информация */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
          <span className="flex items-center gap-1">
            <Calendar size={14} />
            {new Date(material.createdAt).toLocaleDateString('ru-RU')}
          </span>
          <span className="flex items-center gap-1">
            <Eye size={14} />
            {material.views.toLocaleString()} просмотров
          </span>
        </div>

        {/* Теги */}
        {material.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {material.tags.map(({ tag }) => (
              <Badge key={tag.id} variant="secondary">
                <Link href={`/tags/${tag.slug}`}>{tag.title}</Link>
              </Badge>
            ))}
          </div>
        )}

        {/* Изображение */}
        {material.image && (
          <div className="relative aspect-video rounded-lg overflow-hidden mb-6">
            <Image
              src={material.image}
              alt={material.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Контент */}
        <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
          {material.description.split('\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        <Separator className="my-6" />

        {/* Голосование */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Оцените материал:
            </p>
            <VoteButtons
              materialId={material.id}
              initialRating={material.rating}
            />
          </div>

          {/* Кнопка жалобы */}
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-muted-foreground"
          >
            <Link href={`/report/${material.id}`}>
              <Flag size={14} className="mr-1" />
              Пожаловаться
            </Link>
          </Button>
        </div>
      </article>

      {/* Сайдбар */}
      <aside className="space-y-8">
        <PopularList items={similar} title="Похожие материалы" />
        <PopularList
          items={popular}
          title={`Популярное в «${material.category.title}»`}
        />
      </aside>
    </div>
  )
}
