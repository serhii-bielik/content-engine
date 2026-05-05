'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Captcha } from './Captcha'
import { submitComplaint } from '@/lib/actions'

type Props = {
  materialId: number
}

export function ComplaintForm({ materialId }: Props) {
  const [text, setText] = useState('')
  const [email, setEmail] = useState('')
  const [captchaToken, setCaptchaToken] = useState('')
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!captchaToken) {
      setError('Пройдите проверку капчи')
      return
    }

    setStatus('loading')
    const result = await submitComplaint(materialId, {
      text,
      email,
      captchaToken,
    })

    if (result.success) {
      setStatus('success')
    } else {
      setError(result.error ?? 'Ошибка отправки')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">✓</div>
        <h2 className="font-semibold text-lg mb-2">Жалоба отправлена</h2>
        <p className="text-muted-foreground text-sm">
          Мы рассмотрим её в ближайшее время
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="text-sm font-medium mb-1 block">
          Опишите проблему *
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full min-h-32 rounded-md border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
          placeholder="Что не так с этим материалом?"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">
          Email для обратной связи (необязательно)
        </label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
        />
      </div>

      <Captcha onSuccess={setCaptchaToken} />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" disabled={status === 'loading' || !text.trim()}>
        {status === 'loading' ? 'Отправка...' : 'Отправить жалобу'}
      </Button>
    </form>
  )
}
