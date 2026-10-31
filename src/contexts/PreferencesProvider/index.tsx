import { useEffect, useLayoutEffect, useState, type ReactNode } from 'react'
import { PreferencesContext } from '../preferences-context'
import { readPreferences, savePreferences } from '../../utils/preferences'

interface PreferencesProviderProps { children: ReactNode }

export default function PreferencesProvider({ children }: PreferencesProviderProps) {
  const [preferences, setPreferences] = useState(readPreferences)
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = preferences.lightMode ? 'light' : 'dark'
    document.documentElement.dataset.highContrast = String(preferences.highContrast)
    document.documentElement.lang = preferences.language
  }, [preferences.lightMode, preferences.highContrast, preferences.language])
  useEffect(() => { savePreferences(preferences) }, [preferences])
  return <PreferencesContext.Provider value={{
    lightMode: preferences.lightMode,
    toggleLightMode: () => setPreferences((current) => ({ ...current, lightMode: !current.lightMode })),
    highContrast: preferences.highContrast,
    language: preferences.language,
    setLanguage: (language) => setPreferences((current) => ({ ...current, language })),
    toggleHighContrast: () => setPreferences((current) => ({ ...current, highContrast: !current.highContrast })),
  }}>
    {children}
  </PreferencesContext.Provider>
}
