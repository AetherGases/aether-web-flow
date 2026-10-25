import type { UserRole } from './overview'

export interface LoginCredentials {
  email: string
  password: string
}

export interface SessionUser {
  id: number
  name: string
  email: string
  role: UserRole
}

export interface AuthResponse {
  user: SessionUser
}

export interface LoginErrors {
  email?: string
  password?: string
}
