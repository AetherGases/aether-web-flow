import { useTranslation } from '../../hooks/useTranslation'
import type { UserRole } from '../../types/overview'
import * as S from './styles'

interface RoleBadgeProps {
  role: UserRole
}

function RoleBadge({ role }: RoleBadgeProps) {
  const { t } = useTranslation()
  return (
    <S.Badge>
      {role === 'administrator' ? t("Administrador") : t("Analista")}
    </S.Badge>
  )
}

export default RoleBadge
