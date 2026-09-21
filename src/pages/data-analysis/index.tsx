import { useState } from 'react'

import Sidebar from '../../components/Sidebar'
import type { OverviewData } from '../../types/overview'
import * as S from './styles'

const plantOptions = [
  { value: 'plant-01', label: 'Planta 01' },
  { value: 'plant-02', label: 'Planta 02' },
  { value: 'plant-04', label: 'Planta 04' },
  { value: 'plant-07', label: 'Planta 07' },
]

const periodOptions = [
  { value: '30-days', label: 'Últimos 30 dias' },
  { value: '3-months', label: 'Últimos 3 meses' },
  { value: '6-months', label: 'Últimos 6 meses' },
  { value: '12-months', label: 'Últimos 12 meses' },
]

const metrics = [
  { id: 'records', icon: '▦', label: 'Registros', value: '12.480', variation: '12% vs. período anterior', status: 'positive' as const },
  { id: 'anomalies', icon: '!', label: 'Anomalias', value: '24', variation: '11% vs. período anterior', status: 'negative' as const },
  { id: 'savings', icon: '$', label: 'Economia potencial', value: 'R$ 340 mil', variation: '18% vs. período anterior', status: 'positive' as const },
  { id: 'efficiency', icon: '↗', label: 'Score de eficiência', value: '8,7/10', variation: '0,6 pts. vs. anterior', status: 'positive' as const },
]

const costs = [
  { label: 'Vapor', value: '36%', color: '#48e29b' },
  { label: 'Energia elétrica', value: '29%', color: '#b76cf4' },
  { label: 'Ar comprimido', value: '15%', color: '#7f9ee8' },
  { label: 'Outros', value: '20%', color: '#f2bb45' },
]

interface DataAnalysisPageProps {
  data: OverviewData
  onLogout: () => void
}

function DataAnalysisPage({ data, onLogout }: DataAnalysisPageProps) {
  const [selectedPlant, setSelectedPlant] = useState('plant-04')
  const [selectedPeriod, setSelectedPeriod] = useState('12-months')

  const selectedPlantLabel = plantOptions.find(({ value }) => value === selectedPlant)?.label ?? ''
  const selectedPeriodLabel = periodOptions.find(({ value }) => value === selectedPeriod)?.label ?? ''

  return (
    <S.Page>
      <Sidebar userName={data.userName} userRole={data.role} onLogout={onLogout} />

      <S.Content>
        <S.Header>
          <S.TitleArea>
            <S.Breadcrumb>Análise de dados - {selectedPlantLabel}</S.Breadcrumb>
            <h1> Análise de dados</h1>
          </S.TitleArea>

          <S.Filters aria-label="Filtros da análise">
            <S.Filter>
              <S.FilterIcon aria-hidden="true" />
              <S.Select aria-label="Selecionar planta" value={selectedPlant} onChange={(event) => setSelectedPlant(event.target.value)}>
                {plantOptions.map((plant) => <option key={plant.value} value={plant.value}>{plant.label}</option>)}
              </S.Select>
            </S.Filter>

            <S.Filter>
              <S.FilterIcon aria-hidden="true" />
              <S.Select aria-label="Selecionar período" value={selectedPeriod} onChange={(event) => setSelectedPeriod(event.target.value)}>
                {periodOptions.map((period) => <option key={period.value} value={period.value}>{period.label}</option>)}
              </S.Select>
            </S.Filter>
          </S.Filters>
        </S.Header>

        <S.MetricsGrid aria-label="Resumo da análise">
          {metrics.map((metric) => (
            <S.MetricCard key={metric.id}>
              <S.MetricIcon aria-hidden="true">{metric.icon}</S.MetricIcon>
              <S.MetricContent>
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
                <S.Variation $status={metric.status}>{metric.variation}</S.Variation>
              </S.MetricContent>
            </S.MetricCard>
          ))}
        </S.MetricsGrid>

        <S.DashboardGrid>
          <S.LeftColumn>
            <S.ChartCard>
              <S.CardHeader>
                <div><h2>Consumo por período</h2><p>─ Consumo (kWh) · ─ Média móvel (30d)</p></div>
                <S.ChartControls><button type="button">Diário</button><button type="button">kWh</button></S.ChartControls>
              </S.CardHeader>

              <S.Chart role="img" aria-label="Consumo crescente entre maio de 2023 e abril de 2024">
                <svg viewBox="0 0 760 330" preserveAspectRatio="none">
                  <defs><linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#48e29b" stopOpacity="0.24" /><stop offset="100%" stopColor="#48e29b" stopOpacity="0" /></linearGradient></defs>
                  <g className="grid-lines"><line x1="0" y1="55" x2="760" y2="55" /><line x1="0" y1="130" x2="760" y2="130" /><line x1="0" y1="205" x2="760" y2="205" /><line x1="0" y1="280" x2="760" y2="280" /></g>
                  <path className="area" d="M0 270 L35 250 L70 220 L105 240 L140 195 L175 225 L210 180 L245 165 L280 185 L315 135 L350 165 L385 130 L420 120 L455 145 L490 95 L525 105 L560 75 L595 110 L630 55 L665 95 L700 35 L735 85 L760 8 L760 330 L0 330 Z" />
                  <path className="trend" d="M0 258 C170 220 290 172 390 142 C510 105 620 70 760 40" />
                  <polyline className="consumption" points="0,270 35,250 70,220 105,240 140,195 175,225 210,180 245,165 280,185 315,135 350,165 385,130 420,120 455,145 490,95 525,105 560,75 595,110 630,55 665,95 700,35 735,85 760,8" />
                </svg>
                <S.ChartLabels aria-hidden="true"><span>Mai 23</span><span>Jul 23</span><span>Set 23</span><span>Nov 23</span><span>Jan 24</span><span>Mar 24</span><span>Abr 24</span></S.ChartLabels>
              </S.Chart>
              <S.ChartNote>✦ Abril apresentou 3 anomalias críticas e consumo acima da média.</S.ChartNote>
            </S.ChartCard>

            <S.BottomGrid>
              <S.CostCard>
                <h2>Distribuição de custos</h2>
                <S.CostContent>
                  <S.Donut><div><strong>R$ 1,89 mi</strong><span>Total</span></div></S.Donut>
                  <S.Legend>{costs.map((cost) => <li key={cost.label}><i style={{ backgroundColor: cost.color }} /><span>{cost.label}</span><strong>{cost.value}</strong></li>)}</S.Legend>
                </S.CostContent>
              </S.CostCard>

              <S.AppliedFiltersCard>
                <h2>Filtros aplicados</h2>
                <dl><div><dt>Período</dt><dd>{selectedPeriodLabel}</dd></div><div><dt>Planta</dt><dd>{selectedPlantLabel}</dd></div><div><dt>Métrica</dt><dd>Consumo de energia</dd></div></dl>
              </S.AppliedFiltersCard>
            </S.BottomGrid>
          </S.LeftColumn>

          <S.RightColumn>
            <S.InsightCard>
              <h2>△ Principal insight</h2>
              <S.InsightTitle>
                O consumo aumentou <strong>18%</strong> no turno noturno.
              </S.InsightTitle>
              <S.Divider />
              <p>Identificamos aumento consistente entre 22h e 6h, principalmente nos dias úteis.</p>
              <S.ImpactBox><span>Impacto estimado</span><strong>R$ 45 mil</strong></S.ImpactBox>
              <h3>Recomendação</h3>
              <p>Verifique equipamentos de maior carga e revise a programação operacional.</p>
              <S.PrimaryButton type="button">✦ Perguntar ao Assistente</S.PrimaryButton>
            </S.InsightCard>

            <S.ActionsCard>
              <S.PrimaryButton type="button">Exportar relatório</S.PrimaryButton>
              <S.SecondaryButton type="button">✦ Perguntar ao Assistente</S.SecondaryButton>
              <p>Relatório inclui dados filtrados, análises e recomendações.</p>
            </S.ActionsCard>
          </S.RightColumn>
        </S.DashboardGrid>
      </S.Content>
    </S.Page>
  )
}

export default DataAnalysisPage
