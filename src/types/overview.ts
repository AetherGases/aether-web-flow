export type UserRole = 'analyst' | 'administrator'

export interface OverviewMetric {
  id: string
  label: string
  value: string
  currentValue: number
  previousValue: number
  positiveDirection: 'increase' | 'decrease'
}

export interface RecentAnalysis {
  id: string
  name: string
  date: string
  status: 'completed' | 'processing' | 'failed'
}

export interface OverviewAlert {
  id: string
  title: string
  description: string
  level: 'info' | 'warning' | 'critical'
}

export interface PlantPerformance {
  id: string
  name: string
  economy: string
  reduction: number
}

export interface OverviewData {
  userName: string
  role: UserRole
  metrics: OverviewMetric[]
  recentAnalyses: RecentAnalysis[]
  alerts: OverviewAlert[]
  plantPerformance: PlantPerformance[]
}