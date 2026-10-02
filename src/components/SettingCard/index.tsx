import type { ReactNode } from 'react'
import * as S from './styles'

interface SettingCardProps {
  label: string
  value?: string
  showArrow?: boolean
  children?: ReactNode
}

function SettingCard({
  label,
  value,
  showArrow = false,
  children,
}: SettingCardProps) {
  return (
    <S.Card>
      <strong>{label}</strong>
      {value && (
        <S.Value>
          {value}
          {showArrow && <S.Arrow aria-hidden="true" />}
        </S.Value>
      )}
      {children}
    </S.Card>
  )
}

export default SettingCard
