import { useMemo, useState } from 'react'

import Sidebar from '../../components/Sidebar'
import type { OverviewData } from '../../types/overview'
import * as S from './styles'

const periods = [3, 6, 12, 24]

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
})

interface CalculatorPageProps {
  data: OverviewData
  onLogout: () => void
}

function CalculatorPage({ data, onLogout }: CalculatorPageProps) {
  const [monthlyCost, setMonthlyCost] = useState(100000)
  const [reduction, setReduction] = useState(15)
  const [period, setPeriod] = useState(12)

  const monthlySavings = monthlyCost * (reduction / 100)
  const totalSavings = monthlySavings * period
  const newMonthlyCost = monthlyCost - monthlySavings

  const projection = useMemo(
    () => Array.from({ length: period }, (_, index) => monthlySavings * (index + 1)),
    [monthlySavings, period],
  )
  const projectionScale = Math.max(200000, ...projection)

  function handleMonthlyCostChange(value: string) {
    const parsedValue = Number(value)
    setMonthlyCost(Number.isFinite(parsedValue) && parsedValue >= 0 ? parsedValue : 0)
  }

  return (
    <S.Page>
      <Sidebar
        userName={data.userName}
        userRole={data.role}
        onLogout={onLogout}
      />

      <S.Content>
        <S.Header>
                  <h4 id='id-page'>Calculadora</h4>
                  <div>
                    < h1>Calculadora de redução de custos</h1>
                    <p>Simule cenários e visualize o impacto no seu orçamento.</p>
                  </div>
                </S.Header>

        <S.CalculatorGrid>
          <S.FormCard>
            <S.Field>
              <label htmlFor="monthly-cost">Custo mensal atual</label>
              <S.NumberInput
                id="monthly-cost"
                type="number"
                min="0"
                step="1000"
                value={monthlyCost}
                onChange={(event) => handleMonthlyCostChange(event.target.value)}
              />
            </S.Field>

            <S.Field>
              <S.RangeHeader>
                <label htmlFor="reduction">Redução estimada</label>
                <output htmlFor="reduction">{reduction}%</output>
              </S.RangeHeader>
              <S.RangeInput
                id="reduction"
                type="range"
                min="0"
                max="50"
                step="1"
                value={reduction}
                $progress={reduction * 2}
                onChange={(event) => setReduction(Number(event.target.value))}
              />
            </S.Field>

            <S.Field>
              <span>Período (meses)</span>
              <S.PeriodOptions aria-label="Selecione o período da projeção">
                {periods.map((option) => (
                  <S.PeriodButton
                    key={option}
                    type="button"
                    $active={period === option}
                    aria-pressed={period === option}
                    onClick={() => setPeriod(option)}
                  >
                    {option}m
                  </S.PeriodButton>
                ))}
              </S.PeriodOptions>
            </S.Field>

            <S.ExportButton type="button" onClick={() => window.print()}>
              Exportar PDF
            </S.ExportButton>
          </S.FormCard>

          <S.Results aria-live="polite">
            <S.TotalSavingsCard>
              <span>Economia total no período</span>
              <strong>{currencyFormatter.format(totalSavings)}</strong>
            </S.TotalSavingsCard>

            <S.SummaryGrid>
              <S.SummaryCard>
                <span>Economia mensal</span>
                <strong>{currencyFormatter.format(monthlySavings)}</strong>
              </S.SummaryCard>

              <S.SummaryCard>
                <span>Novo custo mensal</span>
                <strong>{currencyFormatter.format(newMonthlyCost)}</strong>
              </S.SummaryCard>
            </S.SummaryGrid>

            <S.ProjectionCard>
              <S.ProjectionHeader>
                <div>
                  <h2>Projeção mensal</h2>
                  <p>Economia acumulada em {period} meses</p>
                </div>
                <strong>{currencyFormatter.format(totalSavings)}</strong>
              </S.ProjectionHeader>

              <S.Bars aria-label={`Projeção de economia para ${period} meses`}>
                {projection.map((value, index) => (
                  <S.BarColumn key={`${period}-${index}`}>
                    <S.BarTrack>
                      <S.Bar
                        style={{
                          height: `${Math.max(8, (value / projectionScale) * 100)}%`,
                        }}
                        data-tooltip={currencyFormatter.format(value)}
                        aria-label={`Mês ${index + 1}: ${currencyFormatter.format(value)}`}
                        tabIndex={0}
                      />
                    </S.BarTrack>
                    <S.BarLabel>{index + 1}m</S.BarLabel>
                  </S.BarColumn>
                ))}
              </S.Bars>
            </S.ProjectionCard>
          </S.Results>
        </S.CalculatorGrid>
      </S.Content>
    </S.Page>
  )
}

export default CalculatorPage
