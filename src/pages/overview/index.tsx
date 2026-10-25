import MetricCard from '../../components/MetricCard'
import Sidebar from '../../components/Sidebar'
import { useAuth } from '../../hooks/useAuth'
import { useOverview } from '../../hooks/useOverview'
import { inventoryStatusLabels, type OverviewSection } from '../../types/inventory'
import SectionState from '../../components/SectionState'
import * as S from './styles'
import AnaliseIcon from '../../assets/icons/analise-dados.svg'
import CalculadoraIcon from '../../assets/icons/calculator.svg'
import ChatbotIcon from '../../assets/icons/chatbot.svg'

function OverviewPage() {
  const { user, logout, retry: recoverSession } = useAuth()
  const { data, loading, sessionExpired, reload } = useOverview()
  if (!user) return null
  const isAdministrator = user.role === 'administrator'
  const analysisPath = isAdministrator ? '/data-analysis/select' : '/data-analysis/upload'
  const counts = data?.counts
  const history = data?.history
  const last = data?.lastSubmitted
  const retry = sessionExpired ? recoverSession : reload

  const countsValue = counts?.status === 'ready' ? counts.data : null
  const lastValue = last?.status === 'ready' ? last.data : null
  const countsState = loading ? 'loading' as const : counts?.status === 'ready' ? undefined : 'error' as const
  const lastState = loading ? 'loading' as const : last?.status !== 'ready' ? 'error' as const : last.data === null ? 'empty' as const : undefined
  const indicators = data?.indicators
  function statusMetric(id: string, label: string, result: OverviewSection<number> | null | undefined, description: string) {
    const value = result?.status === 'ready' ? result.data : undefined
    return { id, label, value: value?.toLocaleString('pt-BR') ?? '—', currentValue: value ?? 0, description, state: loading ? 'loading' as const : result?.status === 'ready' ? undefined : 'error' as const }
  }
  const submittedMetric = { id: 'submitted', label: 'Relatórios enviados', value: countsValue?.submittedCount.toLocaleString('pt-BR') ?? '—', currentValue: countsValue?.submittedCount ?? 0, description: 'Enviados por você', state: countsState }
  const metrics = isAdministrator ? [
    statusMetric('pending-review', 'Pendentes de revisão', indicators?.pendingReview?.status === 'ready' ? { status: 'ready', data: indicators.pendingReview.data.count } : indicators?.pendingReview, 'Outros funcionários do seu departamento'),
    { id: 'reviewed', label: 'Relatórios revisados por mim', value: countsValue?.reviewedCount.toLocaleString('pt-BR') ?? '—', currentValue: countsValue?.reviewedCount ?? 0, description: 'Revisões feitas por você', state: countsState },
    submittedMetric,
    { id: 'last-status', label: 'Situação do último envio', value: lastValue ? inventoryStatusLabels[lastValue.status] : '—', currentValue: 0, description: 'Situação informada no último envio', state: lastState },
  ] : [
    submittedMetric,
    statusMetric('awaiting-review', 'Aguardando revisão', indicators?.awaitingReview, 'Seus relatórios em revisão'),
    statusMetric('approved', 'Relatórios aprovados', indicators?.approved, 'Seus relatórios aprovados'),
    statusMetric('processing-failed', 'Falhas no processamento', indicators?.processingFailed, 'Seus relatórios com falha de processamento'),
  ]
  return <S.Page>
    <Sidebar userName={user.name} userRole={user.role} onLogout={() => { void logout() }} />
    <S.Content>
      <S.Header>
        <h4 id="id-page">{isAdministrator ? 'Painel do administrador' : 'Painel do analista'}</h4>
        <div><h1>Olá, {user.name}👋🏻</h1><p>Aqui está um resumo dos seus relatórios.</p></div>
      </S.Header>
      {sessionExpired && <S.StatePanel role="alert"><p>Sua sessão precisa ser verificada.</p><S.RetryButton type="button" onClick={recoverSession}>Verificar sessão</S.RetryButton></S.StatePanel>}
      <S.MetricsSection aria-label="Indicadores">
        <S.MetricsGrid>{metrics.map(({ id, label, value, currentValue, description, state }) => <MetricCard key={id}
          metric={{ id, label, value, currentValue, previousValue: null, positiveDirection: 'increase' }}
          description={description}
          state={state}
        />)}</S.MetricsGrid>
      </S.MetricsSection>
      <S.FastAcessSection aria-labelledby="fast-access-title">
        <p id="fast-access-title">Acesso rápido</p>
        <S.FastAcessGrid>
          <S.FastAcessDiv><S.Icon src={AnaliseIcon} alt="" aria-hidden="true" /><S.FastAcessContent><S.FastAcessLink to={analysisPath}>Análise de dados</S.FastAcessLink><p>{isAdministrator ? 'Escolha o tipo de análise' : 'Envie um relatório para análise'}</p></S.FastAcessContent></S.FastAcessDiv>
          <S.FastAcessDiv><S.Icon src={CalculadoraIcon} alt="" aria-hidden="true" /><S.FastAcessContent><S.FastAcessLink to="/calculator">Calculadora</S.FastAcessLink><p>Teste novos cenários</p></S.FastAcessContent></S.FastAcessDiv>
          <S.FastAcessDiv><S.Icon src={ChatbotIcon} alt="" aria-hidden="true" /><S.FastAcessContent><S.FastAcessLink to="/assistant">Assistente Aether</S.FastAcessLink><p>Converse com o Aether</p></S.FastAcessContent></S.FastAcessDiv>
        </S.FastAcessGrid>
      </S.FastAcessSection>
      <S.DashboardGrid>
        <S.PerformanceSection aria-labelledby="history-title">
          <S.PerformanceHeader>
            <h2 id="history-title">Meu histórico de relatórios</h2>
            <S.AnalysisLink to={analysisPath}>Nova análise</S.AnalysisLink>
          </S.PerformanceHeader>
          {history?.status === 'ready' ? <>
            <S.PerformanceTable>
              <thead><tr><th scope="col">Nome</th><th scope="col">Data</th><th scope="col">Situação</th></tr></thead>
              <tbody>{history.data.inventories.length === 0 ? <tr><td colSpan={3}><S.StatePanel><p>Você ainda não possui relatórios.</p></S.StatePanel></td></tr> : history.data.inventories.map((inventory, index) => <tr key={inventory.id}>
                <td><S.PlantIdentification><S.Position>{index + 1}</S.Position><span>{inventory.name}</span></S.PlantIdentification></td>
                <td><time dateTime={inventory.createdAt}>{inventory.createdAt.slice(0, 10).split('-').reverse().join('/')}</time></td>
                <td>{inventoryStatusLabels[inventory.status]}</td>
              </tr>)}</tbody>
            </S.PerformanceTable>
          </> : <SectionState loading={loading} error={!loading} description="Não foi possível carregar as informações dos relatórios." onRetry={retry} />}
        </S.PerformanceSection>
        <S.AlertsSection aria-labelledby="last-inventory-title">
          <S.AlertsHeader><h2 id="last-inventory-title">Resumo do último envio</h2></S.AlertsHeader>
          {last?.status === 'ready' ? <S.StatePanel>{last.data ? <>
            <p><strong>Relatório:</strong> {last.data.name}</p>
            <p><strong>Situação:</strong> {inventoryStatusLabels[last.data.status]}</p>
            <p><strong>Data de cadastro:</strong> <time dateTime={last.data.createdAt}>{last.data.createdAt.slice(0, 10).split('-').reverse().join('/')}</time></p>
            <p><strong>Tipo:</strong> {last.data.type === 'INPUT' ? 'Entrada' : 'Saída'}</p>
          </> : <p>Nenhum relatório enviado.</p>}</S.StatePanel> : <SectionState loading={loading} error={!loading} description="Não foi possível carregar as informações do último envio." onRetry={retry} />}
        </S.AlertsSection>
      </S.DashboardGrid>
    </S.Content>
  </S.Page>
}
export default OverviewPage