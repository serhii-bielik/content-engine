import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async () => null, // заглушка, реальная логика в auth.ts
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  session: { strategy: 'jwt' },
}
