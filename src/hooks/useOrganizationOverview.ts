import { useEffect, useState } from 'react'
import { getOrganizationOverview } from '../services/overview'
import type { OrganizationOverview } from '../types/inventory'
import { HttpError } from '../services/http'

interface UseOrganizationOverviewResult {
  data: OrganizationOverview | null
  error: string | null
  sessionExpired: boolean
  loading: boolean
  reload: () => void
}

export function useOrganizationOverview(): UseOrganizationOverviewResult {
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState<{ data: OrganizationOverview | null; error: string | null; sessionExpired: boolean }>({ data: null, error: null, sessionExpired: false })
  useEffect(() => {
    const controller = new AbortController()
    void getOrganizationOverview(controller.signal).then((data) => {
      if (!controller.signal.aborted) setState({ data, error: null, sessionExpired: false })
    }).catch((error: unknown) => {
      if (!controller.signal.aborted) setState({ data: null, error: error instanceof Error ? error.message : 'Não foi possível carregar os relatórios.', sessionExpired: error instanceof HttpError && error.status === 401 })
    })
    return () => controller.abort()
  }, [attempt])
  return { ...state, loading: !state.data && !state.error, reload: () => {
    setState({ data: null, error: null, sessionExpired: false })
    setAttempt((current) => current + 1)
  } }
}