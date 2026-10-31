import { messages } from './messages.ts'
import type { Language } from '../types/preferences.ts'

export const locales: Record<Language, string> = { 'pt-BR': 'pt-BR', en: 'en-US', es: 'es-ES' }
type Values = Record<string, string | number>

const sourceMessages = new Map<string, string>()
for (const [source, translations] of Object.entries(messages)) {
  for (const text of translations) if (!sourceMessages.has(text)) sourceMessages.set(text, source)
}
export function translate(text: string, language: Language, values: Values = {}): string {
  const source = Object.hasOwn(messages, text) ? text : sourceMessages.get(text) ?? text
  const translated = language === 'pt-BR' ? source : messages[source]?.[language === 'en' ? 0 : 1] ?? source
  return translated.replace(/\{(\w+)\}/g, (placeholder, key: string) => values[key] === undefined ? placeholder : String(values[key]))
}
export function translateLabel(text: string, language: Language): string {
  const plant = /^Planta (\d+)$/.exec(text)
  if (plant) return translate('Planta {0}', language, { 0: plant[1] })
  const comparison = /^(\d+)% (maior|menor) que o período anterior$/.exec(text)
  if (comparison) return translate(`{0}% ${comparison[2]} que o período anterior`, language, { 0: comparison[1] })
  return translate(text, language)
}
export function formatReportDate(value: string, language: Language, formatter = new Intl.DateTimeFormat(locales[language])): string {
  const [year, month, day] = value.slice(0, 10).split('-').map(Number)
  return formatter.format(new Date(year, month - 1, day))
}
