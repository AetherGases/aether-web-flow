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
  return (
    <S.Page>
      <Sidebar
        userName={data.userName}
        userRole={data.role}
        onLogout={onLogout}
      />

      <S.Content>
        <S.Header>
          <h4 id='id-page'>Painel do administrador</h4>
          <div>
            <h1>Olá, {data.userName}👋🏻</h1>

            <p>
              Aqui está um resumo da atividade recente.
            </p>
          </div>
        </S.Header>

        <S.MetricsSection aria-labelledby="metrics-title">
          <S.MetricsGrid>
            {data.metrics.map((metric) => (
              <MetricCard key={metric.id} metric={metric} />
            ))}
          </S.MetricsGrid>
        </S.MetricsSection>

        <S.FastAcessSection aria-labelledby="fast-access-title"> 
          <p>Acesso rápido</p>
          <S.FastAcessGrid>
            <S.FastAcessDiv>
              <S.Icon src={AnaliseIcon} alt="" aria-hidden="true" />

              <S.FastAcessContent>
                <S.FastAcessLink href="/analysis">
                  Análise de dados
                </S.FastAcessLink>

                <p>Veja as 24 ocorrências</p>
              </S.FastAcessContent>
            </S.FastAcessDiv>

            <S.FastAcessDiv>
              <S.Icon src={CalculadoraIcon} alt="" aria-hidden="true" />

              <S.FastAcessContent>
                <S.FastAcessLink href="/calculator">
                  Calculadora
                </S.FastAcessLink>

                <p>Teste novos cenários</p>
              </S.FastAcessContent>
            </S.FastAcessDiv>

            <S.FastAcessDiv>
              <S.Icon src={ChatbotIcon} alt="" aria-hidden="true" />

              <S.FastAcessContent>
                <S.FastAcessLink href="/assistant">
                  Assistente Aether
                </S.FastAcessLink>

                <p>Converse com o Aether</p>
              </S.FastAcessContent>
            </S.FastAcessDiv>
          </S.FastAcessGrid>
        </S.FastAcessSection>

        <S.DashboardGrid>
        <S.PerformanceSection aria-labelledby="performance-title">
          <S.PerformanceHeader>
            <h2 id="performance-title">
              Desempenho por planta
            </h2>

            <S.AnalysisLink href="/analysis">
              Ver análise completa
            </S.AnalysisLink>
          </S.PerformanceHeader>

          <S.PerformanceTable>
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
          </S.PerformanceTable>
        </S.PerformanceSection>

        <S.AlertsSection aria-labelledby="alerts-title">
          <S.AlertsHeader>
            <h2 id="alerts-title">
              Alertas prioritários
            </h2>

            <S.ViewAllLink href="/alerts">
              Ver todos ›
            </S.ViewAllLink>
          </S.AlertsHeader>

          <S.AlertList>
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
          </S.AlertList>
        </S.AlertsSection>
        </S.DashboardGrid>
      </S.Content>
    </S.Page>
  )
}

export default OverviewPage