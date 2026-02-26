import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/db/client'
import { verifyPassword } from '@/lib/auth/password'

// User role constants
export const UserRole = {
  ADMIN: 'ADMIN',
  EDITOR: 'EDITOR',
  VIEWER: 'VIEWER',
  CLIENT: 'CLIENT',
} as const

export type UserRoleType = typeof UserRole[keyof typeof UserRole]

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        code: { label: 'Access Code', type: 'text' },
      },
      async authorize(credentials) {
        // ── Code-based login (CLIENT) ──────────────────────────────────
        if (credentials?.code && !credentials?.email) {
          const user = await prisma.user.findFirst({
            where: {
              accessCode: credentials.code as string,
              role: 'CLIENT',
              isActive: true,
            },
          })
          if (!user) return null

          await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
          })

          return { id: user.id, email: user.email, name: user.name, role: user.role }
        }

        // ── Email + Password login (ADMIN / EDITOR / VIEWER) ──────────
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user || !user.isActive) return null

        const isValidPassword = await verifyPassword(
          credentials.password as string,
          user.passwordHash
        )

        if (!isValidPassword) return null

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        })

        return { id: user.id, email: user.email, name: user.name, role: user.role }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  basePath: '/api/auth',
  trustHost: true,
})
