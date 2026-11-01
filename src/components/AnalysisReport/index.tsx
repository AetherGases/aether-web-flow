import styled, { createGlobalStyle } from 'styled-components'
import type { InventoryReport, ReportAnalysis } from '../../types/report'
import { reportTotals } from '../../utils/reports'
import { useTranslation } from '../../hooks/useTranslation'
import logo from '../../assets/logos/icon-light.svg'

const PrintStyles = createGlobalStyle`
  @media print {
    @page { size: A4 portrait; margin: 16mm; }
    html, body, #root { background: white !important; color: #272039 !important; color-scheme: light; }
    body, #root { margin: 0; padding: 0; min-width: 0; width: 100%; min-height: 0 !important; max-width: none; border: 0 !important; display: block; }
    .skip-link, .visually-hidden { display: none !important; }
    :focus, :focus-visible { outline: none !important; box-shadow: none !important; }
  }
`
const Document = styled.article`
  display: none;
  @media print {
    display: block !important; font: 10pt/1.5 Arial, sans-serif; color: #272039 !important; background: white !important;
    text-align: left; overflow-wrap: anywhere;
    * { color: inherit !important; background: transparent !important; }
    header { display: flex; justify-content: space-between; align-items: center; gap: 10mm; border-bottom: 2pt solid #087b53; padding-bottom: 4mm; margin-bottom: 6mm; }
    header img { width: 18mm; height: auto; }
    h1, h2, h3 { letter-spacing: normal; }
    h1 { font: bold 22pt/1.2 Arial, sans-serif; margin: 0 0 3mm; }
    h2 { font: bold 13pt/1.3 Arial, sans-serif; margin: 6mm 0 2mm; break-after: avoid; }
    h3 { font: bold 10pt/1.3 Arial, sans-serif; margin: 3mm 0 1mm; break-after: avoid; }
    p { margin: 1mm 0 3mm; white-space: pre-wrap; orphans: 3; widows: 3; }
    .totals { display: flex; gap: 8mm; padding: 4mm 0; border-block: 1pt solid #b7adc9; margin-top: 5mm; }
    .totals strong { display: block; font-size: 16pt; }
    table { width: 100%; table-layout: fixed; border-collapse: collapse; font-size: 8.5pt; margin-top: 5mm; }
    caption { text-align: left; font: bold 13pt/1.3 Arial, sans-serif; padding-bottom: 3mm; break-after: avoid; }
    th:first-child { width: 13%; }
    th:nth-child(2) { width: 30%; }
    th:nth-child(3) { width: 35%; }
    th:last-child, td:last-child { width: 22%; text-align: right; white-space: nowrap; }
    th, td { padding: 2mm; border-bottom: .5pt solid #b7adc9; text-align: left; }
    thead { display: table-header-group; }
    tr { break-inside: avoid; }
    footer { margin-top: 6mm; padding-top: 3mm; border-top: 1pt solid #b7adc9; font-size: 8pt; }
  }
`
export default function AnalysisReport({ report, analysis, userName }: { report: InventoryReport; analysis: ReportAnalysis; userName: string }) {
  const { t, locale } = useTranslation()
  const format = (value: number) => new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value)
  const totals = reportTotals(report)
  const date = (value?: string | null) => value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Intl.DateTimeFormat(locale, { timeZone: 'UTC' }).format(new Date(value + 'T00:00:00Z')) : t('Não informado')
  return <Document data-analysis-report>
    <PrintStyles />
    <header><img src={logo} alt="Aether" /><span>{t('Análise do relatório')} · #{report.id}</span></header>
    <h1>{report.name}</h1><p>{t('Período do inventário')}: {date(report.inventoryPeriodStart)} — {date(report.inventoryPeriodEnd)}</p>
    <p>{t('Abordagem de consolidação')}: {t(report.consolidationApproach ?? 'Não informado')}</p>
    {report.description && <p>{report.description}</p>}
    <div className="totals"><div>{t('Emissões totais')}<strong>{format(totals.emissions)} tCO₂e</strong></div><div>{t('Reduções registradas')}<strong>{format(totals.reductions)} tCO₂e</strong></div></div>
    <h2>{t('Plano de melhoria')}</h2>
    <h3>{t('Problema identificado')}</h3><p>{analysis.defined_problem}</p>
    <h3>{t('Método proposto')}</h3><p>{analysis.solving_method}</p>
    <h3>{t('Justificativa')}</h3><p>{analysis.reasoning}</p>
    {analysis.recommended_gases.length > 0 && <><h3>{t('Substituições recomendadas')}</h3>{analysis.recommended_gases.map((gas, index) => <p key={index}>{gas.name} · {t('Escopo')} {gas.scope} · {t('Emissão projetada')}: {format(gas.emission)} tCO₂e · {t('Redução estimada')}: {format(gas.reduction_percentage)}%</p>)}</>}
    <table><caption>{t('Dados extraídos do relatório')}</caption><thead><tr>{['Escopo', 'Categoria', 'Gás', 'Emissões (tCO₂e)'].map(text => <th key={text} scope="col">{t(text)}</th>)}</tr></thead><tbody>{report.emissions.filter(item => !item.isReduction).map(item => <tr key={item.id}><td>{item.scope?.name ?? t('Não informado')}</td><td>{item.category?.name ?? t('Não informado')}</td><td>{item.gas?.name ?? t('Não informado')}</td><td>{format(item.quantityCo2e)}</td></tr>)}</tbody></table>
    <footer>Aether · {userName}<p>{t('Análise gerada por IA. Confira as recomendações antes de tomar decisões.')}</p></footer>
  </Document>
}
