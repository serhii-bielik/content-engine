export type Category = {
  id: number
  slug: string
  title: string
  description: string | null
  _count?: { materials: number }
}

export type Tag = {
  id: number
  slug: string
  title: string
  materialsCount: number
}

export type Material = {
  id: number
  slug: string
  title: string
  description: string
  image: string | null
  categoryId: number
  category?: Category
  tags?: MaterialWithTag[]
  views: number
  rating: number
  isPublished: boolean
  isHidden: boolean
  hiddenReason: string | null
  complaintsCount: number
  metadata: Record<string, unknown> | null
  createdAt: Date
  updatedAt: Date
}

export type MaterialWithTag = {
  tag: Tag
}

export type Vote = {
  id: number
  materialId: number
  ip: string
  value: number
  createdAt: Date
}

export type Complaint = {
  id: number
  materialId: number
  text: string
  email: string | null
  isReviewed: boolean
  createdAt: Date
}

export type ContactMessage = {
  id: number
  name: string
  email: string
  text: string
  isReviewed: boolean
  createdAt: Date
}

export type SearchQuery = {
  id: number
  query: string
  count: number
  slug: string
}

export type PaginatedResult<T> = {
  items: T[]
  total: number
  page: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}
