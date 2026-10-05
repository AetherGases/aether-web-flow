import type { UserRole } from '../../types/overview'
import * as S from './styles'

interface RoleBadgeProps {
  role: UserRole
}

function RoleBadge({ role }: RoleBadgeProps) {
  return (
    <S.Badge>
      {role === 'administrator' ? 'Administrador' : 'Analista'}
    </S.Badge>
  )
}

export default RoleBadge
