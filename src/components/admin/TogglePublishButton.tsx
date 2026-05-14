'use client'

import { Button } from '@/components/ui/button'
import { toggleMaterialVisibility } from '@/lib/actions'
import { useRouter } from 'next/navigation'

type Props = {
  materialId: number
  isPublished: boolean
  isHidden: boolean
}

export function TogglePublishButton({
  materialId,
  isPublished,
  isHidden,
}: Props) {
  const router = useRouter()

  async function handle(action: 'publish' | 'unpublish' | 'unhide') {
    await toggleMaterialVisibility(materialId, action)
    router.refresh()
  }

  return (
    <div className="flex gap-2 shrink-0">
      {isHidden ? (
        <Button variant="outline" size="sm" onClick={() => handle('unhide')}>
          Восстановить
        </Button>
      ) : isPublished ? (
        <Button variant="outline" size="sm" onClick={() => handle('unpublish')}>
          Снять с публикации
        </Button>
      ) : (
        <Button variant="outline" size="sm" onClick={() => handle('publish')}>
          Опубликовать
        </Button>
      )}
    </div>
  )
}
