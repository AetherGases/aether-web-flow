import type { OverviewMetric } from '../../types/overview'
import { getMetricComparison } from '../../utils/metrics'
import * as S from './styles'

interface MetricCardProps {
  metric: OverviewMetric
  state?: 'loading' | 'error' | 'unavailable' | 'empty'
  description?: string
}

function MetricCard({ metric, state, description }: MetricCardProps) {
  if (state) return <S.Card aria-busy={state === 'loading' || undefined} role={state === 'error' ? 'alert' : undefined}>
    <S.Label>{metric.label}</S.Label>
    <S.Value>{state === 'loading' ? '…' : '—'}</S.Value>
    <S.NeutralVariation>{state === 'loading' ? 'Carregando…' : state === 'error' ? 'Não foi possível carregar' : state === 'empty' ? 'Nenhum relatório enviado' : 'Dados indisponíveis'}</S.NeutralVariation>
  </S.Card>
  const comparison = getMetricComparison(metric)
  if (!comparison) {
    return <S.Card>
      <S.Label>{metric.label}</S.Label>
      <S.Value title={metric.value}>{metric.value}</S.Value>
      <S.NeutralVariation>{description ?? 'Sem período anterior'}</S.NeutralVariation>
    </S.Card>
  }

  return (
    <S.Card>
      <S.Label>{metric.label}</S.Label>
      <S.Value title={metric.value}>{metric.value}</S.Value>

      <S.Variation
        $status={comparison.status}
      >
        {comparison.text}
      </S.Variation>
    </S.Card>
  )
}

export default MetricCard