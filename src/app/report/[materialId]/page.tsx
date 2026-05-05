import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ComplaintForm } from '@/components/widgets/ComplaintForm'

type Props = {
  params: Promise<{ materialId: string }>
}

export default async function ReportPage({ params }: Props) {
  const { materialId } = await params
  const id = parseInt(materialId)
  if (isNaN(id)) notFound()

  const material = await prisma.material.findUnique({
    where: { id, isPublished: true },
    select: { id: true, title: true },
  })

  if (!material) notFound()

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-2">Пожаловаться на материал</h1>
      <p className="text-muted-foreground mb-6 text-sm">«{material.title}»</p>
      <ComplaintForm materialId={material.id} />
    </div>
  )
}
