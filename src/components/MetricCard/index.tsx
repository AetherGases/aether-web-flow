import { useTranslation } from '../../hooks/useTranslation'
import type { OverviewMetric } from '../../types/overview'
import { getMetricComparison } from '../../utils/metrics'
import * as S from './styles'

interface MetricCardProps {
  metric: OverviewMetric
  state?: 'loading' | 'error' | 'unavailable' | 'empty'
  description?: string
}

function MetricCard({ metric, state, description }: MetricCardProps) {
  const { t } = useTranslation()
  if (state) return <S.Card aria-busy={state === 'loading' || undefined} role={state === 'error' ? 'alert' : undefined}>
    <S.Label>{t(metric.label)}</S.Label>
    <S.Value>{state === 'loading' ? '…' : '—'}</S.Value>
    <S.NeutralVariation>{state === 'loading' ? t("Carregando…") : state === 'error' ? t("Não foi possível carregar") : state === 'empty' ? t("Nenhum relatório enviado") : t("Dados indisponíveis")}</S.NeutralVariation>
  </S.Card>
  const comparison = getMetricComparison(metric)
  if (!comparison) {
    return <S.Card>
      <S.Label>{t(metric.label)}</S.Label>
      <S.Value title={t(metric.value)}>{t(metric.value)}</S.Value>
      <S.NeutralVariation>{t(description ?? "Sem período anterior")}</S.NeutralVariation>
    </S.Card>
  }

  return (
    <S.Card>
      <S.Label>{t(metric.label)}</S.Label>
      <S.Value title={t(metric.value)}>{t(metric.value)}</S.Value>

      <S.Variation
        $status={comparison.status}
      >
        {t(comparison.text)}
      </S.Variation>
    </S.Card>
  )
}

export default MetricCard