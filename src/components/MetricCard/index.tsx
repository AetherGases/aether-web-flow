import type { OverviewMetric } from '../../types/overview'
import * as S from './styles'

interface MetricCardProps {
  metric: OverviewMetric
}

function calculatePercentageChange(
  currentValue: number,
  previousValue: number,
) {
  if (previousValue === 0) {
    return null
  }

  return ((currentValue - previousValue) / previousValue) * 100
}

function MetricCard({ metric }: MetricCardProps) {
  const percentageChange = calculatePercentageChange(
    metric.currentValue,
    metric.previousValue,
  )

  if (percentageChange === null) {
    return (
      <S.Card>
        <S.Label>{metric.label}</S.Label>
        <S.Value>{metric.value}</S.Value>
        <S.NeutralVariation>Sem período anterior</S.NeutralVariation>
      </S.Card>
    )
  }

  const increased = percentageChange > 0
  const decreased = percentageChange < 0

  const isPositive =
    (metric.positiveDirection === 'increase' && increased) ||
    (metric.positiveDirection === 'decrease' && decreased)

  const isNeutral = percentageChange === 0

  const absolutePercentage = Math.abs(
    Math.round(percentageChange),
  )

  const comparisonText = increased
    ? `${absolutePercentage}% maior que o período anterior`
    : decreased
      ? `${absolutePercentage}% menor que o período anterior`
      : 'Sem alteração em relação ao período anterior'

  return (
    <S.Card>
      <S.Label>{metric.label}</S.Label>
      <S.Value>{metric.value}</S.Value>

      <S.Variation
        $status={
          isNeutral
            ? 'neutral'
            : isPositive
              ? 'positive'
              : 'negative'
        }
      >
        {comparisonText}
      </S.Variation>
    </S.Card>
  )
}

export default MetricCard