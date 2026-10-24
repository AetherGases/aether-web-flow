import * as S from './styles'

interface ToastProps {
  type: 'success' | 'error'
  message: string
  onDismiss: () => void
}

export default function Toast({ type, message, onDismiss }: ToastProps) {
  return <S.Notification $type={type} role={type === 'error' ? 'alert' : 'status'} aria-atomic="true">
    <S.Icon $type={type} aria-hidden="true">{type === 'success' ? '✓' : '!'}</S.Icon>
    <p>{message}</p>
    <S.CloseButton type="button" onClick={onDismiss} aria-label="Fechar notificação">×</S.CloseButton>
  </S.Notification>
}
