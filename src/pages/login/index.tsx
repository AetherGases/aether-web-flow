import aetherLogo from '../../assets/logos/logo.svg'
import analistaIcon from '../../assets/icons/analista-icon.svg'
import adminIcon from '../../assets/icons/admin-icon.svg'
import * as S from './styles'

function LoginPage() {
    return (
      <S.Page>
        <S.BackgroundShape
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <linearGradient
              id="login-background-gradient"
              x1="0"
              y1="0"
              x2="1"
              y2="1"
            >
              <stop offset="0%" stopColor="var(--color-brand-purple)" />
              <stop offset="52%" stopColor="var(--color-brand-blue)" />
              <stop offset="100%" stopColor="var(--color-brand-green)" />
            </linearGradient>
          </defs>

          <path
            d="M 0 0 H 44 C 52 20, 50 34, 48 43 C 45 56, 42 65, 44 85 C 45 95, 49 103, 49 100 H 0 Z"
            fill="url(#login-background-gradient)"
          />
        </S.BackgroundShape>

        <S.Presentation aria-labelledby="presentation-title">
            <S.Logo
                src={aetherLogo}
                alt="Aether"
            />
  
          <S.PresentationContent>
            <h2 id="presentation-title">
              Inteligência para decisões que reduzem custos
            </h2>
  
            <p>
              Analistas ganham clareza. Administradores ganham controle.
              Toda a operação unificada.
            </p>
          </S.PresentationContent>
        </S.Presentation>
  
        <S.Authentication aria-labelledby="login-title">
          <S.AuthenticationContent>
            <S.Header>
              <h1 id="login-title">Entre na sua conta</h1>
  
              <p>
                Bem-vindo de volta! Acesse a plataforma com suas credenciais.
              </p>
            </S.Header>
  
            <section
              aria-labelledby="profiles-title"
            >
  
              <S.ProfileList>
                <li>
                  <S.ProfileCard>
                    <img
                        src={analistaIcon}
                        alt="Analista"
                    />
                    <h3>Analista</h3>
                    <p>Dados e análises</p>
                  </S.ProfileCard>
                </li>
  
                <li>
                  <S.ProfileCard>
                  <img
                        src={adminIcon}
                        alt="Admin"
                    />
                    <h3>Administrador</h3>
                    <p>Gestão da plataforma</p>
                  </S.ProfileCard>
                </li>
              </S.ProfileList>
            </section>
  
            <S.Form>
              <S.Field>
                <S.Label htmlFor="email">E-mail</S.Label>
  
                <S.Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="voce@empresa.com"
                  required
                />
              </S.Field>
  
              <S.Field>
                <S.Label htmlFor="password">Senha</S.Label>
  
                <S.Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder='********'
                  required
                />
              </S.Field>
  
              <S.SubmitButton type="submit">
                Entrar
              </S.SubmitButton>
            </S.Form>
          </S.AuthenticationContent>
        </S.Authentication>
      </S.Page>
    )
  }
  
  export default LoginPage
