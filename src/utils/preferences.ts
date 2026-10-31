import { isLanguage, type Preferences } from '../types/preferences.ts'

export const preferencesKey = 'aether.preferences'

export function parsePreferences(value: string | null): Preferences {
  const defaults: Preferences = { _versao: 3, lightMode: false, highContrast: false, language: 'pt-BR' }
  if (!value) return defaults
  try {
    const data = JSON.parse(value) as { _versao?: number; lightMode?: boolean; highContrast?: boolean; language?: string } | null
    if (!data || ![1, 2, 3].includes(data._versao ?? 0) || typeof data.highContrast !== 'boolean') return defaults
    return { _versao: 3, lightMode: data._versao === 3 && data.lightMode === true, highContrast: data.highContrast, language: data.language && isLanguage(data.language) ? data.language : 'pt-BR' }
  } catch { return defaults }
}

export function readPreferences(storage?: Pick<Storage, 'getItem'>): Preferences {
  try { return parsePreferences((storage ?? window.localStorage).getItem(preferencesKey)) }
  catch { return { _versao: 3, lightMode: false, highContrast: false, language: 'pt-BR' } }
}

export function savePreferences(preferences: Preferences, storage?: Pick<Storage, 'setItem'>): void {
  try { (storage ?? window.localStorage).setItem(preferencesKey, JSON.stringify(preferences)) }
  catch { /* A preferência ainda funciona nesta sessão se o navegador bloquear o armazenamento. */ }
}
