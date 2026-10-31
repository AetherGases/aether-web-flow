import { useEffect, useRef, useState, type FormEvent, type Dispatch, type SetStateAction } from 'react'
import type { LoginCredentials, LoginErrors } from '../types/auth'
import { validateLogin } from '../utils/validation'
import { useAuth } from './useAuth'
import { HttpError } from '../services/http'

interface UseLoginResult {
  form: LoginCredentials
  setForm: Dispatch<SetStateAction<LoginCredentials>>
  loading: boolean
  errors: LoginErrors
  error: string | null
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>
}

export function useLogin(): UseLoginResult {
  const { login, error: sessionError } = useAuth()
  const [form, setForm] = useState<LoginCredentials>({ email: '', password: '' })
  const [state, setState] = useState<{ loading: boolean; errors: LoginErrors; error: string | null }>({ loading: false, errors: {}, error: null })
  const active = useRef<AbortController | null>(null)
  useEffect(() => () => active.current?.abort(), [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (active.current) return
    const errors = validateLogin(form)
    if (errors.email || errors.password) { setState({ loading: false, errors, error: null }); return }
    const controller = new AbortController()
    active.current = controller
    setState({ loading: true, errors: {}, error: null })
    try {
      await login(form, controller.signal)
      if (!controller.signal.aborted) setForm((current) => ({ ...current, password: '' }))
    } catch (error) {
      if (!controller.signal.aborted) setState({ loading: false, errors: {}, error: error instanceof HttpError && [401, 403].includes(error.status) ? 'Senha incorreta.' : error instanceof Error ? error.message : 'Não foi possível entrar.' })
    } finally {
      active.current = null
      if (!controller.signal.aborted) setState((current) => ({ ...current, loading: false }))
    }
  }

  return { form, setForm, ...state, error: state.error ?? sessionError, handleSubmit }
}
