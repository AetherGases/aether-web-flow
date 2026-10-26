import type { CostReductionInput, CostReductionForecast } from '../types/calculator.ts'
import { isMoney, validateCalculator } from '../utils/calculator.ts'
import { HttpError, request } from './http.ts'

export function parseForecast(data: CostReductionForecast, input: CostReductionInput): CostReductionForecast {
  if (!data || data.currency !== 'BRL' || data.monthlyCost !== input.monthlyCost ||
      data.reductionPercentage !== input.reductionPercentage || data.periodMonths !== input.periodMonths ||
      !isMoney(data.monthlySavings) || !isMoney(data.newMonthlyCost) || !isMoney(data.totalSavings) ||
      !Array.isArray(data.projection) || data.projection.length !== input.periodMonths ||
      data.projection.some((item, index) => !item || item.month !== index + 1 || !isMoney(item.accumulatedSavings)) ||
      data.projection.at(-1)?.accumulatedSavings !== data.totalSavings) {
    throw new Error('A calculadora retornou uma resposta incompatível. Tente novamente.')
  }
  return {
    ...input, currency: data.currency, monthlySavings: data.monthlySavings,
    newMonthlyCost: data.newMonthlyCost, totalSavings: data.totalSavings,
    projection: data.projection.map(({ month, accumulatedSavings }) => ({ month, accumulatedSavings })),
  }
}

export async function getCostReductionForecast(input: CostReductionInput, signal?: AbortSignal): Promise<CostReductionForecast> {
  const error = validateCalculator(input)
  if (error) throw new Error(error)
  try {
    return parseForecast(await request('/calculator/cost-reduction/forecast', {
      method: 'POST', signal, body: JSON.stringify({
        monthlyCost: input.monthlyCost, reductionPercentage: input.reductionPercentage, periodMonths: input.periodMonths,
      }),
    }) as CostReductionForecast, input)
  } catch (error) {
    if (error instanceof HttpError || (error instanceof DOMException && error.name === 'AbortError')) throw error
    throw new Error('A calculadora retornou uma resposta incompatível. Tente novamente.', { cause: error })
  }
}
