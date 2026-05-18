import { prisma } from '@/lib/prisma'

export const revalidate = 86400 // раз в сутки

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

export default async function sitemap() {
  const [materials, categories, tags] = await Promise.all([
    prisma.material.findMany({
      where: { isPublished: true, isHidden: false },
      select: { slug: true, updatedAt: true },
    }),
    prisma.category.findMany({
      select: { slug: true },
    }),
    prisma.tag.findMany({
      where: { materialsCount: { gt: 0 } },
      select: { slug: true },
    }),
  ])

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${BASE_URL}/top`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    ...categories.map((cat) => ({
      url: `${BASE_URL}/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),
    ...tags.map((tag) => ({
      url: `${BASE_URL}/tags/${tag.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
    ...materials.map((m) => ({
      url: `${BASE_URL}/details/${m.slug}`,
      lastModified: m.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
