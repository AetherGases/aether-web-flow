import { useCallback, useMemo } from 'react'
import { usePreferences } from './usePreferences'
import { formatReportDate, locales } from '../translations/translate'

export function useReportDateFormatter(): (value: string) => string {
  const { language } = usePreferences()
  // Este hook só é usado pelas telas que realmente exibem datas.
  const formatter = useMemo(() => new Intl.DateTimeFormat(locales[language]), [language])
  return useCallback((value: string) => formatReportDate(value, language, formatter), [formatter, language])
}
