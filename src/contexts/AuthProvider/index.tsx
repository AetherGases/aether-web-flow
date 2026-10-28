import { useEffect, useRef, useState, type ReactNode } from 'react'
import * as authService from '../../services/auth'
import { AuthContext, type AuthContextValue } from '../auth-context'

interface AuthProviderProps { children: ReactNode }
type AuthState = Pick<AuthContextValue, 'user' | 'status' | 'error'>

function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({ user: null, status: 'loading', error: null })
  const [attempt, setAttempt] = useState(0)
  const revision = useRef(0)

  useEffect(() => {
    let active: AbortController | null = null
    function checkSession() {
      if (active) return
      const controller = new AbortController()
      active = controller
      const current = revision.current
      void authService.getSession(controller.signal).then((session) => {
        if (!controller.signal.aborted && current === revision.current) setState((previous) => ({
          user: session?.user ?? null,
          status: 'ready',
          error: !session && previous.user ? 'Sua sessão expirou. Entre novamente.' : null,
        }))
      }).catch((error: unknown) => {
        if (!controller.signal.aborted && current === revision.current) setState({ user: null, status: 'error', error: error instanceof Error ? error.message : 'Não foi possível recuperar sua sessão.' })
      }).finally(() => { active = null })
    }
    checkSession()
    const timer = window.setInterval(() => { if (document.visibilityState === 'visible') checkSession() }, 60000)
    window.addEventListener('focus', checkSession)
    return () => {
      active?.abort()
      window.clearInterval(timer)
      window.removeEventListener('focus', checkSession)
    }
  }, [attempt])

  async function login(credentials: Parameters<typeof authService.login>[0], signal?: AbortSignal) {
    const current = ++revision.current
    const session = await authService.login(credentials, signal)
    if (!signal?.aborted && current === revision.current) {
      ++revision.current
      setState({ user: session.user, status: 'ready', error: null })
    }
  }

  async function logout() {
    ++revision.current
    try {
      await authService.logout()
      ++revision.current
      setState({ user: null, status: 'ready', error: null })
    } catch (error) {
      ++revision.current
      setState((current) => ({ ...current, error: error instanceof Error ? error.message : 'Não foi possível sair.' }))
    }
  }

  return <AuthContext.Provider value={{ ...state, login, logout, updateName: (name) => {
    ++revision.current
    setState((current) => current.user ? { ...current, user: { ...current.user, name } } : current)
  }, retry: () => {
    setState({ user: null, status: 'loading', error: null })
    setAttempt((value) => value + 1)
  } }}>{children}</AuthContext.Provider>
}

export default AuthProvider
