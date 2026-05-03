'use server'

import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import { saveSearchQuery } from './queries'
import { redis } from './redis'

export async function incrementViews(materialId: number) {
  await prisma.material.update({
    where: { id: materialId },
    data: { views: { increment: 1 } },
  })
}

export async function voteMaterial(materialId: number, value: 1 | -1) {
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for') ?? 'unknown'

  try {
    await prisma.$transaction([
      prisma.vote.create({
        data: { materialId, ip, value },
      }),
      prisma.material.update({
        where: { id: materialId },
        data: { rating: { increment: value } },
      }),
    ])

    await redis.del('popular:materials:10')
    await redis.del('popular:month:10')

    return { success: true }
  } catch {
    return { success: false, error: 'already_voted' }
  }
}

export async function saveQuery(query: string) {
  if (query.trim().length < 2) return
  await saveSearchQuery(query.trim())
}
