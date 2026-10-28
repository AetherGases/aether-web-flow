import { useTranslation } from '../../hooks/useTranslation'
import * as S from './styles'
interface SectionStateProps {
  loading?: boolean
  error?: boolean
  title?: string
  description?: string
  onRetry?: () => void
}
export default function SectionState({ loading, error, title, description, onRetry }: SectionStateProps) {
  const { t } = useTranslation()
  return <S.StatePanel aria-busy={loading || undefined} role={error ? 'alert' : undefined}>
    {loading ? <><span>{t("Carregando…")}</span><S.Skeleton aria-hidden="true" /><S.Skeleton aria-hidden="true" /></> : <>
      {title && <strong>{t(title)}</strong>}
      <p>{t(description ?? "Não foi possível carregar as informações deste bloco.")}</p>
      {error && onRetry && <S.RetryButton type="button" onClick={onRetry}>{t("Tentar novamente")}</S.RetryButton>}
    </>}
  </S.StatePanel>
}