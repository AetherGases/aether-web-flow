export const inventoryStatusLabels = {
  UNDER_REVIEW: 'Em revisão', APPROVED: 'Aprovado', REJECTED: 'Rejeitado',
  PROCESSING: 'Em processamento', PROCESSING_FAILED: 'Falha no processamento',
  REQUESTED: 'Solicitado', ISSUED: 'Emitido',
} as const
export type InventoryStatus = keyof typeof inventoryStatusLabels
export interface InventorySummary {
  id: number
  name: string
  createdAt: string
  status: InventoryStatus
  type: 'INPUT' | 'OUTPUT'
}
export type OverviewSection<T> = { status: 'ready'; data: T } | { status: 'error'; error: { code: string; message: string } }
export interface InventoryOverview {
  scope: 'personal'
  indicators: {
    awaitingReview: OverviewSection<number> | null
    approved: OverviewSection<number> | null
    processingFailed: OverviewSection<number> | null
    pendingReview: OverviewSection<{ count: number; scope: 'department' }> | null
  }
  counts: OverviewSection<{ reviewedCount: number; submittedCount: number }>
  history: OverviewSection<{ inventories: InventorySummary[]; totalCount: number }>
  lastSubmitted: OverviewSection<InventorySummary | null>
}
export interface OrganizationOverview {
  scope: 'department'
  reports: OverviewSection<{ inventories: InventorySummary[]; totalCount: number }>
  underReview: OverviewSection<number>
  approved: OverviewSection<number>
  rejected: OverviewSection<number>
}
