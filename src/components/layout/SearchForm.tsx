'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import slugify from 'slugify'

type Props = {
  large?: boolean
}

export function SearchForm({ large }: Props) {
  const router = useRouter()
  const [query, setQuery] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return
    const slug = slugify(trimmed, { lower: true, strict: true })
    router.push(`/search/${slug}?q=${encodeURIComponent(trimmed)}`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 flex-1 max-w-md">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Поиск..."
        className={large ? 'h-12 text-lg' : 'h-9'}
      />
      <Button type="submit" size={large ? 'lg' : 'sm'} variant="ghost">
        <Search size={large ? 20 : 16} />
      </Button>
    </form>
  )
}
