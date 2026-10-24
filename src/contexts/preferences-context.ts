import { createContext } from 'react'

export interface PreferencesContextValue {
  highContrast: boolean
  toggleHighContrast: () => void
}
export const PreferencesContext = createContext<PreferencesContextValue | null>(null)
