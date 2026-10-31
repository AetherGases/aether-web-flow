import { useTranslation } from '../../hooks/useTranslation'
import errorAether from '../../assets/logos/error-aether.svg'
import * as S from './styles'

function ErrorPage() {
  const { t } = useTranslation()
  return (
    <S.Page id="main-content">
      <S.Content>
        <S.ErrorCode aria-label={t("Erro 404")}>
          <span aria-hidden="true">4</span>
          <S.Illustration src={errorAether} alt={t("Aether triste")} />
          <span aria-hidden="true">4</span>
        </S.ErrorCode>

        <S.Title>
          <span>{t("Oops... parece que")}</span>
          <span>{t("você se perdeu")}</span>
        </S.Title>
        <S.Description>
          {t("Não encontramos a página que você estava procurando.")}</S.Description>

        <S.RetryLink to="/">{t("Voltar para a home")}</S.RetryLink>
      </S.Content>
    </S.Page>
  )
}

export default ErrorPage
