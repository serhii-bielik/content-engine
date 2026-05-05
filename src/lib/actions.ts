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

async function verifyCaptcha(token: string): Promise<boolean> {
  const response = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: token,
      }),
    }
  )
  const data = await response.json()
  return data.success === true
}

export async function submitComplaint(
  materialId: number,
  data: { text: string; email?: string; captchaToken: string }
) {
  const isValid = await verifyCaptcha(data.captchaToken)
  if (!isValid) return { success: false, error: 'Капча не пройдена' }

  if (data.text.trim().length < 10) {
    return { success: false, error: 'Опишите проблему подробнее' }
  }

  await prisma.$transaction(async (tx) => {
    await tx.complaint.create({
      data: {
        materialId,
        text: data.text.trim(),
        email: data.email?.trim() || null,
      },
    })

    await tx.material.update({
      where: { id: materialId },
      data: { complaintsCount: { increment: 1 } },
    })

    // Автоскрытие при 5+ жалобах
    const material = await tx.material.findUnique({
      where: { id: materialId },
      select: { complaintsCount: true },
    })

    if (material && material.complaintsCount >= 5) {
      await tx.material.update({
        where: { id: materialId },
        data: {
          isHidden: true,
          hiddenReason: data.text.trim(),
        },
      })
    }
  })

  return { success: true }
}

export async function submitContact(data: {
  name: string
  email: string
  text: string
  captchaToken: string
}) {
  const isValid = await verifyCaptcha(data.captchaToken)
  if (!isValid) return { success: false, error: 'Капча не пройдена' }

  if (data.text.trim().length < 10) {
    return { success: false, error: 'Сообщение слишком короткое' }
  }

  await prisma.contactMessage.create({
    data: {
      name: data.name.trim(),
      email: data.email.trim(),
      text: data.text.trim(),
    },
  })

  return { success: true }
}
