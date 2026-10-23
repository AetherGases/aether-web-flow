import * as S from './styles'
interface SectionStateProps {
  loading?: boolean
  error?: boolean
  title?: string
  description?: string
  onRetry?: () => void
}
export default function SectionState({ loading, error, title, description, onRetry }: SectionStateProps) {
  return <S.StatePanel aria-busy={loading || undefined} role={error ? 'alert' : undefined}>
    {loading ? <><span>Carregando…</span><S.Skeleton aria-hidden="true" /><S.Skeleton aria-hidden="true" /></> : <>
      {title && <strong>{title}</strong>}
      <p>{description ?? 'Não foi possível carregar as informações deste bloco.'}</p>
      {error && onRetry && <S.RetryButton type="button" onClick={onRetry}>Tentar novamente</S.RetryButton>}
    </>}
  </S.StatePanel>
}