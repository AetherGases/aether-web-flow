import assert from 'node:assert/strict'
import { test } from 'node:test'
import { evaluateDeviation, buildStatisticalAlerts, buildAnalystMetrics, buildAdministratorMetrics } from '../src/utils/overview.ts'
const history = Array.from({ length: 30 }, (_, index) => index % 2 === 0 ? 95 : 105)

test('desvio amostral usa histórico separado e limites inclusivos de dois e três desvios', () => {
  const baseline = evaluateDeviation(100, history)
  assert(baseline)
  assert.equal(baseline.mean, 100)
  assert(Math.abs(baseline.deviation - Math.sqrt(750 / 29)) < 1e-10)
  assert.equal(baseline.level, null)
  assert.equal(evaluateDeviation(100 + 2.1 * baseline.deviation, history)?.level, 'warning')
  assert.equal(evaluateDeviation(100 - 3.1 * baseline.deviation, history)?.level, 'critical')
  assert.equal(evaluateDeviation(1000, history)?.mean, 100)
})

test('dados insuficientes, não finitos e histórico constante não geram score enganoso', () => {
  assert.equal(evaluateDeviation(100, [95, 105]), null)
  assert.equal(evaluateDeviation(NaN, history), null)
  assert.equal(evaluateDeviation(120, Array(30).fill(100)), null)
  assert.equal(evaluateDeviation(120, [...history.slice(1), Infinity]), null)
})

test('alertas calculados são ordenados por gravidade e ignoram leituras sem referência', () => {
  const alerts = buildStatisticalAlerts([
    { id: 'warning', name: 'Consumo', plantName: 'Planta 1', unit: 'm³', current: 112, history },
    { id: 'critical', name: 'Pressão', plantName: 'Planta 2', unit: 'bar', current: 120, history },
    { id: 'unknown', name: 'Consumo', plantName: 'Planta 3', unit: 'm³', current: 200, history: [] },
  ])
  assert.deepEqual(alerts.map((alert) => alert.id), ['critical', 'warning'])
  assert.equal(buildAnalystMetrics([], alerts).find((metric) => metric.id === 'critical-anomalies')?.currentValue, 1)
  assert.equal(buildAnalystMetrics([], []).length, 4)
})
test('indicadores administrativos agregam somente o conjunto fornecido e não inventam período anterior', () => {
  const metrics = buildAdministratorMetrics([{ id: 'a', name: 'A', date: '01/10/2026', status: 'processing' }], [{ id: 'p', name: 'P', economy: 'R$ 100', economyAmount: 100, reduction: 10 }], [])
  assert.equal(metrics.find((metric) => metric.id === 'total-economy')?.currentValue, 100)
  assert.equal(metrics.find((metric) => metric.id === 'completed-analyses')?.currentValue, 0)
  assert.equal(metrics.find((metric) => metric.id === 'available-plants')?.currentValue, 1)
  assert(metrics.every((metric) => metric.previousValue === 0))
})