import { createContext } from 'react'
import type { LoginCredentials, SessionUser } from '../types/auth'

export interface AuthContextValue {
  user: SessionUser | null
  status: 'loading' | 'ready' | 'error'
  error: string | null
  login: (credentials: LoginCredentials, signal?: AbortSignal) => Promise<void>
  logout: () => Promise<void>
  retry: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
