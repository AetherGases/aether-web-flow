import type { CostReductionForecast } from '../../types/calculator'
import { useTranslation } from '../../hooks/useTranslation'
import logo from '../../assets/logos/logo.svg'
import * as S from './styles'

interface CalculatorReportProps {
  forecast: CostReductionForecast
  userName: string
  exportedAt: Date | null
}

function CalculatorReport({ forecast, userName, exportedAt }: CalculatorReportProps) {
  const { t, locale } = useTranslation()
  const money = (value: number) => new Intl.NumberFormat(locale, { style: 'currency', currency: forecast.currency }).format(value)
  const percentage = new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 0 }).format(forecast.reductionPercentage / 100)

  return <S.Report data-calculator-report aria-label={t('Relatório da simulação')}>
    <S.PrintStyles />
    <header>
      <div className="brand"><img src={logo} alt="" /><span>aether</span></div>
      <span className="document-label">{t('Relatório da simulação')}</span>
    </header>
    <h1>{t('Calculadora de redução de custos')}</h1>
    <p className="intro">{t('Simule cenários e visualize o impacto no seu orçamento.')}</p>
    {exportedAt && <p className="issued-at">{t('Gerado em')} <time dateTime={exportedAt.toISOString()}>{new Intl.DateTimeFormat(locale, { dateStyle: 'short', timeStyle: 'short' }).format(exportedAt)}</time></p>}
    <p className="author">{t('Simulação de')} <strong>{userName}</strong></p>

    <section className="parameters" aria-label={t('Parâmetros da simulação')}>
      <h2>{t('Parâmetros da simulação')}</h2>
      <dl>
        <div><dt>{t('Custo mensal atual')}</dt><dd>{money(forecast.monthlyCost)}</dd></div>
        <div><dt>{t('Redução estimada')}</dt><dd>{percentage}</dd></div>
        <div><dt>{t('Período (meses)')}</dt><dd>{forecast.periodMonths}</dd></div>
      </dl>
    </section>

    <section className="results" aria-label={t('Resultados da simulação')}>
      <div className="total"><span>{t('Economia total no período')}</span><strong>{money(forecast.totalSavings)}</strong></div>
      <dl>
        <div><dt>{t('Economia mensal')}</dt><dd>{money(forecast.monthlySavings)}</dd></div>
        <div><dt>{t('Novo custo mensal')}</dt><dd>{money(forecast.newMonthlyCost)}</dd></div>
      </dl>
    </section>

    <table>
      <caption>{t('Projeção mensal')}</caption>
      <thead><tr><th scope="col">{t('Mês')}</th><th scope="col">{t('Economia acumulada')}</th></tr></thead>
      <tbody>{forecast.projection.map(({ month, accumulatedSavings }) => <tr key={month}>
        <th scope="row">{month}</th><td>{money(accumulatedSavings)}</td>
      </tr>)}</tbody>
    </table>
    <footer>
      <strong>Aether · {t('Calculadora de redução de custos')}</strong>
      <p>{t('Projeção estimada com base nos valores informados. Não representa garantia de economia.')}</p>
    </footer>
  </S.Report>
}

export default CalculatorReport
