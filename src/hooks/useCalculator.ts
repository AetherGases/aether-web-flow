import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import { getCostReductionForecast } from '../services/calculator'
import { HttpError } from '../services/http'
import type { CostReductionForecast } from '../types/calculator'
import { validateCalculator } from '../utils/calculator'

interface CalculatorState {
  key: string
  data: CostReductionForecast | null
  error: string | null
  sessionExpired: boolean
}

interface CalculatorInputs { monthlyCost: string; reductionPercentage: number; periodMonths: number }
interface UseCalculatorResult {
  inputs: CalculatorInputs
  setInputs: Dispatch<SetStateAction<CalculatorInputs>>
  validationError: string | null
  data: CostReductionForecast | null
  error: string | null
  sessionExpired: boolean
  loading: boolean
  retry: () => void
}

export function useCalculator(): UseCalculatorResult {
  const [inputs, setInputs] = useState({ monthlyCost: '100000', reductionPercentage: 15, periodMonths: 12 })
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState<CalculatorState>({ key: '', data: null, error: null, sessionExpired: false })
  const monthlyCost = inputs.monthlyCost.trim() === '' ? NaN : Number(inputs.monthlyCost)
  const { reductionPercentage, periodMonths } = inputs
  const validationError = validateCalculator({ monthlyCost, reductionPercentage, periodMonths })
  const key = JSON.stringify([inputs.monthlyCost, reductionPercentage, periodMonths, attempt])

  useEffect(() => {
    if (validationError) return
    const controller = new AbortController()
    const timer = window.setTimeout(() => {
      void getCostReductionForecast({ monthlyCost, reductionPercentage, periodMonths }, controller.signal)
        .then((data) => {
          if (!controller.signal.aborted) setState({ key, data, error: null, sessionExpired: false })
        }).catch((error: Error) => {
          if (!controller.signal.aborted) setState({ key, data: null, error: error.message, sessionExpired: error instanceof HttpError && error.status === 401 })
        })
    }, 350)
    return () => { window.clearTimeout(timer); controller.abort() }
  }, [monthlyCost, reductionPercentage, periodMonths, validationError, key])

  const current = state.key === key
  return {
    inputs, setInputs, validationError,
    data: current && !validationError ? state.data : null,
    error: current ? state.error : null,
    sessionExpired: current && state.sessionExpired,
    loading: !validationError && (!current || (!state.data && !state.error)),
    retry: () => setAttempt((value) => value + 1),
  }
}
