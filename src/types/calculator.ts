export interface CostReductionInput {
  monthlyCost: number
  reductionPercentage: number
  periodMonths: number
}

export interface CostReductionForecast extends CostReductionInput {
  currency: 'BRL'
  monthlySavings: number
  newMonthlyCost: number
  totalSavings: number
  projection: { month: number; accumulatedSavings: number }[]
}
