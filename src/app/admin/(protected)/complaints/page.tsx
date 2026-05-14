import { prisma } from '@/lib/prisma'
import { ReviewComplaintButton } from '@/components/admin/ReviewComplaintButton'
import Link from 'next/link'

export default async function ComplaintsPage() {
  const complaints = await prisma.complaint.findMany({
    where: { isReviewed: false },
    orderBy: { createdAt: 'desc' },
    include: {
      material: { select: { id: true, slug: true, title: true } },
    },
  })

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Жалобы ({complaints.length})</h1>

      {complaints.length === 0 ? (
        <p className="text-muted-foreground">Новых жалоб нет</p>
      ) : (
        <div className="flex flex-col gap-4">
          {complaints.map((complaint) => (
            <div key={complaint.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <Link
                    href={`/details/${complaint.material.slug}`}
                    className="font-medium hover:underline"
                    target="_blank"
                  >
                    {complaint.material.title}
                  </Link>
                  <p className="text-sm text-muted-foreground mt-1">
                    {complaint.text}
                  </p>
                  {complaint.email && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Email: {complaint.email}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(complaint.createdAt).toLocaleString('ru-RU')}
                  </p>
                </div>
                <ReviewComplaintButton
                  complaintId={complaint.id}
                  materialId={complaint.material.id}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
