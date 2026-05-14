import { LoginForm } from '@/components/admin/LoginForm'

type Props = {
  searchParams: Promise<{ error?: string }>
}

export default async function LoginPage({ searchParams }: Props) {
  const { error } = await searchParams

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6">Админ панель</h1>
        {error === 'CredentialsSignin' && (
          <p className="text-sm text-red-500 text-center mb-4">
            Неверный email или пароль
          </p>
        )}
        <LoginForm />
      </div>
    </div>
  )
}
