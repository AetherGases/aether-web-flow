import errorAether from '../../assets/logos/error-aether.svg'
import * as S from './styles'

function ErrorPage() {
  return (
    <S.Page>
      <S.Content>
        <S.ErrorCode aria-label="Erro 404">
          <span aria-hidden="true">4</span>
          <S.Illustration src={errorAether} alt="Aether triste" />
          <span aria-hidden="true">4</span>
        </S.ErrorCode>

        <S.Title>
          <span>Oops... parece que</span>
          <span>você se perdeu</span>
        </S.Title>
        <S.Description>
          Não encontramos a página que você estava procurando.
        </S.Description>

        <S.RetryLink to="/">Voltar para a home</S.RetryLink>
      </S.Content>
    </S.Page>
  )
}

export default ErrorPage
