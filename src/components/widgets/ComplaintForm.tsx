'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TurnstileInstance } from '@marsidev/react-turnstile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Captcha } from './Captcha'
import { submitComplaint } from '@/lib/actions'
import { complaintSchema, type ComplaintFormData } from '@/lib/schemas'

type Props = {
  materialId: number
}

export function ComplaintForm({ materialId }: Props) {
  const captchaRef = useRef<TurnstileInstance>(null)
  const [captchaToken, setCaptchaToken] = useState('')
  const [captchaError, setCaptchaError] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ComplaintFormData>({
    resolver: zodResolver(complaintSchema),
  })

  async function onSubmit(data: ComplaintFormData) {
    if (!captchaToken) {
      setCaptchaError(true)
      return
    }

    setCaptchaError(false)
    setSubmitError('')

    const result = await submitComplaint(materialId, {
      text: data.text,
      email: data.email || undefined,
      captchaToken,
    })

    if (result.success) {
      setSuccess(true)
    } else {
      setSubmitError(result.error ?? 'Ошибка отправки')
      captchaRef.current?.reset()
      setCaptchaToken('')
    }
  }

  if (success) {
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <label className="text-sm font-medium mb-1 block">
          Опишите проблему *
        </label>
        <textarea
          {...register('text')}
          className="w-full min-h-32 rounded-md border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
          placeholder="Что не так с этим материалом?"
        />
        {errors.text && (
          <p className="text-sm text-red-500 mt-1">{errors.text.message}</p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">
          Email для обратной связи (необязательно)
        </label>
        <Input
          {...register('email')}
          type="email"
          placeholder="your@email.com"
        />
        {errors.email && (
          <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>

      <Captcha
        ref={captchaRef}
        onSuccess={(token) => {
          setCaptchaToken(token)
          setCaptchaError(false)
        }}
      />
      {captchaError && (
        <p className="text-sm text-red-500">Пройдите проверку капчи</p>
      )}

      {submitError && <p className="text-sm text-red-500">{submitError}</p>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Отправка...' : 'Отправить жалобу'}
      </Button>
    </form>
  )
}
