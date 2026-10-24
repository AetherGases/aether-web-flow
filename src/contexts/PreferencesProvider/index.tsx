import { useEffect, useLayoutEffect, useState, type ReactNode } from 'react'
import { PreferencesContext } from '../preferences-context'
import { readPreferences, savePreferences } from '../../utils/preferences'

interface PreferencesProviderProps { children: ReactNode }

export default function PreferencesProvider({ children }: PreferencesProviderProps) {
  const [highContrast, setHighContrast] = useState(() => readPreferences().highContrast)
  useLayoutEffect(() => {
    document.documentElement.dataset.highContrast = String(highContrast)
  }, [highContrast])
  useEffect(() => {
    savePreferences({ _versao: 1, highContrast })
  }, [highContrast])
  return <PreferencesContext.Provider value={{ highContrast, toggleHighContrast: () => setHighContrast((current) => !current) }}>
    {children}
  </PreferencesContext.Provider>
}
