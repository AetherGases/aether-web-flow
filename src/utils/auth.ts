import type { UserRole } from '../types/overview'

export function getHomePath(role: UserRole): string {
  return role === 'administrator' ? '/data-analysis/select' : '/overview'
}
