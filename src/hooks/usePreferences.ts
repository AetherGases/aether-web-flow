import { useContext } from 'react'
import { PreferencesContext } from '../contexts/preferences-context'

export function usePreferences() {
  const preferences = useContext(PreferencesContext)
  if (!preferences) throw new Error('usePreferences deve ser usado dentro de PreferencesProvider.')
  return preferences
}
