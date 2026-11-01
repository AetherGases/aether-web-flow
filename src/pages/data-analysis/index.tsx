import AnalysisMetricIcon from '../../components/AnalysisMetricIcon'
import { useEffect, useMemo, useState } from 'react'
import { flushSync } from 'react-dom'
import AnalysisReport from '../../components/AnalysisReport'
import { EmissionBars, EmissionDonut } from '../../components/EmissionCharts'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useTranslation } from '../../hooks/useTranslation'
import { useReport } from '../../hooks/useReport'
import { reportTotals, reportBreakdown } from '../../utils/reports'
import Sidebar from '../../components/Sidebar'
import InventoryStatus from '../../components/InventoryStatus'
import * as S from './styles'

export default function DataAnalysisPage() {
  const { user, logout } = useAuth()
  const { t, locale } = useTranslation()
  const [params] = useSearchParams()
  const raw = params.get('id')
  const id = raw && /^\d+$/.test(raw) && Number.isSafeInteger(Number(raw)) && Number(raw) > 0 ? Number(raw) : null
  const { report, analysis, loading, error, planError, paused, retry } = useReport(id)
  const data = useMemo(() => report ? { totals: reportTotals(report), breakdown: reportBreakdown(report) } : null, [report])
  const number = useMemo(() => new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }), [locale])
  const dateFormat = useMemo(() => new Intl.DateTimeFormat(locale, { timeZone: 'UTC' }), [locale])
  const [printPrepared, setPrintPrepared] = useState(false)
  useEffect(() => {
    // Native Ctrl+P also prepares the document synchronously.
    const prepare = () => flushSync(() => setPrintPrepared(true))
    window.addEventListener('beforeprint', prepare)
    return () => window.removeEventListener('beforeprint', prepare)
  }, [])
  async function exportPdf() {
    flushSync(() => setPrintPrepared(true))
    await Promise.all(Array.from(document.querySelectorAll<HTMLImageElement>('[data-analysis-report] img')).map(image => image.decode().catch(() => undefined)))
    window.print()
  }
  if (!user) return null
  if (!raw) return <Navigate to="/data-analysis/select" replace />
  const date = (value?: string | null) => value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? dateFormat.format(new Date(value + 'T00:00:00Z')) : t('Não informado')
  const finished = report && !['PROCESSING', 'PROCESSING_FAILED', 'INSUFFICIENT_DATA'].includes(report.status)
  return <S.Page>
    <Sidebar userName={user.name} userRole={user.role} onLogout={() => { void logout() }} />
    <S.Content id="main-content">
      <S.Header><div><S.Eyebrow>{t('Análise de dados')}</S.Eyebrow><S.Title>{t('Análise do relatório')}</S.Title>{report && <p>{report.name} · #{report.id}</p>}</div>{report && <S.Period><span>{t('Período do inventário')}</span><strong>{date(report.inventoryPeriodStart)} — {date(report.inventoryPeriodEnd)}</strong></S.Period>}</S.Header>
      <S.Actions><Link to="/data-analysis/select">← {t('Novo relatório')}</Link><button type="button" onClick={retry}>{t('Atualizar análise')}</button>{report && <InventoryStatus status={report.status} />}</S.Actions>
      {!id ? <p role="alert">{t('Selecione um relatório válido.')}</p> : loading ? <p role="status">{t('Carregando relatório…')}</p> : error ? <p role="alert">{t(error)}</p> : null}
      {report && <>
        {report.status === 'PROCESSING' && <S.Card role="status"><h2>{t('Análise em processamento')}</h2><p>{t(paused ? 'O processamento continua no servidor. Atualize a consulta para acompanhar.' : 'O relatório foi registrado. Aguarde enquanto o serviço processa o Excel; esta página será atualizada automaticamente.')}</p></S.Card>}
        {report.status === 'PROCESSING_FAILED' && <S.Card role="alert"><h2>{t('Falha no processamento')}</h2><p>{t('Não foi possível processar o relatório. O motivo deve ser verificado nos logs do serviço.')}</p></S.Card>}
        {report.status === 'INSUFFICIENT_DATA' && <S.Card role="alert"><h2>{t('Dados insuficientes')}</h2><p>{t('O serviço não encontrou todos os dados necessários. Confira o período e os dados de emissões no Excel antes de enviar uma versão corrigida.')}</p></S.Card>}
        {finished && data && <>
          <S.Metrics>{[
            { label: 'Emissões totais', value: number.format(data.totals.emissions), unit: 'tCO₂e', icon: 'emissions' as const },
            { label: 'Categorias identificadas', value: number.format(data.breakdown.categoryCount), unit: 'Categorias presentes nos registros', icon: 'categories' as const },
            { label: 'Registros de emissões', value: number.format(data.breakdown.records), unit: 'Dados extraídos do relatório', icon: 'records' as const },
            { label: 'Gases identificados', value: number.format(data.breakdown.gasCount), unit: 'Gases presentes nos registros', icon: 'gases' as const },
          ].map(metric => <S.Metric key={metric.label}><span className="icon" aria-hidden="true"><AnalysisMetricIcon kind={metric.icon} /></span><div className="value"><span>{t(metric.label)}</span><strong>{metric.value}</strong><small>{t(metric.unit)}</small></div></S.Metric>)}</S.Metrics>
          <S.Charts>
            <S.Card><h2>{t('Emissões por categoria')}</h2><S.Caption>{t('Distribuição das emissões no período do inventário')}</S.Caption><EmissionBars groups={data.breakdown.categories} total={data.totals.emissions} /></S.Card>
            <S.Card><h2>{t('Emissões por escopo')}</h2><S.Caption>{t('Valores consolidados por escopo, em tCO₂e')}</S.Caption><EmissionBars groups={data.breakdown.scopes} total={data.totals.emissions} /></S.Card>
          </S.Charts>
          <S.LowerGrid>
            <S.Card><h2>{t('Distribuição por gás')}</h2><S.Caption>{t('Participação nas emissões em CO₂ equivalente')}</S.Caption><EmissionDonut groups={data.breakdown.gases} total={data.totals.emissions} /></S.Card>
            <S.Card><h2>{t('Dados do relatório')}</h2><dl><div><dt>{t('Nome do relatório')}</dt><dd>{report.name}</dd></div><div><dt>{t('Período do inventário')}</dt><dd>{date(report.inventoryPeriodStart)} — {date(report.inventoryPeriodEnd)}</dd></div><div><dt>{t('Abordagem de consolidação')}</dt><dd>{t(report.consolidationApproach ?? 'Não informado')}</dd></div><div><dt>{t('Unidade de medida')}</dt><dd>tCO₂e</dd></div></dl></S.Card>
            <S.Card><h2>{t('Ações da análise')}</h2><S.ReportActions><button className="primary" type="button" disabled={!analysis} onClick={() => { void exportPdf() }}>{t('Exportar PDF')}</button><Link to="/assistant">{t('Perguntar ao Assistente')}</Link><p>{t('O PDF inclui os dados do inventário e o plano de melhoria disponíveis nesta análise.')}</p>{!analysis && <p>{t('A exportação será liberada quando o plano de melhoria estiver disponível.')}</p>}</S.ReportActions></S.Card>
          </S.LowerGrid>
          <S.Card><h2>{t('Plano de melhoria')}</h2>{report.description && <S.Caption>{report.description}</S.Caption>}{planError && <p role="status">{t(planError)}</p>}{!analysis && !planError && <p role="status">{t('Carregando análise…')}</p>}{analysis && <>
            <h3>{t('Problema identificado')}</h3><p>{analysis.defined_problem}</p><h3>{t('Método proposto')}</h3><p>{analysis.solving_method}</p>
            <details><summary>{t('Justificativa')}</summary><p>{analysis.reasoning}</p></details>
            {analysis.recommended_gases.length > 0 && <><h3>{t('Substituições recomendadas')}</h3><S.Recommendations>{analysis.recommended_gases.map((gas, index) => <div key={index}><strong>{gas.name}</strong><p>{t('Escopo')} {gas.scope}</p><p>{t('Emissão projetada')}: {number.format(gas.emission)} tCO₂e</p><p>{t('Redução estimada')}: {number.format(gas.reduction_percentage)}%</p></div>)}</S.Recommendations></>}
          </>}{report.validationMessage && <p>{report.validationMessage}</p>}</S.Card>
          <S.Card><h2>{t('Dados extraídos do relatório')}</h2><S.Table><table><thead><tr>{['Escopo', 'Categoria', 'Gás', 'Emissões (tCO₂e)'].map(text => <th key={text} scope="col">{t(text)}</th>)}</tr></thead><tbody>{report.emissions.filter(item => !item.isReduction).map(item => <tr key={item.id}><td>{item.scope?.name ?? t('Não informado')}</td><td>{item.category?.name ?? t('Não informado')}</td><td>{item.gas?.name ?? t('Não informado')}</td><td>{number.format(item.quantityCo2e)}</td></tr>)}</tbody></table></S.Table></S.Card>
        </>}
      </>}
    </S.Content>
    {printPrepared && finished && report && analysis && <AnalysisReport report={report} analysis={analysis} userName={user.name} />}
  </S.Page>
}
