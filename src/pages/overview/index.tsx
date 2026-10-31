import { useReportDateFormatter } from '../../hooks/useReportDateFormatter'
import InventoryStatus from '../../components/InventoryStatus'
import { useTranslation } from '../../hooks/useTranslation'
import MetricCard from '../../components/MetricCard'
import Sidebar from '../../components/Sidebar'
import { useAuth } from '../../hooks/useAuth'
import { useOverview } from '../../hooks/useOverview'
import { type OverviewSection } from '../../types/inventory'
import SectionState from '../../components/SectionState'
import * as S from './styles'
import AnaliseIcon from '../../assets/icons/analise-dados.svg'
import CalculadoraIcon from '../../assets/icons/calculator.svg'
import ChatbotIcon from '../../assets/icons/chatbot.svg'

function OverviewPage() {
  const { t, locale } = useTranslation()
  const formatDate = useReportDateFormatter()
  const { user, logout, retry: recoverSession } = useAuth()
  const { data, loading, sessionExpired, reload } = useOverview()
  if (!user) return null
  const analysisPath = '/data-analysis/upload/plant'
  const counts = data?.counts
  const history = data?.history
  const last = data?.lastSubmitted
  const retry = sessionExpired ? recoverSession : reload

  const countsValue = counts?.status === 'ready' ? counts.data : null
  const countsState = loading ? 'loading' as const : counts?.status === 'ready' ? undefined : 'error' as const

  const indicators = data?.indicators
  function statusMetric(id: string, label: string, result: OverviewSection<number> | null | undefined, description: string) {
    const value = result?.status === 'ready' ? result.data : undefined
    return { id, label, value: value?.toLocaleString(locale) ?? '—', currentValue: value ?? 0, description, state: loading ? 'loading' as const : result?.status === 'ready' ? undefined : 'error' as const }
  }
  const submittedMetric = { id: 'submitted', label: t("Relatórios enviados"), value: countsValue?.submittedCount.toLocaleString(locale) ?? '—', currentValue: countsValue?.submittedCount ?? 0, description: t("Enviados por você"), state: countsState }
  const metrics = [
    submittedMetric,
    statusMetric('awaiting-review', t("Aguardando revisão"), indicators?.awaitingReview, t("Seus relatórios em revisão")),
    statusMetric('approved', t("Relatórios aprovados"), indicators?.approved, t("Seus relatórios aprovados")),
    statusMetric('processing-failed', t("Falhas no processamento"), indicators?.processingFailed, t("Seus relatórios com falha de processamento")),
  ]
  return <S.Page>
    <Sidebar userName={user.name} userRole={user.role} onLogout={() => { void logout() }} />
    <S.Content id="main-content">
      <S.Header>
        <p data-page-eyebrow id="id-page">{t("Painel do analista")}</p>
        <div><h1>{t("Olá,")}{" "}{user.name}👋🏻</h1><p>{t("Aqui está um resumo dos seus relatórios.")}</p></div>
      </S.Header>
      {sessionExpired && <S.StatePanel role="alert"><p>{t("Sua sessão precisa ser verificada.")}</p><S.RetryButton type="button" onClick={recoverSession}>{t("Verificar sessão")}</S.RetryButton></S.StatePanel>}
      <S.MetricsSection aria-label={t("Indicadores")}>
        <S.MetricsGrid>{metrics.map(({ id, label, value, currentValue, description, state }) => <MetricCard key={id}
          metric={{ id, label, value, currentValue, previousValue: null, positiveDirection: 'increase' }}
          description={description}
          state={state}
        />)}</S.MetricsGrid>
      </S.MetricsSection>
      <S.FastAcessSection aria-labelledby="fast-access-title">
        <p id="fast-access-title">{t("Acesso rápido")}</p>
        <S.FastAcessGrid>
          <S.FastAcessDiv><S.Icon src={AnaliseIcon} alt="" aria-hidden="true" /><S.FastAcessContent><S.FastAcessLink to={analysisPath}>{t("Análise de dados")}</S.FastAcessLink><p>{t("Explore os dados dos seus relatórios")}</p></S.FastAcessContent></S.FastAcessDiv>
          <S.FastAcessDiv><S.Icon src={CalculadoraIcon} alt="" aria-hidden="true" /><S.FastAcessContent><S.FastAcessLink to="/calculator">{t("Calculadora")}</S.FastAcessLink><p>{t("Teste novos cenários")}</p></S.FastAcessContent></S.FastAcessDiv>
          <S.FastAcessDiv><S.Icon src={ChatbotIcon} alt="" aria-hidden="true" /><S.FastAcessContent><S.FastAcessLink to="/assistant">{t("Assistente Aether")}</S.FastAcessLink><p>{t("Converse com o Aether")}</p></S.FastAcessContent></S.FastAcessDiv>
        </S.FastAcessGrid>
      </S.FastAcessSection>
      <S.DashboardGrid>
        <S.PerformanceSection aria-labelledby="history-title">
          <S.PerformanceHeader>
            <h2 id="history-title">{t("Meu histórico de relatórios")}</h2>
            <S.AnalysisLink to="/data-analysis/upload/plant">{t("Nova análise")}</S.AnalysisLink>
          </S.PerformanceHeader>
          {history?.status === 'ready' ? <>
            <S.PerformanceTable>
              <thead><tr><th scope="col">{t("Nome")}</th><th scope="col">{t("Data")}</th><th scope="col">{t("Situação")}</th></tr></thead>
              <tbody>{history.data.inventories.length === 0 ? <tr><td colSpan={3}><S.StatePanel><p>{t("Você ainda não possui relatórios.")}</p></S.StatePanel></td></tr> : history.data.inventories.map((inventory, index) => <tr key={inventory.id}>
                <td><S.PlantIdentification><S.Position>{index + 1}</S.Position><span>{inventory.name}</span></S.PlantIdentification></td>
                <td><time dateTime={inventory.createdAt}>{formatDate(inventory.createdAt)}</time></td>
                <td><InventoryStatus status={inventory.status} /></td>
              </tr>)}</tbody>
            </S.PerformanceTable>
          </> : <SectionState loading={loading} error={!loading} description={t("Não foi possível carregar as informações dos relatórios.")} onRetry={retry} />}
        </S.PerformanceSection>
        <S.AlertsSection aria-labelledby="last-inventory-title">
          <S.AlertsHeader><h2 id="last-inventory-title">{t("Resumo do último envio")}</h2></S.AlertsHeader>
          {last?.status === 'ready' ? <S.StatePanel>{last.data ? <>
            <p><strong>{t("Relatório:")}</strong> {last.data.name}</p>
            <p><strong>{t("Situação:")}</strong> <InventoryStatus status={last.data.status} /></p>
            <p><strong>{t("Data de cadastro:")}</strong> <time dateTime={last.data.createdAt}>{formatDate(last.data.createdAt)}</time></p>
            <p><strong>{t("Tipo:")}</strong> {last.data.type === 'INPUT' ? t("Entrada") : t("Saída")}</p>
          </> : <p>{t("Nenhum relatório enviado.")}</p>}</S.StatePanel> : <SectionState loading={loading} error={!loading} description={t("Não foi possível carregar as informações do último envio.")} onRetry={retry} />}
        </S.AlertsSection>
      </S.DashboardGrid>
    </S.Content>
  </S.Page>
}
export default OverviewPage