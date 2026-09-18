import type { OverviewData } from '../types/overview'

export const analystOverviewMock: OverviewData = {
  userName: 'Fernanda',
  role: 'analyst',

  metrics: [
    {
      id: 'total-economy',
      label: 'Economia gerada',
      value: 'R$ 1,24 mi',
      currentValue: 1240000,
      previousValue: 1050000,
      positiveDirection: 'increase',
    },
    {
      id: 'completed-analyses',
      label: 'Análises realizadas',
      value: '312',
      currentValue: 312,
      previousValue: 279,
      positiveDirection: 'increase',
    },
    {
      id: 'active-plants',
      label: 'Plantas ativas',
      value: '48',
      currentValue: 48,
      previousValue: 44,
      positiveDirection: 'increase',
    },
    {
      id: 'critical-anomalies',
      label: 'Anomalias críticas',
      value: '24',
      currentValue: 24,
      previousValue: 20,
      positiveDirection: 'decrease',
    },
  ],

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

  alerts: [
    {
      id: 'alert-1',
      title: 'Consumo anômalo detectado na',
      description: 'Planta 04',
      level: 'critical',
    },
    {
      id: 'alert-2',
      title: 'Queda de eficiência na',
      description: 'Planta 02',
      level: 'warning',
    },
    {
      id: 'alert-3',
      title: 'Variação incomum de pressão na',
      description: 'Planta 07',
      level: 'info',
    },
    {
      id: 'alert-4',
      title: 'Manutenção preventiva recomendada na',
      description: 'Planta 05',
      level: 'warning',
    },
  ],
}