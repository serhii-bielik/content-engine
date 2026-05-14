import Link from 'next/link'
import { signOut } from '@/lib/auth'
import { Button } from '@/components/ui/button'

export function AdminNav() {
  return (
    <header className="border-b bg-background">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/admin" className="font-semibold">
            Админ
          </Link>
          <Link
            href="/admin/complaints"
            className="text-muted-foreground hover:text-foreground"
          >
            Жалобы
          </Link>
          <Link
            href="/admin/messages"
            className="text-muted-foreground hover:text-foreground"
          >
            Сообщения
          </Link>
          <Link
            href="/admin/materials"
            className="text-muted-foreground hover:text-foreground"
          >
            Материалы
          </Link>
        </nav>
        <form
          action={async () => {
            'use server'
            await signOut({ redirectTo: '/admin/login' })
          }}
        >
          <Button variant="ghost" size="sm" type="submit">
            Выйти
          </Button>
        </form>
      </div>
    </header>
  )
}
