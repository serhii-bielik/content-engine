'use client'

import { useEffect } from 'react'
import { incrementViews } from '@/lib/actions'

type Props = {
  materialId: number
}

export function ViewCounter({ materialId }: Props) {
  useEffect(() => {
    incrementViews(materialId)
  }, [materialId])

  return null
}
