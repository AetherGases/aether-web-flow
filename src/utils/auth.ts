import type { UserRole } from '../types/overview'

export function getHomePath(role: UserRole): string {
  const homeByRole: Record<UserRole, string> = { analyst: '/overview', administrator: '/overview' }
  return homeByRole[role]
}
