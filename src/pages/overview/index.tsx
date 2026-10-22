import MetricCard from '../../components/MetricCard'
import Sidebar from '../../components/Sidebar'
import type { OverviewData } from '../../types/overview'
import * as S from './styles'
import AnaliseIcon from '../../assets/icons/analise-dados.svg'
import CalculadoraIcon from '../../assets/icons/calculator.svg'
import ChatbotIcon from '../../assets/icons/chatbot.svg'

const alertLevelLabel = {
  critical: 'Crítica',
  warning: 'Alta',
  info: 'Média',
}

const alertLevelSymbol = {
  critical: '△',
  warning: '△',
  info: 'ⓘ',
}

interface OverviewPageProps {
  data: OverviewData
  onLogout?: () => void
}

function OverviewPage({ data, onLogout }: OverviewPageProps) {
  const isAdministrator = data.role === 'administrator'
  const analysisPath = isAdministrator ? '/data-analysis/select' : '/data-analysis/upload'
  const statusLabel = { completed: 'Concluída', processing: 'Em processamento', failed: 'Falhou' }
  return (
    <S.Page>
      <Sidebar
        userName={data.userName}
        userRole={data.role}
        onLogout={onLogout}
      />

      <S.Content>
        <S.Header>
          <h4 id='id-page'>{data.role === 'administrator' ? 'Painel do administrador' : 'Painel do analista'}</h4>
          <div>
            <h1>Olá, {data.userName}👋🏻</h1>

            <p>
              {isAdministrator ? 'Acompanhe os indicadores e o desempenho das plantas.' : 'Acompanhe suas análises e os alertas relacionados ao seu trabalho.'}
            </p>
          </div>
        </S.Header>

        <S.MetricsSection aria-labelledby="metrics-title">
          <h2 id="metrics-title">Indicadores</h2>
          <S.MetricsGrid>
            {data.metrics.map((metric) => (
              <MetricCard key={metric.id} metric={metric} />
            ))}
          </S.MetricsGrid>
        </S.MetricsSection>

        <S.FastAcessSection aria-labelledby="fast-access-title">
          <h2 id="fast-access-title">Acesso rápido</h2>
          <S.FastAcessGrid>
            <S.FastAcessDiv>
              <S.Icon src={AnaliseIcon} alt="" aria-hidden="true" />

              <S.FastAcessContent>
                <S.FastAcessLink to={analysisPath}>
                  Análise de dados
                </S.FastAcessLink>

                <p>{isAdministrator ? 'Escolha o tipo de análise' : 'Envie um relatório para análise'}</p>
              </S.FastAcessContent>
            </S.FastAcessDiv>

            <S.FastAcessDiv>
              <S.Icon src={CalculadoraIcon} alt="" aria-hidden="true" />

              <S.FastAcessContent>
                <S.FastAcessLink to="/calculator">
                  Calculadora
                </S.FastAcessLink>

                <p>Teste novos cenários</p>
              </S.FastAcessContent>
            </S.FastAcessDiv>

            <S.FastAcessDiv>
              <S.Icon src={ChatbotIcon} alt="" aria-hidden="true" />

              <S.FastAcessContent>
                <S.FastAcessLink to="/assistant">
                  Assistente Aether
                </S.FastAcessLink>

                <p>Converse com o Aether</p>
              </S.FastAcessContent>
            </S.FastAcessDiv>
          </S.FastAcessGrid>
        </S.FastAcessSection>

        <S.DashboardGrid>
        {isAdministrator ? <S.PerformanceSection aria-labelledby="performance-title">
          <S.PerformanceHeader>
            <h2 id="performance-title">
              Desempenho por planta
            </h2>

            <S.AnalysisLink to={analysisPath}>
              Ver análise completa
            </S.AnalysisLink>
          </S.PerformanceHeader>

          {data.plantPerformance.length === 0 ? <p>Nenhuma planta disponível para comparação.</p> : <S.PerformanceTable>
            <thead>
              <tr>
                <th scope="col">Planta</th>
                <th scope="col">Economia</th>
                <th scope="col">Redução</th>
              </tr>
            </thead>

            <tbody>
              {data.plantPerformance.map((plant, index) => {
                return (
                  <tr key={plant.id}>
                    <td>
                      <S.PlantIdentification>
                        <S.Position>{index + 1}</S.Position>
                        <span>{plant.name}</span>
                      </S.PlantIdentification>
                    </td>

                    <td>{plant.economy}</td>

                    <td>
                      <S.ReductionValue>
                        {plant.reduction}%
                      </S.ReductionValue>

                    </td>
                  </tr>
                )
              })}
            </tbody>
          </S.PerformanceTable>}
        </S.PerformanceSection> : <S.PerformanceSection aria-labelledby="recent-analyses-title">
          <S.PerformanceHeader>
            <h2 id="recent-analyses-title">Minhas análises recentes</h2>
            <S.AnalysisLink to={analysisPath}>Nova análise</S.AnalysisLink>
          </S.PerformanceHeader>
          {data.recentAnalyses.length === 0 ? <p>Você ainda não possui análises.</p> : <S.RecentList>
            {data.recentAnalyses.map((analysis) => <li key={analysis.id}>
              <strong>{analysis.name}</strong>
              <span>{analysis.date}</span>
              <span>{statusLabel[analysis.status]}</span>
            </li>)}
          </S.RecentList>}
        </S.PerformanceSection>}

        <S.AlertsSection aria-labelledby="alerts-title">
          <S.AlertsHeader>
            <h2 id="alerts-title">
              Alertas prioritários
            </h2>

            <S.ViewAllLink to={analysisPath}>
              Ir para análises ›
            </S.ViewAllLink>
          </S.AlertsHeader>

          {data.alerts.length === 0 ? <p>Nenhum alerta disponível.</p> : <S.AlertList>
            {data.alerts.map((alert) => (
              <S.AlertItem key={alert.id}>
                <S.AlertIcon
                  $level={alert.level}
                  aria-hidden="true"
                >
                  {alertLevelSymbol[alert.level]}
                </S.AlertIcon>

                <S.AlertContent>
                  <strong>{alert.title}</strong>
                  <span>{alert.description}</span>
                </S.AlertContent>

                <S.SeverityBadge $level={alert.level}>
                  {alertLevelLabel[alert.level]}
                </S.SeverityBadge>
              </S.AlertItem>
            ))}
          </S.AlertList>}
        </S.AlertsSection>
        </S.DashboardGrid>
      </S.Content>
    </S.Page>
  )
}

export default OverviewPage