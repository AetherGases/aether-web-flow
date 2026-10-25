import { useTranslation } from '../../hooks/useTranslation'
import * as S from './styles'

interface ToastProps {
  type: 'success' | 'error'
  message: string
  onDismiss: () => void
}

export default function Toast({ type, message, onDismiss }: ToastProps) {
  const { t } = useTranslation()
  return <S.Notification $type={type} role={type === 'error' ? 'alert' : 'status'} aria-atomic="true">
    <S.Icon $type={type} aria-hidden="true">{type === 'success' ? '✓' : '!'}</S.Icon>
    <p>{t(message)}</p>
    <S.CloseButton type="button" onClick={onDismiss} aria-label={t("Fechar notificação")}>×</S.CloseButton>
  </S.Notification>
}
