'use server'

import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

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
    await prisma.vote.create({
      data: { materialId, ip, value },
    })
    await prisma.material.update({
      where: { id: materialId },
      data: { rating: { increment: value } },
    })
    return { success: true }
  } catch {
    return { success: false, error: 'already_voted' }
  }
}
