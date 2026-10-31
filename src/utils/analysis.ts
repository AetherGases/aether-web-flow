import type { UserRole } from '../types/overview'

export function getAnalysisScope(role: UserRole, scope: string | null): 'company' | 'plant' {
  return role === 'administrator' && scope === 'company' ? 'company' : 'plant'
}

export function isAnalysisScope(value: string): value is 'plant' | 'company' {
  return value === 'plant' || value === 'company'
}

export function validateReportFileName(name: string): string | null {
  return /\.xlsx$/i.test(name) ? null : 'Selecione um arquivo Excel (.xlsx).'
}
