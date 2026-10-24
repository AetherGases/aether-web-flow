import type { Preferences } from '../types/preferences.ts'

export const preferencesKey = 'aether.preferences'

export function parsePreferences(value: string | null): Preferences {
  const defaults: Preferences = { _versao: 1, highContrast: false }
  if (!value) return defaults
  try {
    const data = JSON.parse(value) as Partial<Preferences> | null
    if (!data || data._versao !== 1 || typeof data.highContrast !== 'boolean') return defaults
    return { _versao: 1, highContrast: data.highContrast }
  } catch { return defaults }
}

export function readPreferences(storage?: Pick<Storage, 'getItem'>): Preferences {
  try { return parsePreferences((storage ?? window.localStorage).getItem(preferencesKey)) }
  catch { return { _versao: 1, highContrast: false } }
}

export function savePreferences(preferences: Preferences, storage?: Pick<Storage, 'setItem'>): void {
  try { (storage ?? window.localStorage).setItem(preferencesKey, JSON.stringify(preferences)) }
  catch { /* A preferência ainda funciona nesta sessão se o navegador bloquear o armazenamento. */ }
}
