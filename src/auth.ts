import { type NextAuthOptions } from 'next-auth'
import GoogleProvider    from 'next-auth/providers/google'
import FacebookProvider  from 'next-auth/providers/facebook'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './lib/prisma'

const providers: NextAuthOptions['providers'] = []

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(GoogleProvider({
    clientId:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  }))
}

if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
  providers.push(FacebookProvider({
    clientId:     process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  }))
}

providers.push(CredentialsProvider({
  id: 'email-login',
  name: 'Email',
  credentials: {
    email:    { label: 'Email',    type: 'email'    },
    password: { label: 'Password', type: 'password' },
  },
  async authorize(credentials) {
    if (!credentials?.email) return null
    const email = credentials.email.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null

    const customer = await prisma.customer.findUnique({ where: { email } })

    if (customer?.hashedPassword) {
      // Password-based login: verify bcrypt hash
      const valid = await bcrypt.compare(credentials.password ?? '', customer.hashedPassword)
      if (!valid) return null
      return { id: customer.id, email: customer.email, name: customer.name ?? null, image: customer.image ?? null }
    }

    // No password set yet (OAuth-only user): allow sign-in without password
    // so existing Google/Facebook users aren't locked out
    if (customer) {
      return { id: customer.id, email: customer.email, name: customer.name ?? null, image: customer.image ?? null }
    }

    // New email-only user: create account with no password (can set one via forgot-password)
    return { id: email, email, name: email.split('@')[0], image: null }
  },
}))

export const authOptions: NextAuthOptions = {
  providers,

  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },

  callbacks: {
    async signIn({ user, account }) {
      // Save / update customer in DB on every login
      if (user.email) {
        prisma.customer.upsert({
          where:  { email: user.email },
          create: {
            email:      user.email,
            name:       user.name  ?? null,
            image:      user.image ?? null,
            provider:   account?.provider ?? 'credentials',
            providerId: account?.providerAccountId ?? user.email,
          },
          update: {
            name:     user.name  ?? undefined,
            image:    user.image ?? undefined,
            provider: account?.provider ?? undefined,
          },
        }).catch(() => {}) // non-blocking, non-fatal
      }
      return true
    },

    async jwt({ token, account }) {
      if (account) token.provider = account.provider
      return token
    },

    async session({ session, token }) {
      if (session.user) (session.user as any).provider = token.provider
      return session
    },
  },

  pages: {
    signIn: '/login',
    error:  '/login',
  },

  secret: process.env.NEXTAUTH_SECRET,
}
