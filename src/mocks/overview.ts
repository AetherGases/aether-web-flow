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
      reduction: 22,
    },
    {
      id: 'plant-01',
      name: 'Planta 01',
      economy: 'R$ 280 mil',
      reduction: 19,
    },
    {
      id: 'plant-07',
      name: 'Planta 07',
      economy: 'R$ 190 mil',
      reduction: 15,
    },
    {
      id: 'plant-02',
      name: 'Planta 02',
      economy: 'R$ 150 mil',
      reduction: 12,
    },
    {
      id: 'plant-05',
      name: 'Planta 05',
      economy: 'R$ 120 mil',
      reduction: 9,
    },
    {
      id: 'plant-03',
      name: 'Planta 03',
      economy: 'R$ 90 mil',
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
// Dados demonstrativos utilizados pelas telas que ainda não foram integradas.
administratorOverviewMock.metrics = [
  { id: 'total-economy', label: 'Economia potencial', value: 'R$ 1,24 mi', currentValue: 1240000, previousValue: null, positiveDirection: 'increase' },
  { id: 'completed-analyses', label: 'Análises concluídas', value: '1', currentValue: 1, previousValue: null, positiveDirection: 'increase' },
  { id: 'available-plants', label: 'Plantas no comparativo', value: '6', currentValue: 6, previousValue: null, positiveDirection: 'increase' },
  { id: 'critical-anomalies', label: 'Alertas críticos', value: '1', currentValue: 1, previousValue: null, positiveDirection: 'decrease' },
]
analystOverviewMock.metrics = [
  { id: 'completed-analyses', label: 'Análises concluídas', value: '1', currentValue: 1, previousValue: null, positiveDirection: 'increase' },
  { id: 'processing-analyses', label: 'Em processamento', value: '1', currentValue: 1, previousValue: null, positiveDirection: 'decrease' },
  { id: 'failed-analyses', label: 'Análises com falha', value: '0', currentValue: 0, previousValue: null, positiveDirection: 'decrease' },
  { id: 'critical-anomalies', label: 'Alertas críticos', value: '0', currentValue: 0, previousValue: null, positiveDirection: 'decrease' },
]
