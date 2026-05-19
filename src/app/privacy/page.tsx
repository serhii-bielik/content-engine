import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Политика конфиденциальности',
  robots: {
    index: false, // не индексировать поисковиками
  },
}

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl prose prose-neutral dark:prose-invert">
      <h1>Политика конфиденциальности</h1>

      <p>
        Настоящая политика конфиденциальности описывает как ContentEngine
        собирает, использует и защищает информацию пользователей.
      </p>

      <h2>Какие данные мы собираем</h2>
      <ul>
        <li>IP адреса для защиты от накрутки голосований</li>
        <li>Поисковые запросы для улучшения сервиса</li>
        <li>Данные из контактных форм и форм жалоб</li>
      </ul>

      <h2>Как мы используем данные</h2>
      <ul>
        <li>
          IP адреса используются исключительно для ограничения повторных
          голосований
        </li>
        <li>
          Поисковые запросы используются в агрегированном виде для виджета
          популярных запросов
        </li>
        <li>Контактные данные используются только для ответа на обращения</li>
      </ul>

      <h2>Cookies</h2>
      <p>
        Мы используем cookies для обеспечения работы сайта. Cookies не содержат
        персональных данных и не передаются третьим лицам.
      </p>

      <h2>Cloudflare Turnstile</h2>
      <p>
        Для защиты форм мы используем Cloudflare Turnstile. При использовании
        форм применяется{' '}
        <a
          href="https://www.cloudflare.com/privacypolicy/"
          target="_blank"
          rel="noopener noreferrer"
        >
          политика конфиденциальности Cloudflare
        </a>
        .
      </p>

      <h2>Контакты</h2>
      <p>
        По вопросам конфиденциальности обращайтесь через{' '}
        <Link href="/contact">форму обратной связи</Link>.
      </p>

      <p className="text-sm text-muted-foreground">
        Последнее обновление: {new Date().toLocaleDateString('ru-RU')}
      </p>
    </div>
  )
}
