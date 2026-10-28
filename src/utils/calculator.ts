import type { CostReductionInput } from '../types/calculator.ts'

export const calculatorPeriods = [3, 6, 12, 24]

export function isMoney(value: number): boolean {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) return false
  const cents = value * 100
  return Number.isSafeInteger(Math.round(cents)) &&
    Math.abs(cents - Math.round(cents)) <= Number.EPSILON * Math.max(1, cents) * 4
}

export function validateCalculator(input: CostReductionInput): string | null {
  if (!isMoney(input.monthlyCost)) return 'Informe um custo mensal válido, com até duas casas decimais.'
  if (!Number.isInteger(input.reductionPercentage) || input.reductionPercentage < 0 || input.reductionPercentage > 50) return 'Informe uma redução inteira entre 0 e 50%.'
  if (!calculatorPeriods.includes(input.periodMonths)) return 'Selecione um período de 3, 6, 12 ou 24 meses.'
  return null
}
