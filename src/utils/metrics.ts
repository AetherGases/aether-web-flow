import type { OverviewMetric } from '../types/overview'

export function getMetricComparison(metric: OverviewMetric): { status: 'neutral' | 'positive' | 'negative'; text: string } | null {
  if (metric.previousValue === null || metric.previousValue === 0) return null
  const change = ((metric.currentValue - metric.previousValue) / metric.previousValue) * 100
  const positive = (metric.positiveDirection === 'increase' && change > 0) || (metric.positiveDirection === 'decrease' && change < 0)
  const percentage = Math.abs(Math.round(change))
  return {
    status: change === 0 ? 'neutral' : positive ? 'positive' : 'negative',
    text: change > 0 ? `${percentage}% maior que o período anterior` : change < 0 ? `${percentage}% menor que o período anterior` : 'Sem alteração em relação ao período anterior',
  }
}
