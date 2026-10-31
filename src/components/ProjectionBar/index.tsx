import { useState } from 'react'
import { useTranslation } from '../../hooks/useTranslation'
import * as S from './styles'

interface ProjectionBarProps { month: number; formattedValue: string; height: number }
export default function ProjectionBar({ month, formattedValue, height }: ProjectionBarProps) {
  const { t } = useTranslation()
  const [dismissed, setDismissed] = useState(false)
  const label = t('Mês {0}: {1}', { 0: month, 1: formattedValue })
  return <S.Bar role="img" tabIndex={0} aria-label={label} data-tooltip={label}
    $dismissed={dismissed} style={{ height: `${height}%` }}
    onFocus={() => setDismissed(false)} onPointerEnter={() => setDismissed(false)}
    onKeyDown={(event) => { if (event.key === 'Escape') { event.preventDefault(); setDismissed(true) } }} />
}
