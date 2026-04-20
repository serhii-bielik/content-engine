import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export async function Footer() {
  const popularQueries = await prisma.searchQuery.findMany({
    orderBy: { count: 'desc' },
    take: 20,
  })

  return (
    <footer className="border-t mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold mb-3">ContentEngine</h3>
            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:underline">
                Политика конфиденциальности
              </Link>
              <Link href="/contact" className="hover:underline">
                Контакты
              </Link>
            </div>
          </div>

          {popularQueries.length > 0 && (
            <div className="md:col-span-2">
              <h3 className="font-semibold mb-3">Популярные запросы</h3>
              <div className="flex flex-wrap gap-2">
                {popularQueries.map((sq) => (
                  <Link
                    key={sq.id}
                    href={`/search/${sq.slug}?q=${encodeURIComponent(sq.query)}`}
                    className="text-sm px-2 py-1 rounded bg-accent hover:bg-accent/80 transition-colors"
                    style={{
                      fontSize: `${Math.max(0.75, Math.min(1.1, 0.75 + (sq.count / 500) * 0.35))}rem`,
                    }}
                  >
                    {sq.query}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}
