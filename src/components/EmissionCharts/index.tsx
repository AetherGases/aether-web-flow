import { useTranslation } from '../../hooks/useTranslation'
import { compactEmissionGroups, type EmissionGroup } from '../../utils/reports'
import * as S from './styles'

const colors = ['var(--color-brand-green)', 'var(--color-brand-purple)', 'var(--color-brand-blue)', 'var(--color-warning)', 'var(--color-danger)', 'var(--color-text-muted)']
interface ChartProps { groups: EmissionGroup[]; total: number }
export function EmissionBars({ groups, total }: ChartProps) {
  const { t, locale } = useTranslation()
  const number = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 })
  const visible = compactEmissionGroups(groups)
  const max = Math.max(...visible.map(item => item.value), 0)
  if (!groups.length) return <p>{t('Nenhuma emissão retornada para este relatório.')}</p>
  return <>
    <S.Bars>{visible.map(item => <li key={item.key}>
      <S.BarHeading><span>{item.key === 'unknown' || item.key === 'others' ? t(item.name) : item.name}</span><strong>{number.format(item.value)} tCO₂e</strong></S.BarHeading>
      <S.Track aria-hidden="true"><span style={{ width: max ? item.value / max * 100 + '%' : '0%' }} /></S.Track>
    </li>)}</S.Bars>
    <S.ChartNote>{t('Total do relatório')}: {number.format(total)} tCO₂e. {t('As barras comparam os valores; não representam uma evolução no tempo.')}</S.ChartNote>
  </>
}
export function EmissionDonut({ groups, total }: ChartProps) {
  const { t, locale } = useTranslation()
  const number = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 })
  const percent = new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 1 })
  const visible = compactEmissionGroups(groups)
  const segments = visible.map((item, index) => {
    const share = total > 0 ? Math.min(100, item.value / total * 100) : 0
    const offset = total > 0 ? visible.slice(0, index).reduce((sum, previous) => sum + previous.value, 0) / total * 100 : 0
    return { ...item, share, offset, color: colors[index % colors.length] }
  })
  if (!groups.length || total === 0) return <p>{t('Sem emissões positivas para distribuir no gráfico.')}</p>
  return <S.DonutLayout>
    <S.Donut>
      <svg viewBox="0 0 120 120" role="img" aria-label={t('Distribuição das emissões totais por gás')}>
        <circle cx="60" cy="60" r="46" fill="none" stroke="var(--color-border)" strokeWidth="14" />
        {segments.map(item => <circle key={item.key} cx="60" cy="60" r="46" fill="none" stroke={item.color} strokeWidth="14" pathLength="100" strokeDasharray={item.share + ' ' + (100 - item.share)} strokeDashoffset={-item.offset} transform="rotate(-90 60 60)"><title>{item.key === 'unknown' || item.key === 'others' ? t(item.name) : item.name}: {number.format(item.value)} tCO₂e ({percent.format(item.share / 100)})</title></circle>)}
      </svg>
      <div className="center"><strong>{number.format(total)}</strong><small>tCO₂e</small></div>
    </S.Donut>
    <S.Legend>{segments.map(item => <li key={item.key}><i aria-hidden="true" style={{ background: item.color }} /><span>{item.key === 'unknown' || item.key === 'others' ? t(item.name) : item.name}<small>{number.format(item.value)} tCO₂e</small></span><strong>{percent.format(item.share / 100)}</strong></li>)}</S.Legend>
  </S.DonutLayout>
}
