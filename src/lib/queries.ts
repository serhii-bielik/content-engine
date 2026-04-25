import { prisma } from '@/lib/prisma'

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
