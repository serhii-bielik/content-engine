'use client'

import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile'

type Props = {
  onSuccess: (token: string) => void
  onError?: () => void
  ref?: React.Ref<TurnstileInstance>
}

export function Captcha({ onSuccess, onError, ref }: Props) {
  return (
    <Turnstile
      ref={ref}
      siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
      onSuccess={onSuccess}
      onError={onError}
    />
  )
}
