import type { InventoryStatus } from './inventory'
export interface ReportCatalog { id: number; name: string }
export interface ReportEmission { id: number; quantityCo2e: number; isReduction: boolean; scope?: ReportCatalog | null; category?: ReportCatalog | null; gas?: (ReportCatalog & { formula?: string | null }) | null }
export interface ReportReduction { id: number; quantityCo2e: number; isReduction: boolean; category?: ReportCatalog | null }
export interface InventoryReport {
  id: number; name: string; type: 'INPUT' | 'OUTPUT'; status: InventoryStatus
  description?: string | null; consolidationApproach?: string | null
  inventoryPeriodStart?: string | null; inventoryPeriodEnd?: string | null; validationMessage?: string | null
  emissions: ReportEmission[]; reductions: ReportReduction[]
}
export interface ReportAnalysis { defined_problem: string; solving_method: string; reasoning: string; recommended_gases: { scope: number; emission: number; reduction_percentage: number; name: string }[] }
export interface UploadSignature { signature: string; timestamp: number; apiKey: string; cloudName: string; cloudinaryFolder: string; cloudinaryResourceType: 'raw' }
export interface ReportInput { name: string; consolidationApproach: string; fileName: string; path: string }

