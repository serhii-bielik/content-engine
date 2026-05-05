'use client'

import { Turnstile } from '@marsidev/react-turnstile'

type Props = {
  onSuccess: (token: string) => void
}

export function Captcha({ onSuccess }: Props) {
  return (
    <Turnstile
      siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
      onSuccess={onSuccess}
    />
  )
}
