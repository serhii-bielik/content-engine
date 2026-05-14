'use client'

import { Button } from '@/components/ui/button'
import { reviewMessage } from '@/lib/actions'
import { useRouter } from 'next/navigation'

type Props = {
  messageId: number
}

export function ReviewMessageButton({ messageId }: Props) {
  const router = useRouter()

  async function handleMessage() {
    await reviewMessage(messageId)
    router.refresh()
  }

  return (
    <div className="flex gap-2 shrink-0">
      <Button variant="outline" size="sm" onClick={handleMessage}>
        Просмотрено
      </Button>
    </div>
  )
}
