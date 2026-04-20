import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ThemeToggle } from './ThemeToggle'
import { SearchForm } from './SearchForm'

export async function Header() {
  const categories = await prisma.category.findMany({
    orderBy: { title: 'asc' },
  })

  return (
    <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link href="/" className="font-bold text-xl shrink-0">
            ContentEngine
          </Link>

          <SearchForm />

          <ThemeToggle />
        </div>

        {/* Категории */}
        <nav className="flex gap-1 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/${cat.slug}`}
              className="text-sm px-3 py-1 rounded-full whitespace-nowrap hover:bg-accent transition-colors"
            >
              {cat.title}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
