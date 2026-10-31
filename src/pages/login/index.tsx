import { useTranslation } from '../../hooks/useTranslation'
import aetherLogo from '../../assets/logos/logo.svg'
import analistaIcon from '../../assets/icons/analista-icon.svg'
import adminIcon from '../../assets/icons/admin-icon.svg'
import * as S from './styles'
import { useLogin } from '../../hooks/useLogin'

function LoginPage() {
  const { t } = useTranslation()
  const { form, setForm, loading, errors, error, handleSubmit } = useLogin()
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
              {t("Inteligência para decisões que reduzem custos")}</h2>
  
            <p>
              {t("Analistas ganham clareza. Administradores ganham controle. Toda a operação unificada.")}</p>
          </S.PresentationContent>
        </S.Presentation>
  
        <S.Authentication aria-labelledby="login-title">
          <S.AuthenticationContent>
            <S.Header>
              <h1 id="login-title">{t("Entre na sua conta")}</h1>
  
              <p>
                {t("Bem-vindo de volta! Acesse a plataforma com suas credenciais.")}</p>
            </S.Header>
  
            <section
              aria-label={t("Perfis de acesso")}
            >
  
              <S.ProfileList>
                <li>
                  <S.ProfileCard>
                    <img
                        data-theme-icon src={analistaIcon}
                        alt={t("Analista")}
                    />
                    <h3>{t("Analista")}</h3>
                    <p>{t("Dados e análises")}</p>
                  </S.ProfileCard>
                </li>
  
                <li>
                  <S.ProfileCard>
                  <img
                        data-theme-icon src={adminIcon}
                        alt={t("Admin")}
                    />
                    <h3>{t("Administrador")}</h3>
                    <p>{t("Gestão da plataforma")}</p>
                  </S.ProfileCard>
                </li>
              </S.ProfileList>
            </section>
  
            <S.Form onSubmit={handleSubmit} noValidate aria-busy={loading}>
              <S.Field>
                <S.Label htmlFor="email">{t("E-mail")}</S.Label>
  
                <S.Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder={t("voce@empresa.com")}
                  required
                  maxLength={255}
                  value={form.email}
                  disabled={loading}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                />
                {errors.email && <p id="email-error" role="alert">{t(errors.email)}</p>}
              </S.Field>
  
              <S.Field>
                <S.Label htmlFor="password">{t("Senha")}</S.Label>
  
                <S.Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder='********'
                  required
                  maxLength={128}
                  value={form.password}
                  disabled={loading}
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                />
                {errors.password && <p id="password-error" role="alert">{t(errors.password)}</p>}
              </S.Field>
  
              {error && <p role="alert">{t(error)}</p>}
              {loading && <p role="status">{t("Autenticando…")}</p>}
              <S.SubmitButton type="submit" disabled={loading}>
                {loading ? t("Entrando…") : t("Entrar")}
              </S.SubmitButton>
            </S.Form>
          </S.AuthenticationContent>
        </S.Authentication>
      </S.Page>
    )
  }
  
  export default LoginPage
