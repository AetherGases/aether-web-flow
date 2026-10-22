import { buildAdministratorMetrics, buildAnalystMetrics, buildStatisticalAlerts } from '../utils/overview'
import type { OverviewData } from '../types/overview'

export const administratorOverviewMock: OverviewData = {
  userName: 'Fernanda',
  role: 'administrator',

  metrics: [],

  recentAnalyses: [
    {
      id: 'analysis-1',
      name: 'Planta Industrial SP',
      date: '05/09/2026',
      status: 'completed',
    },
    {
      id: 'analysis-2',
      name: 'Unidade Industrial GO',
      date: '03/09/2026',
      status: 'processing',
    },
  ],

  plantPerformance: [
    {
      id: 'plant-04',
      name: 'Planta 04',
      economy: 'R$ 340 mil',
      economyAmount: 340000,
      reduction: 22,
    },
    {
      id: 'plant-01',
      name: 'Planta 01',
      economy: 'R$ 280 mil',
      economyAmount: 280000,
      reduction: 19,
    },
    {
      id: 'plant-07',
      name: 'Planta 07',
      economy: 'R$ 190 mil',
      economyAmount: 190000,
      reduction: 15,
    },
    {
      id: 'plant-02',
      name: 'Planta 02',
      economy: 'R$ 150 mil',
      economyAmount: 150000,
      reduction: 12,
    },
    {
      id: 'plant-05',
      name: 'Planta 05',
      economy: 'R$ 120 mil',
      economyAmount: 120000,
      reduction: 9,
    },
    {
      id: 'plant-03',
      name: 'Planta 03',
      economy: 'R$ 90 mil',
      economyAmount: 90000,
      reduction: 7,
    },
  ],

  alerts: [],
}
// Fixtures de interface, não representam autorização nem respostas de API.
// Não reutilizar indicadores consolidados da empresa no fluxo de analista.
export const analystOverviewMock: OverviewData = {
  userName: 'Fernanda',
  role: 'analyst',
  recentAnalyses: [
    { id: 'my-analysis-1', name: 'Relatório de consumo', date: '05/09/2026', status: 'completed' },
    { id: 'my-analysis-2', name: 'Relatório de pressão', date: '03/09/2026', status: 'processing' },
  ],
  metrics: [],
  alerts: [],
  plantPerformance: [],
}
// Histórico sintético separado por variável/planta. A leitura atual não integra a referência.
const reference = Array.from({ length: 30 }, (_, index) => 100 + (index % 2 === 0 ? -5 : 5))
administratorOverviewMock.alerts = buildStatisticalAlerts([
  { id: 'consumption-04', name: 'Consumo', plantName: 'Planta 04', unit: 'm³', current: 120, history: reference },
  { id: 'consumption-02', name: 'Consumo', plantName: 'Planta 02', unit: 'm³', current: 112, history: reference },
])
administratorOverviewMock.metrics = buildAdministratorMetrics(administratorOverviewMock.recentAnalyses, administratorOverviewMock.plantPerformance, administratorOverviewMock.alerts)
analystOverviewMock.metrics = buildAnalystMetrics(analystOverviewMock.recentAnalyses, analystOverviewMock.alerts)