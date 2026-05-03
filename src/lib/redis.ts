import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// TTL константы в секундах
export const TTL = {
  POPULAR_MATERIALS: 60 * 60 * 6, // 6 часов
  POPULAR_THIS_MONTH: 60 * 60 * 24, // 24 часа
  POPULAR_IN_CATEGORY: 60 * 60 * 6, // 6 часов
  POPULAR_TAGS: 60 * 60 * 12, // 12 часов
  RANDOM_QUERIES: 60 * 10, // 10 минут
} as const

// Универсальная функция кэширования
export async function cached<T>(
  key: string,
  ttl: number,
  fn: () => Promise<T>
): Promise<T> {
  try {
    const cached = await redis.get<T>(key)
    if (cached !== null) return cached

    const data = await fn()
    await redis.set(key, data, { ex: ttl })
    return data
  } catch (error) {
    // Если Redis недоступен — возвращаем данные напрямую из БД
    console.warn('Redis error, falling back to DB:', error)
    return fn()
  }
}
