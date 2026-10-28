import assert from 'node:assert/strict'
import { test } from 'node:test'
import { parseForecast, getCostReductionForecast } from '../src/services/calculator.ts'
import { validateCalculator } from '../src/utils/calculator.ts'
import { HttpError } from '../src/services/http.ts'

const input = { monthlyCost: 123.45, reductionPercentage: 15, periodMonths: 3 }
const forecast = {
  ...input, currency: 'BRL' as const, monthlySavings: 18.52, newMonthlyCost: 104.93, totalSavings: 55.56,
  projection: [{ month: 1, accumulatedSavings: 18.52 }, { month: 2, accumulatedSavings: 37.04 }, { month: 3, accumulatedSavings: 55.56 }],
}

test('calculadora valida entradas sem converter vazio, negativos ou casas extras em zero', () => {
  assert.equal(validateCalculator(input), null)
  assert.equal(validateCalculator({ monthlyCost: 0, reductionPercentage: 0, periodMonths: 24 }), null)
  for (const changes of [{ monthlyCost: NaN }, { monthlyCost: Infinity }, { monthlyCost: -1 }, { monthlyCost: 1.001 }, { reductionPercentage: 51 }, { reductionPercentage: 15.5 }, { periodMonths: 5 }]) {
    assert(validateCalculator({ ...input, ...changes }))
  }
})

test('resposta confirma os parâmetros e sequência completa, preserva centavos e descarta extras', () => {
  assert.deepEqual(parseForecast({ ...forecast, internal: 'not-public' } as typeof forecast, input), forecast)
  assert.throws(() => parseForecast({ ...forecast, monthlyCost: 100 }, input))
  assert.throws(() => parseForecast({ ...forecast, currency: 'USD' } as typeof forecast, input))
  assert.throws(() => parseForecast({ ...forecast, totalSavings: NaN }, input))
  assert.throws(() => parseForecast({ ...forecast, projection: forecast.projection.slice(1) }, input))
  assert.throws(() => parseForecast({ ...forecast, projection: [{ month: 2, accumulatedSavings: 18.52 }, ...forecast.projection.slice(1)] }, input))
  assert.throws(() => parseForecast({ ...forecast, totalSavings: 100 }, input))
})

test('serviço usa POST autenticado pelo cookie, envia somente entradas e não recalcula a resposta', async (t) => {
  const original = globalThis.fetch
  t.after(() => { globalThis.fetch = original })
  let calls = 0
  globalThis.fetch = async (url, options) => {
    calls++
    assert.equal(url, '/api/v1/calculator/cost-reduction/forecast')
    assert.equal(options?.method, 'POST')
    assert.equal(options?.credentials, 'same-origin')
    assert.deepEqual(JSON.parse(String(options?.body)), input)
    assert(!JSON.stringify(options?.headers).includes('Bearer'))
    return Response.json(forecast)
  }
  assert.deepEqual(await getCostReductionForecast(input), forecast)
  await assert.rejects(getCostReductionForecast({ ...input, monthlyCost: -1 }))
  assert.equal(calls, 1)
})

test('falha e cancelamento não são transformados em resultados fictícios', async (t) => {
  const original = globalThis.fetch
  t.after(() => { globalThis.fetch = original })
  globalThis.fetch = async () => Response.json({ error: { code: 'CALCULATOR_FORBIDDEN', message: 'Sem permissão' } }, { status: 403 })
  await assert.rejects(getCostReductionForecast(input), (error: Error) => error instanceof HttpError && error.status === 403)
  globalThis.fetch = async () => { throw new DOMException('Cancelled', 'AbortError') }
  await assert.rejects(getCostReductionForecast(input), { name: 'AbortError' })
})
