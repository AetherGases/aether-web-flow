import { useState } from 'react'
import { useTranslation } from '../../hooks/useTranslation'
import aetherLogo from '../../assets/logos/icon-light.svg'
import analistaIcon from '../../assets/icons/analista-icon.svg'
import adminIcon from '../../assets/icons/admin-icon.svg'
import * as S from './styles'
import { useLogin } from '../../hooks/useLogin'

function LoginPage() {
  const { t } = useTranslation()
  const [showPassword, setShowPassword] = useState(false)
  const { form, setForm, loading, errors, error, handleSubmit } = useLogin()
    return (
      <S.Page id="main-content">
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
                src={aetherLogo} width={610} height={440}
                alt="Aether"
            />
  
          <S.PresentationContent>
            <p data-presentation-title id="presentation-title">
              {t("Inteligência para decisões que reduzem custos")}</p>
  
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
                    <h2>{t("Analista")}</h2>
                    <p>{t("Dados e análises")}</p>
                  </S.ProfileCard>
                </li>
  
                <li>
                  <S.ProfileCard>
                  <img
                        data-theme-icon src={adminIcon}
                        alt={t("Admin")}
                    />
                    <h2>{t("Administrador")}</h2>
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
  
                <S.PasswordField>
                <S.Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
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
                <S.PasswordToggle type="button" disabled={loading} aria-label={t(showPassword ? 'Ocultar senha' : 'Mostrar senha')} aria-controls="password" onClick={() => setShowPassword(current => !current)}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                    <circle cx="12" cy="12" r="3" />
                    {showPassword && <path d="m3 3 18 18" />}
                  </svg>
                </S.PasswordToggle>
                </S.PasswordField>
                {errors.password && <p id="password-error" role="alert">{t(errors.password)}</p>}
              </S.Field>
  
              <S.SubmitButton type="submit" disabled={loading}>
                {loading ? t("Entrando…") : t("Entrar")}
              </S.SubmitButton>
              {!loading && error && <p role="alert">{t(error)}</p>}
            </S.Form>
          </S.AuthenticationContent>
        </S.Authentication>
      </S.Page>
    )
  }
  
  export default LoginPage
