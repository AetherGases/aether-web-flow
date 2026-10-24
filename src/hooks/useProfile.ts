import { useEffect, useRef, useState } from 'react'
import { getProfile, updateProfile } from '../services/profile'
import { HttpError } from '../services/http'
import type { ProfileData, ProfileUpdate, ProfileErrors } from '../types/profile'
import { validateProfile } from '../utils/profile'
import { useAuth } from './useAuth'

interface ProfileState {
  data: ProfileData | null
  error: string | null
  saveError: string | null
  fieldErrors: ProfileErrors
  saving: boolean
  saved: boolean
  sessionExpired: boolean
}
interface UseProfileResult extends ProfileState {
  loading: boolean
  reload: () => void
  save: (changes: ProfileUpdate) => Promise<boolean>
}
export function useProfile(): UseProfileResult {
  const { updateName } = useAuth()
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState<ProfileState>({ data: null, error: null, saveError: null, saving: false, saved: false, sessionExpired: false, fieldErrors: {} })
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
  async function save(changes: ProfileUpdate): Promise<boolean> {
    if (activeSave.current || !state.data) return false
    const fieldErrors = validateProfile(changes)
    if (fieldErrors.name || fieldErrors.phone) {
      setState((current) => ({ ...current, fieldErrors, saveError: null, saved: false }))
      return false
    }
    const controller = new AbortController()
    activeSave.current = controller
    setState((current) => ({ ...current, saving: true, saved: false, saveError: null, fieldErrors: {} }))
    try {
      const updated = await updateProfile(changes, controller.signal)
      if (controller.signal.aborted) return false
      setState((current) => ({ ...current, data: current.data ? { ...current.data, ...updated } : null, saving: false, saved: true }))
      updateName(updated.fullName)
      return true
    } catch (error) {
      if (!controller.signal.aborted) setState((current) => ({ ...current, saving: false, saveError: error instanceof Error ? error.message : 'Não foi possível salvar o perfil.', sessionExpired: error instanceof HttpError && error.status === 401 }))
      return false
    } finally { if (activeSave.current === controller) activeSave.current = null }
  }
  return { ...state, loading: !state.data && !state.error, save, reload: () => {
    setState((current) => ({ ...current, data: null, error: null, saveError: null, saved: false, sessionExpired: false }))
    setAttempt((current) => current + 1)
  } }
}
