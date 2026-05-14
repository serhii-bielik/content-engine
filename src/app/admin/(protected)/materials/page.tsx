import { prisma } from '@/lib/prisma'
import { TogglePublishButton } from '@/components/admin/TogglePublishButton'
import Link from 'next/link'

export default async function AdminMaterialsPage() {
  const materials = await prisma.material.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    select: {
      id: true,
      slug: true,
      title: true,
      isPublished: true,
      isHidden: true,
      complaintsCount: true,
      views: true,
      createdAt: true,
      category: { select: { title: true } },
    },
  })

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Материалы</h1>
      <div className="flex flex-col divide-y">
        {materials.map((material) => (
          <div key={material.id} className="py-3 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <Link
                href={`/details/${material.slug}`}
                className="font-medium hover:underline line-clamp-1"
                target="_blank"
              >
                {material.title}
              </Link>
              <div className="text-xs text-muted-foreground mt-1 flex gap-3">
                <span>{material.category.title}</span>
                <span>{material.views.toLocaleString()} просмотров</span>
                {material.complaintsCount > 0 && (
                  <span className="text-red-500">
                    {material.complaintsCount} жалоб
                  </span>
                )}
                {material.isHidden && (
                  <span className="text-orange-500">Скрыт</span>
                )}
              </div>
            </div>
            <TogglePublishButton
              materialId={material.id}
              isPublished={material.isPublished}
              isHidden={material.isHidden}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
