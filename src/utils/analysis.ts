import type { UserRole } from '../types/overview'

export function getAnalysisScope(role: UserRole, scope: string | null): 'company' | 'plant' {
  return role === 'administrator' && scope === 'company' ? 'company' : 'plant'
}
