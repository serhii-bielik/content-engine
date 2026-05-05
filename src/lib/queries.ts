import { prisma } from '@/lib/prisma'
import { Prisma } from '../../generated/prisma/client'

type RawMaterial = {
  id: number
  slug: string
  title: string
  description: string
  image: string | null
  views: number
  rating: number
  createdAt: Date
  categoryId: number
  rank: number
}

export async function getPopularMaterials(take = 10) {
  return prisma.material.findMany({
    where: { isPublished: true, isHidden: false },
    orderBy: { views: 'desc' },
    take,
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      image: true,
      views: true,
      rating: true,
      createdAt: true,
      category: { select: { slug: true, title: true } },
      tags: { select: { tag: { select: { slug: true, title: true } } } },
    },
  })
}

export async function getPopularThisMonth(take = 10) {
  const from = new Date()
  from.setMonth(from.getMonth() - 1)

  return prisma.material.findMany({
    where: {
      isPublished: true,
      isHidden: false,
      createdAt: { gte: from },
    },
    orderBy: { views: 'desc' },
    take,
    select: {
      id: true,
      slug: true,
      title: true,
      views: true,
      rating: true,
      createdAt: true,
      category: { select: { slug: true, title: true } },
    },
  })
}

export async function getPopularTags(take = 30) {
  return prisma.tag.findMany({
    where: { materialsCount: { gt: 0 } },
    orderBy: { materialsCount: 'desc' },
    take,
  })
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: { _count: { select: { materials: true } } },
  })
}

export async function getMaterialsByCategory({
  categoryId,
  page = 1,
  perPage = 20,
}: {
  categoryId: number
  page: number
  perPage?: number
}) {
  const skip = (page - 1) * perPage
  const MAX_PAGE = 50

  if (page > MAX_PAGE) {
    return {
      items: [],
      total: 0,
      page,
      totalPages: 0,
      hasNext: false,
      hasPrev: false,
    }
  }

  const where = {
    categoryId,
    isPublished: true,
    isHidden: false,
  }

  const [items, total] = await Promise.all([
    prisma.material.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: perPage,
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        image: true,
        views: true,
        rating: true,
        createdAt: true,
        category: { select: { slug: true, title: true } },
        tags: { select: { tag: { select: { slug: true, title: true } } } },
      },
    }),
    prisma.material.count({ where }),
  ])

  const totalPages = Math.ceil(total / perPage)

  return {
    items,
    total,
    page,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  }
}

export async function getPopularInCategory(categoryId: number, take = 5) {
  return prisma.material.findMany({
    where: { categoryId, isPublished: true, isHidden: false },
    orderBy: { views: 'desc' },
    take,
    select: {
      id: true,
      slug: true,
      title: true,
      views: true,
    },
  })
}

export async function getMaterialBySlug(slug: string) {
  // Извлекаем ID из начала slug (например "123-title-here" → 123)
  const id = parseInt(slug.split('-')[0])
  if (isNaN(id)) return null

  return prisma.material.findUnique({
    where: { id },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      image: true,
      views: true,
      rating: true,
      isPublished: true,
      isHidden: true,
      hiddenReason: true,
      complaintsCount: true,
      metadata: true,
      createdAt: true,
      updatedAt: true,
      category: { select: { id: true, slug: true, title: true } },
      tags: {
        select: { tag: { select: { id: true, slug: true, title: true } } },
      },
    },
  })
}

export async function getSimilarMaterials(
  materialId: number,
  categoryId: number,
  take = 5
) {
  return prisma.material.findMany({
    where: {
      categoryId,
      isPublished: true,
      isHidden: false,
      id: { not: materialId },
    },
    orderBy: { views: 'desc' },
    take,
    select: {
      id: true,
      slug: true,
      title: true,
      views: true,
      category: { select: { slug: true, title: true } },
    },
  })
}

export async function getTagBySlug(slug: string) {
  return prisma.tag.findUnique({
    where: { slug },
  })
}

export async function getMaterialsByTag({
  tagId,
  page = 1,
  perPage = 20,
}: {
  tagId: number
  page: number
  perPage?: number
}) {
  const skip = (page - 1) * perPage
  const MAX_PAGE = 50

  if (page > MAX_PAGE) {
    return {
      items: [],
      total: 0,
      page,
      totalPages: 0,
      hasNext: false,
      hasPrev: false,
    }
  }

  const where = {
    tags: { some: { tagId } },
    isPublished: true,
    isHidden: false,
  }

  const [items, total] = await Promise.all([
    prisma.material.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: perPage,
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        image: true,
        views: true,
        rating: true,
        createdAt: true,
        category: { select: { slug: true, title: true } },
        tags: { select: { tag: { select: { slug: true, title: true } } } },
      },
    }),
    prisma.material.count({ where }),
  ])

  const totalPages = Math.ceil(total / perPage)

  return {
    items,
    total,
    page,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  }
}

export async function searchMaterials({
  query,
  categoryId,
  page = 1,
  perPage = 20,
}: {
  query: string
  categoryId?: number
  page: number
  perPage?: number
}) {
  const skip = (page - 1) * perPage

  // Подготавливаем запрос для PostgreSQL FTS
  // Слова соединяем через & (AND) для поиска всех слов
  const tsQuery = query
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => `${word}:*`) // :* означает поиск по префиксу
    .join(' & ')

  const categoryFilter = categoryId
    ? Prisma.sql`AND m."categoryId" = ${categoryId}`
    : Prisma.sql``

  const [items, countResult] = await Promise.all([
    prisma.$queryRaw<RawMaterial[]>`
      SELECT
        m.id,
        m.slug,
        m.title,
        m.description,
        m.image,
        m.views,
        m.rating,
        m."createdAt",
        m."categoryId",
        ts_rank(m."searchVector", to_tsquery('russian', ${tsQuery})) AS rank
      FROM "Material" m
      WHERE
        m."isPublished" = true
        AND m."isHidden" = false
        AND m."searchVector" @@ to_tsquery('russian', ${tsQuery})
        ${categoryFilter}
      ORDER BY rank DESC, m.views DESC
      LIMIT ${perPage}
      OFFSET ${skip}
    `,
    prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*) as count
      FROM "Material" m
      WHERE
        m."isPublished" = true
        AND m."isHidden" = false
        AND m."searchVector" @@ to_tsquery('russian', ${tsQuery})
        ${categoryFilter}
    `,
  ])

  // Подгружаем категории и теги для найденных материалов
  const ids = items.map((m) => m.id)
  const materialsWithRelations =
    ids.length > 0
      ? await prisma.material.findMany({
          where: { id: { in: ids } },
          select: {
            id: true,
            slug: true,
            title: true,
            description: true,
            image: true,
            views: true,
            rating: true,
            createdAt: true,
            category: { select: { slug: true, title: true } },
            tags: { select: { tag: { select: { slug: true, title: true } } } },
          },
        })
      : []

  // Сортируем по релевантности из raw запроса
  const rankMap = new Map(items.map((m) => [m.id, m.rank]))
  const sorted = materialsWithRelations.sort(
    (a, b) => (rankMap.get(b.id) ?? 0) - (rankMap.get(a.id) ?? 0)
  )

  const total = Number(countResult[0]?.count ?? 0)
  const totalPages = Math.ceil(total / perPage)

  return {
    items: sorted,
    total,
    page,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  }
}

export async function saveSearchQuery(query: string) {
  const slug = (await import('slugify')).default(query, {
    lower: true,
    strict: true,
  })

  await prisma.searchQuery.upsert({
    where: { query },
    update: { count: { increment: 1 } },
    create: { query, slug, count: 1 },
  })
}

export async function getAllCategories() {
  return prisma.category.findMany({
    orderBy: { title: 'asc' },
    select: { id: true, slug: true, title: true },
  })
}

export async function getTopMaterials(take = 100) {
  return prisma.material.findMany({
    where: { isPublished: true, isHidden: false },
    orderBy: { views: 'desc' },
    take,
    select: {
      id: true,
      slug: true,
      title: true,
      views: true,
      rating: true,
      createdAt: true,
      category: { select: { slug: true, title: true } },
    },
  })
}
