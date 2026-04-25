'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { voteMaterial } from '@/lib/actions'

type Props = {
  materialId: number
  initialRating: number
}

export function VoteButtons({ materialId, initialRating }: Props) {
  const [rating, setRating] = useState(initialRating)
  const [voted, setVoted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleVote(value: 1 | -1) {
    if (voted || loading) return
    setLoading(true)

    const result = await voteMaterial(materialId, value)

    if (result.success) {
      setRating((r) => r + value)
      setVoted(true)
    } else {
      setVoted(true)
    }

    setLoading(false)
  }

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleVote(1)}
        disabled={voted || loading}
        className="gap-1"
      >
        <ThumbsUp size={14} />
        За
      </Button>
      <span className="font-semibold text-lg">{rating}</span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleVote(-1)}
        disabled={voted || loading}
        className="gap-1"
      >
        <ThumbsDown size={14} />
        Против
      </Button>
      {voted && (
        <span className="text-sm text-muted-foreground">Спасибо за оценку</span>
      )}
    </div>
  )
}
