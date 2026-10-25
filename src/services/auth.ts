import type { AuthResponse, LoginCredentials, SessionUser } from '../types/auth'
import { validateLogin } from '../utils/validation'
import { HttpError, request } from './http'

function parseSession(value: unknown): AuthResponse {
  if (typeof value !== 'object' || value === null || !('user' in value)) throw new Error('Resposta de sessão inválida.')
  const user = value.user
  if (typeof user !== 'object' || user === null || !('id' in user) || !('name' in user) || !('email' in user) || !('role' in user) ||
      typeof user.id !== 'number' || !Number.isInteger(user.id) || user.id <= 0 || typeof user.name !== 'string' || typeof user.email !== 'string' ||
      (user.role !== 'analyst' && user.role !== 'administrator')) throw new Error('Resposta de sessão inválida.')
  const sessionUser: SessionUser = { id: user.id, name: user.name, email: user.email, role: user.role }
  return { user: sessionUser }
}

export async function login(credentials: LoginCredentials, signal?: AbortSignal): Promise<AuthResponse> {
  const errors = validateLogin(credentials)
  if (errors.email || errors.password) throw new Error(errors.email ?? errors.password)
  try {
    return parseSession(await request('/auth/login', { method: 'POST', body: JSON.stringify({ ...credentials, email: credentials.email.trim() }), signal }))
  } catch (error) {
    if (error instanceof Error) throw error
    throw new Error('Não foi possível entrar na sua conta.', { cause: error })
  }
}

export async function getSession(signal?: AbortSignal): Promise<AuthResponse | null> {
  try {
    return parseSession(await request('/auth/me', { signal }))
  } catch (error) {
    if (error instanceof HttpError && error.status === 401) return null
    if (error instanceof Error) throw error
    throw new Error('Não foi possível recuperar sua sessão.', { cause: error })
  }
}

export async function logout(): Promise<void> {
  try {
    await request('/auth/logout', { method: 'POST', body: '{}' })
  } catch (error) {
    if (error instanceof Error) throw error
    throw new Error('Não foi possível encerrar sua sessão.', { cause: error })
  }
}
