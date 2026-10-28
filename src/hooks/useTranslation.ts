import { useCallback } from 'react'
import { usePreferences } from './usePreferences'
import { locales, translate, translateLabel, formatReportDate } from '../translations/translate'

export function useTranslation() {
  const { language } = usePreferences()
  const t = useCallback((text: string, values?: Record<string, string | number>) => values ? translate(text, language, values) : translateLabel(text, language), [language])
  return { t, language, locale: locales[language], formatDate: (value: string) => formatReportDate(value, language) }
}
