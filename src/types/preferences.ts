export const languages = ['pt-BR', 'en', 'es'] as const
export type Language = typeof languages[number]
export function isLanguage(value: string): value is Language {
  return languages.some((language) => language === value)
}
export interface Preferences {
  _versao: 2
  highContrast: boolean
  language: Language
}
