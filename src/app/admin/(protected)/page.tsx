import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function AdminDashboard() {
  const [complaints, messages, materials] = await Promise.all([
    prisma.complaint.count({ where: { isReviewed: false } }),
    prisma.contactMessage.count({ where: { isReviewed: false } }),
    prisma.material.count({ where: { isPublished: true } }),
  ])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Дашборд</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/complaints">
          <Card className="hover:border-foreground/30 transition-colors cursor-pointer">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Новые жалобы
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{complaints}</div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/messages">
          <Card className="hover:border-foreground/30 transition-colors cursor-pointer">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Новые сообщения
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{messages}</div>
            </CardContent>
          </Card>
        </Link>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Материалов опубликовано
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{materials}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
