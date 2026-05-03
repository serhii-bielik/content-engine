import { cached, TTL } from './redis'
import {
  getPopularMaterials,
  getPopularThisMonth,
  getPopularTags,
  getPopularInCategory,
} from './queries'

export async function getCachedPopularMaterials(take = 10) {
  return cached(`popular:materials:${take}`, TTL.POPULAR_MATERIALS, () =>
    getPopularMaterials(take)
  )
}

export async function getCachedPopularThisMonth(take = 10) {
  return cached(`popular:month:${take}`, TTL.POPULAR_THIS_MONTH, () =>
    getPopularThisMonth(take)
  )
}

export async function getCachedPopularTags(take = 30) {
  return cached(`popular:tags:${take}`, TTL.POPULAR_TAGS, () =>
    getPopularTags(take)
  )
}

export async function getCachedPopularInCategory(categoryId: number, take = 5) {
  return cached(
    `popular:category:${categoryId}:${take}`,
    TTL.POPULAR_IN_CATEGORY,
    () => getPopularInCategory(categoryId, take)
  )
}
