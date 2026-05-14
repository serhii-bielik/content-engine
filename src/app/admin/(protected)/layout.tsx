import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AdminNav } from '@/components/admin/AdminNav'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) redirect('/admin/login')

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminNav />
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
