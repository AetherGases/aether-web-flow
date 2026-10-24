import { useEffect, useRef, useState } from 'react'
import { getProfile, updateProfile } from '../services/profile'
import { HttpError } from '../services/http'
import type { ProfileData, ProfileUpdate, ProfileErrors } from '../types/profile'
import { validateProfile } from '../utils/profile'
import { useAuth } from './useAuth'

interface ProfileState {
  data: ProfileData | null
  error: string | null
  notification: { type: 'success' | 'error'; message: string } | null
  fieldErrors: ProfileErrors
  saving: boolean
  sessionExpired: boolean
}
interface UseProfileResult extends ProfileState {
  loading: boolean
  reload: () => void
  dismissNotification: () => void
  save: (changes: ProfileUpdate) => Promise<boolean>
}
export function useProfile(): UseProfileResult {
  const { updateName } = useAuth()
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState<ProfileState>({ data: null, error: null, notification: null, saving: false, sessionExpired: false, fieldErrors: {} })
  const activeSave = useRef<AbortController | null>(null)
  useEffect(() => {
    const controller = new AbortController()
    void getProfile(controller.signal).then((data) => {
      if (!controller.signal.aborted) setState((current) => ({ ...current, data, error: null, sessionExpired: false }))
    }).catch((error: Error) => {
      if (!controller.signal.aborted) setState((current) => ({ ...current, error: error.message, sessionExpired: error instanceof HttpError && error.status === 401 }))
    })
    return () => { controller.abort(); activeSave.current?.abort() }
  }, [attempt])
  useEffect(() => {
    if (!state.notification) return
    const timer = window.setTimeout(() => setState((current) => ({ ...current, notification: null })), 3000)
    return () => window.clearTimeout(timer)
  }, [state.notification])

  async function save(changes: ProfileUpdate): Promise<boolean> {
    if (activeSave.current || !state.data) return false
    const fieldErrors = validateProfile(changes)
    if (fieldErrors.name || fieldErrors.phone) {
      setState((current) => ({ ...current, fieldErrors, notification: null }))
      return false
    }
    const controller = new AbortController()
    activeSave.current = controller
    setState((current) => ({ ...current, saving: true, notification: null, fieldErrors: {} }))
    try {
      const updated = await updateProfile(changes, controller.signal)
      if (controller.signal.aborted) return false
      setState((current) => ({ ...current, data: current.data ? { ...current.data, ...updated } : null, saving: false, notification: { type: 'success', message: 'Perfil atualizado com sucesso.' } }))
      updateName(updated.fullName)
      return true
    } catch (error) {
      if (!controller.signal.aborted) setState((current) => ({ ...current, saving: false, notification: { type: 'error', message: error instanceof Error ? error.message : 'Não foi possível salvar o perfil.' }, sessionExpired: error instanceof HttpError && error.status === 401 }))
      return false
    } finally { if (activeSave.current === controller) activeSave.current = null }
  }
  return { ...state, dismissNotification: () => setState((current) => ({ ...current, notification: null })), loading: !state.data && !state.error, save, reload: () => {
    setState((current) => ({ ...current, data: null, error: null, notification: null, sessionExpired: false }))
    setAttempt((current) => current + 1)
  } }
}
