import type { LoginCredentials, LoginErrors } from '../types/auth'

export function validateLogin(credentials: LoginCredentials): LoginErrors {
  const errors: LoginErrors = {}
  const email = credentials.email.trim()
  if (!email || email.length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Informe um e-mail válido.'
  if (!credentials.password) errors.password = 'Informe sua senha.'
  else if (credentials.password.length > 128) errors.password = 'A senha deve ter até 128 caracteres.'
  return errors
}
