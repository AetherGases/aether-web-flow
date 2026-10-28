import { useTranslation } from '../../hooks/useTranslation'
import { useCalculator } from '../../hooks/useCalculator'
import { useAuth } from '../../hooks/useAuth'
import Sidebar from '../../components/Sidebar'
import SectionState from '../../components/SectionState'
import { calculatorPeriods } from '../../utils/calculator'
import * as S from './styles'

function CalculatorPage() {
  const { t, locale } = useTranslation()
  const { user, logout, retry } = useAuth()
  const { inputs, setInputs, data, validationError, error, loading, sessionExpired, retry: retryForecast } = useCalculator()
  if (!user) return null
  const currencyFormatter = new Intl.NumberFormat(locale, { style: 'currency', currency: 'BRL' })
  const projectionScale = Math.max(1, ...(data?.projection.map((item) => item.accumulatedSavings) ?? []))
  const money = (value?: number) => value === undefined ? '—' : currencyFormatter.format(value)

  return (
    <S.Page>
      <Sidebar userName={user.name} userRole={user.role} onLogout={() => { void logout() }} />
      <S.Content>
        <S.Header>
          <h4 id="id-page">{t("Calculadora")}</h4>
          <div>
            <h1>{t("Calculadora de redução de custos")}</h1>
            <p>{t("Simule cenários e visualize o impacto no seu orçamento.")}</p>
          </div>
        </S.Header>
        <S.CalculatorGrid>
          <S.FormCard onSubmit={(event) => { event.preventDefault(); retryForecast() }}>
            <S.Field>
              <label htmlFor="monthly-cost">{t("Custo mensal atual")}</label>
              <S.NumberInput id="monthly-cost" type="number" min="0" step="0.01" value={inputs.monthlyCost}
                aria-invalid={Boolean(validationError)} aria-describedby={validationError ? 'calculator-validation' : undefined}
                onChange={(event) => setInputs((current) => ({ ...current, monthlyCost: event.target.value }))} />
              {validationError && <p id="calculator-validation" role="alert">{t(validationError)}</p>}
            </S.Field>
            <S.Field>
              <S.RangeHeader>
                <label htmlFor="reduction">{t("Redução estimada")}</label>
                <output htmlFor="reduction">{inputs.reductionPercentage}%</output>
              </S.RangeHeader>
              <S.RangeInput id="reduction" type="range" min="0" max="50" step="1" value={inputs.reductionPercentage}
                $progress={inputs.reductionPercentage * 2}
                onChange={(event) => setInputs((current) => ({ ...current, reductionPercentage: Number(event.target.value) }))} />
            </S.Field>
            <S.Field>
              <span>{t("Período (meses)")}</span>
              <S.PeriodOptions role="group" aria-label={t("Selecione o período da projeção")}>
                {calculatorPeriods.map((option) => (
                  <S.PeriodButton key={option} type="button" $active={inputs.periodMonths === option}
                    aria-pressed={inputs.periodMonths === option}
                    onClick={() => setInputs((current) => ({ ...current, periodMonths: option }))}>
                    {option}m
                  </S.PeriodButton>
                ))}
              </S.PeriodOptions>
            </S.Field>
            <S.ExportButton type="button" disabled={!data || loading} onClick={() => window.print()}>
              {t("Exportar PDF")}
            </S.ExportButton>
          </S.FormCard>
          <S.Results aria-live="polite" aria-busy={loading}>
            {loading && <p role="status">{t("Calculando simulação…")}</p>}
            {error && <SectionState error description={error} onRetry={sessionExpired ? retry : retryForecast} />}
            <S.TotalSavingsCard>
              <span>{t("Economia total no período")}</span>
              <strong>{money(data?.totalSavings)}</strong>
            </S.TotalSavingsCard>
            <S.SummaryGrid>
              <S.SummaryCard><span>{t("Economia mensal")}</span><strong>{money(data?.monthlySavings)}</strong></S.SummaryCard>
              <S.SummaryCard><span>{t("Novo custo mensal")}</span><strong>{money(data?.newMonthlyCost)}</strong></S.SummaryCard>
            </S.SummaryGrid>
            <S.ProjectionCard>
              <S.ProjectionHeader>
                <div>
                  <h2>{t("Projeção mensal")}</h2>
                  <p>{t("Economia acumulada em")}{" "}{inputs.periodMonths} {t("meses")}</p>
                </div>
                <strong>{money(data?.totalSavings)}</strong>
              </S.ProjectionHeader>
              {data && <S.Bars aria-label={t("Projeção de economia para {0} meses", { "0": data.periodMonths })}>
                {data.projection.map(({ month, accumulatedSavings }) => (
                  <S.BarColumn key={month}>
                    <S.BarTrack>
                      <S.Bar style={{ height: `${(accumulatedSavings / projectionScale) * 100}%` }}
                        data-tooltip={money(accumulatedSavings)}
                        aria-label={t("Mês {0}: {1}", { "0": month, "1": money(accumulatedSavings) })} tabIndex={0} />
                    </S.BarTrack>
                    <S.BarLabel>{month}m</S.BarLabel>
                  </S.BarColumn>
                ))}
              </S.Bars>}
            </S.ProjectionCard>
          </S.Results>
        </S.CalculatorGrid>
      </S.Content>
    </S.Page>
  )
}

export default CalculatorPage
