import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { JWT } from "next-auth/jwt"
import { Session } from "next-auth"

// Define custom types for user and session
interface User {
  id: string
  email: string
  name: string
  role: string
  isEmailVerified: boolean
}

interface CustomToken extends JWT {
  role?: string
  isEmailVerified?: boolean
}

const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Call backend API for authentication
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          if (!response.ok) {
            return null
          }

          const data = await response.json()
          
          if (data.success && data.user) {
            return {
              id: data.user.id,
              email: data.user.email,
              name: data.user.name,
              role: data.user.role,
              isEmailVerified: data.user.isEmailVerified,
            }
          }

          return null
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }: { token: CustomToken; user: any }) {
      if (user) {
        token.role = (user as User).role
        token.isEmailVerified = (user as User).isEmailVerified
      }
      return token
    },
    async session({ session, token }: { session: Session; token: CustomToken }) {
      if (session.user) {
        session.user.id = token.sub as string
        ;(session.user as any).role = token.role as string
        ;(session.user as any).isEmailVerified = token.isEmailVerified as boolean
      }
      return session
    },
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions as any)

export { handler as GET, handler as POST, authOptions }
