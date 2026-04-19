import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { faker } from '@faker-js/faker'
import slugify from 'slugify'
import 'dotenv/config'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const CATEGORIES = [
  { title: 'Технологии', description: 'Новости мира технологий' },
  { title: 'Наука', description: 'Научные открытия и исследования' },
  { title: 'Бизнес', description: 'Бизнес и экономика' },
  { title: 'Дизайн', description: 'UI/UX и графический дизайн' },
  { title: 'Программирование', description: 'Код, языки, фреймворки' },
  { title: 'Игры', description: 'Видеоигры и игровая индустрия' },
  { title: 'Кино', description: 'Фильмы и сериалы' },
  { title: 'Музыка', description: 'Музыка и исполнители' },
  { title: 'Спорт', description: 'Спортивные события и новости' },
  { title: 'Путешествия', description: 'Места и маршруты' },
  { title: 'Еда', description: 'Рецепты и рестораны' },
  { title: 'Здоровье', description: 'Медицина и здоровый образ жизни' },
  { title: 'Образование', description: 'Обучение и курсы' },
  { title: 'Финансы', description: 'Инвестиции и личные финансы' },
  { title: 'Экология', description: 'Природа и окружающая среда' },
]

const TAGS = [
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'Python',
  'AI',
  'Machine Learning',
  'Web3',
  'Blockchain',
  'DevOps',
  'Docker',
  'Kubernetes',
  'AWS',
  'Linux',
  'Open Source',
  'Startup',
  'Инвестиции',
  'Криптовалюта',
  'NFT',
  'Metaverse',
  'iOS',
  'Android',
  'Flutter',
  'Swift',
  'Kotlin',
  'UX',
  'UI',
  'Figma',
  'CSS',
  'Tailwind',
  'PostgreSQL',
  'MongoDB',
  'Redis',
  'GraphQL',
  'REST API',
  'Security',
  'Privacy',
  'Cloud',
  'SaaS',
  'API',
]

function makeSlug(text: string): string {
  return slugify(text, { lower: true, strict: true })
}

async function main() {
  console.log('🌱 Seeding database...')

  // Категории
  const categories = await Promise.all(
    CATEGORIES.map((cat) =>
      prisma.category.upsert({
        where: { slug: makeSlug(cat.title) },
        update: {},
        create: {
          slug: makeSlug(cat.title),
          title: cat.title,
          description: cat.description,
        },
      })
    )
  )
  console.log(`✅ Categories: ${categories.length}`)

  // Теги
  const tags = await Promise.all(
    TAGS.map((tag) =>
      prisma.tag.upsert({
        where: { slug: makeSlug(tag) },
        update: {},
        create: {
          slug: makeSlug(tag),
          title: tag,
        },
      })
    )
  )
  console.log(`✅ Tags: ${tags.length}`)

  // Материалы
  const MATERIALS_COUNT = 500
  let created = 0

  for (let i = 0; i < MATERIALS_COUNT; i++) {
    const title = faker.lorem.sentence({ min: 4, max: 10 }).replace('.', '')
    const id_placeholder = i + 1
    const slug = `${id_placeholder}-${makeSlug(title)}`
    const category = faker.helpers.arrayElement(categories)

    // Случайные теги (от 1 до 5)
    const materialTags = faker.helpers.arrayElements(tags, {
      min: 1,
      max: 5,
    })

    const views = faker.number.int({ min: 0, max: 10000 })
    const rating = faker.number.int({ min: -10, max: 100 })
    const createdAt = faker.date.between({
      from: new Date('2023-01-01'),
      to: new Date(),
    })

    const material = await prisma.material.create({
      data: {
        slug,
        title,
        description: faker.lorem.paragraphs({ min: 2, max: 5 }),
        image: faker.helpers.maybe(
          () =>
            `https://picsum.photos/seed/${faker.string.alphanumeric(8)}/800/450`,
          { probability: 0.8 }
        ),
        categoryId: category.id,
        views,
        rating,
        isPublished: faker.datatype.boolean({ probability: 0.85 }),
        createdAt,
        updatedAt: createdAt,
        tags: {
          create: materialTags.map((tag) => ({
            tagId: tag.id,
          })),
        },
      },
    })

    // Обновляем slug с реальным ID
    await prisma.material.update({
      where: { id: material.id },
      data: { slug: `${material.id}-${makeSlug(title)}` },
    })

    created++
    if (created % 100 === 0)
      console.log(`📝 Materials: ${created}/${MATERIALS_COUNT}`)
  }

  // Обновляем счётчик materialsCount для тегов
  for (const tag of tags) {
    const count = await prisma.materialTag.count({
      where: { tagId: tag.id },
    })
    await prisma.tag.update({
      where: { id: tag.id },
      data: { materialsCount: count },
    })
  }
  console.log('✅ Tag counts updated')

  // Поисковые запросы
  const SEARCH_QUERIES = [
    'как научиться программировать',
    'лучшие фреймворки 2024',
    'react vs vue',
    'что такое docker',
    'как инвестировать',
    'лучшие игры года',
    'здоровое питание',
    'путешествия бюджет',
  ]

  for (const query of SEARCH_QUERIES) {
    await prisma.searchQuery.upsert({
      where: { query },
      update: { count: faker.number.int({ min: 10, max: 500 }) },
      create: {
        query,
        slug: makeSlug(query),
        count: faker.number.int({ min: 10, max: 500 }),
      },
    })
  }
  console.log('✅ Search queries seeded')

  console.log('🎉 Done!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
