import { z } from 'zod'
import type { Config } from '../config/index.ts'
import { ApiError } from '../middleware/errors.ts'
import { createHttpClient } from './http.ts'

const money = z.number().nonnegative().refine((value) => {
  const cents = value * 100
  return Number.isSafeInteger(Math.round(cents)) &&
    Math.abs(cents - Math.round(cents)) <= Number.EPSILON * Math.max(1, cents) * 4
})
const fields = {
  monthlyCost: money,
  reductionPercentage: z.number().int().min(0).max(50),
  periodMonths: z.union([z.literal(3), z.literal(6), z.literal(12), z.literal(24)]),
}
export const forecastInputSchema = z.object(fields).strict()
const forecastSchema = z.object({
  ...fields, currency: z.literal('BRL'), monthlySavings: money, newMonthlyCost: money, totalSavings: money,
  projection: z.array(z.object({ month: z.number().int().min(1).max(24), accumulatedSavings: money })).min(3).max(24),
}).refine((data) => data.projection.length === data.periodMonths &&
  data.projection.every((item, index) => item.month === index + 1) &&
  data.projection.at(-1)?.accumulatedSavings === data.totalSavings)

export function createCalculatorService(config: Config) {
  return async function forecast(input: z.infer<typeof forecastInputSchema>, token: string, requestId: string) {
    if (!config.MS_CALCULATOR_URL) throw new ApiError(503, 'CALCULATOR_NOT_CONFIGURED', 'A calculadora está temporariamente indisponível.')
    const request = createHttpClient(config.MS_CALCULATOR_URL, config.UPSTREAM_TIMEOUT_MS, 'CALCULATOR')
    const parsed = forecastSchema.safeParse(await request('/api/calculator/cost-reduction/forecast', {
      method: 'POST', token, requestId, body: input,
    }))
    if (!parsed.success || parsed.data.monthlyCost !== input.monthlyCost ||
        parsed.data.reductionPercentage !== input.reductionPercentage || parsed.data.periodMonths !== input.periodMonths) {
      throw new ApiError(502, 'CALCULATOR_CONTRACT_INVALID', 'A calculadora retornou uma resposta incompatível. Tente novamente.')
    }
    return parsed.data
  }
}
