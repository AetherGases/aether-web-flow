import { useEffect, useLayoutEffect, useState, type ReactNode } from 'react'
import { PreferencesContext } from '../preferences-context'
import { readPreferences, savePreferences } from '../../utils/preferences'

interface PreferencesProviderProps { children: ReactNode }

export default function PreferencesProvider({ children }: PreferencesProviderProps) {
  const [preferences, setPreferences] = useState(readPreferences)
  useLayoutEffect(() => {
    document.documentElement.dataset.highContrast = String(preferences.highContrast)
    document.documentElement.lang = preferences.language
  }, [preferences.highContrast, preferences.language])
  useEffect(() => { savePreferences(preferences) }, [preferences])
  return <PreferencesContext.Provider value={{
    highContrast: preferences.highContrast,
    language: preferences.language,
    setLanguage: (language) => setPreferences((current) => ({ ...current, language })),
    toggleHighContrast: () => setPreferences((current) => ({ ...current, highContrast: !current.highContrast })),
  }}>
    {children}
  </PreferencesContext.Provider>
}
