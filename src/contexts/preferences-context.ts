import { createContext } from 'react'
import type { Language } from '../types/preferences'

export interface PreferencesContextValue {
  language: Language
  setLanguage: (language: Language) => void
  lightMode: boolean
  toggleLightMode: () => void
  highContrast: boolean
  toggleHighContrast: () => void
}
export const PreferencesContext = createContext<PreferencesContextValue | null>(null)
