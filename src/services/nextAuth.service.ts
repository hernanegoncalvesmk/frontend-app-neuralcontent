import { signIn, signOut, getSession } from "next-auth/react"
import type { LoginCredentials, RegisterCredentials, AuthResponse } from "@/types/auth"

class NextAuthService {
  private readonly API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/v1'

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      })

      if (result?.error) {
        return {
          success: false,
          error: 'Credenciais inválidas',
        }
      }

      return {
        success: true,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao fazer login',
      }
    }
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.API_URL}/auth/register`, {
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
        return {
          success: false,
          error: data.message || 'Erro ao criar conta',
        }
      }

      return {
        success: true,
        user: data.user,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao criar conta',
      }
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut({ redirect: false })
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  async getSession() {
    try {
      return await getSession()
    } catch (error) {
      console.error('Erro ao obter sessão:', error)
      return null
    }
  }

  async forgotPassword(email: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Erro ao enviar email de recuperação',
        }
      }

      return {
        success: true,
        message: data.message || 'Email de recuperação enviado',
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao enviar email de recuperação',
      }
    }
  }

  async resetPassword(token: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Erro ao redefinir senha',
        }
      }

      return {
        success: true,
        message: data.message || 'Senha redefinida com sucesso',
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao redefinir senha',
      }
    }
  }

  async verifyEmail(token: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.API_URL}/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Erro ao verificar email',
        }
      }

      return {
        success: true,
        message: data.message || 'Email verificado com sucesso',
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao verificar email',
      }
    }
  }

  async resendVerificationEmail(email: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.API_URL}/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Erro ao reenviar email de verificação',
        }
      }

      return {
        success: true,
        message: data.message || 'Email de verificação reenviado',
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao reenviar email de verificação',
      }
    }
  }
}

export const nextAuthService = new NextAuthService()
