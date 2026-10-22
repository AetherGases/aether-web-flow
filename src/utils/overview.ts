import type { OverviewAlert, OverviewMetric, RecentAnalysis, PlantPerformance } from '../types/overview.ts'

export const anomalyPolicy = { window: 30, warning: 2, critical: 3 } as const

export function evaluateDeviation(current: number, history: readonly number[]) {
  const baseline = history.slice(-anomalyPolicy.window)
  if (!Number.isFinite(current) || baseline.length < anomalyPolicy.window || baseline.some((value) => !Number.isFinite(value))) return null
  let count = 0
  let mean = 0
  let sumSquares = 0
  for (const value of baseline) {
    count++
    const delta = value - mean
    mean += delta / count
    sumSquares += delta * (value - mean)
  }
  const deviation = Math.sqrt(sumSquares / (count - 1))
  if (!Number.isFinite(deviation) || deviation <= 0) return null
  const score = Math.abs((current - mean) / deviation)
  if (!Number.isFinite(score)) return null
  const level: 'critical' | 'warning' | null = score >= anomalyPolicy.critical ? 'critical' : score >= anomalyPolicy.warning ? 'warning' : null
  return { mean, deviation, score, level }
}

export interface StatisticalReading {
  id: string
  name: string
  plantName: string
  unit: string
  current: number
  history: readonly number[]
}

export function buildStatisticalAlerts(readings: readonly StatisticalReading[]): OverviewAlert[] {
  const alerts: OverviewAlert[] = []
  for (const reading of readings) {
    const result = evaluateDeviation(reading.current, reading.history)
    if (!result?.level) continue
    alerts.push({
      id: reading.id,
      title: `${reading.name} fora da faixa de referência`,
      description: `${reading.plantName}: ${reading.current.toLocaleString('pt-BR')} ${reading.unit} (${result.score.toFixed(1)} desvios padrão da média).`,
      level: result.level,
    })
  }
  return alerts.sort((a, b) => Number(b.level === 'critical') - Number(a.level === 'critical'))
}

export function buildAnalystMetrics(analyses: readonly RecentAnalysis[], alerts: readonly OverviewAlert[]): OverviewMetric[] {
  const entries = [
    { id: 'completed-analyses', label: 'Análises concluídas', count: analyses.filter((analysis) => analysis.status === 'completed').length },
    { id: 'processing-analyses', label: 'Em processamento', count: analyses.filter((analysis) => analysis.status === 'processing').length },
    { id: 'failed-analyses', label: 'Análises com falha', count: analyses.filter((analysis) => analysis.status === 'failed').length },
    { id: 'critical-anomalies', label: 'Alertas críticos', count: alerts.filter((alert) => alert.level === 'critical').length },
  ]
  return entries.map(({ id, label, count }) => ({ id, label, value: String(count), currentValue: count, previousValue: 0, positiveDirection: id === 'completed-analyses' ? 'increase' : 'decrease' }))
}
export function buildAdministratorMetrics(analyses: readonly RecentAnalysis[], plants: readonly PlantPerformance[], alerts: readonly OverviewAlert[]): OverviewMetric[] {
  const economy = plants.reduce((total, plant) => total + plant.economyAmount, 0)
  const number = new Intl.NumberFormat('pt-BR')
  return [
    { id: 'total-economy', label: 'Economia informada', value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact', maximumFractionDigits: 2 }).format(economy), currentValue: economy, previousValue: 0, positiveDirection: 'increase' },
    { id: 'completed-analyses', label: 'Análises concluídas', value: number.format(analyses.filter((analysis) => analysis.status === 'completed').length), currentValue: analyses.filter((analysis) => analysis.status === 'completed').length, previousValue: 0, positiveDirection: 'increase' },
    { id: 'available-plants', label: 'Plantas no comparativo', value: number.format(plants.length), currentValue: plants.length, previousValue: 0, positiveDirection: 'increase' },
    { id: 'critical-anomalies', label: 'Alertas críticos', value: number.format(alerts.filter((alert) => alert.level === 'critical').length), currentValue: alerts.filter((alert) => alert.level === 'critical').length, previousValue: 0, positiveDirection: 'decrease' },
  ]
}