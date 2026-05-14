'use client'

import { Button } from '@/components/ui/button'
import { reviewComplaint, hideMaterial } from '@/lib/actions'
import { useRouter } from 'next/navigation'

type Props = {
  complaintId: number
  materialId: number
}

export function ReviewComplaintButton({ complaintId, materialId }: Props) {
  const router = useRouter()

  async function handleReview() {
    await reviewComplaint(complaintId)
    router.refresh()
  }

  async function handleHide() {
    await hideMaterial(materialId, complaintId)
    router.refresh()
  }

  return (
    <div className="flex gap-2 shrink-0">
      <Button variant="outline" size="sm" onClick={handleReview}>
        Отклонить
      </Button>
      <Button variant="destructive" size="sm" onClick={handleHide}>
        Скрыть материал
      </Button>
    </div>
  )
}
