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
