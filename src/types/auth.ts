import { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      isEmailVerified: boolean
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    email: string
    name: string
    role: string
    isEmailVerified: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string
    isEmailVerified?: boolean
  }
}

export interface AuthUser {
  id: string
  email: string
  name: string
  role: string
  isEmailVerified: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface AuthResponse {
  success: boolean
  user?: AuthUser
  message?: string
  error?: string
}
