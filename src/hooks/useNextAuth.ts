"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import type { LoginCredentials, RegisterCredentials } from "@/types/auth"

export function useNextAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true)
      setError(null)

      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      })

      if (result?.error) {
        setError('Credenciais inválidas')
        return { success: false, error: 'Credenciais inválidas' }
      }

      // Redirect to dashboard on successful login
      router.push('/dashboard')
      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer login'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (credentials: RegisterCredentials) => {
    try {
      setIsLoading(true)
      setError(null)

      // First register the user via API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: credentials.name,
          email: credentials.email,
          password: credentials.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao criar conta')
      }

      // Then sign in the user
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      })

      if (result?.error) {
        setError('Erro ao fazer login após registro')
        return { success: false, error: 'Erro ao fazer login após registro' }
      }

      // Redirect based on email verification status
      if (data.user && !data.user.isEmailVerified) {
        router.push('/auth/verify-email')
      } else {
        router.push('/dashboard')
      }

      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar conta'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      setIsLoading(true)
      await signOut({ redirect: false })
      router.push('/auth/login')
    } catch (err) {
      console.error('Erro ao fazer logout:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  return {
    session,
    user: session?.user,
    isAuthenticated: !!session,
    isLoading: status === 'loading' || isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  }
}
