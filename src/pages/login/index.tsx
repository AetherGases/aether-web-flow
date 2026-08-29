import aetherLogo from '../../assets/logos/logo.svg'
import analistaIcon from '../../assets/icons/analista-icon.svg'
import adminIcon from '../../assets/icons/admin-icon.svg'
import './login.css'
function LoginPage() {
    return (
      <main className="login-page">
        <svg
          className="login-page__background-shape"
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
        </svg>

        <section
          className="login-page__presentation"
          aria-labelledby="presentation-title"
        >
            <img
                src={aetherLogo}
                alt="Aether"
                className="login-page__logo"
            />
  
          <div className="login-page__presentation-content">
            <h2 id="presentation-title">
              Inteligência para decisões que reduzem custos
            </h2>
  
            <p>
              Analistas ganham clareza. Administradores ganham controle.
              Toda a operação unificada.
            </p>
          </div>
        </section>
  
        <section
          className="login-page__authentication"
          aria-labelledby="login-title"
        >
          <div className="login-page__authentication-content">
            <header className="login-page__header">
              <h1 id="login-title">Entre na sua conta</h1>
  
              <p>
                Bem-vindo de volta! Acesse a plataforma com suas credenciais.
              </p>
            </header>
  
            <section
              className="login-page__profiles"
              aria-labelledby="profiles-title"
            >
  
              <ul className="login-page__profile-list">
                <li>
                  <article className="login-page__profile-card">
                    <img
                        src={analistaIcon}
                        alt="Analista"
                        className="analista-card__icon"
                    />
                    <h3>Analista</h3>
                    <p>Dados e análises</p>
                  </article>
                </li>
  
                <li>
                  <article className="login-page__profile-card">
                  <img
                        src={adminIcon}
                        alt="Admin"
                        className="admin-card__icon"
                    />
                    <h3>Administrador</h3>
                    <p>Gestão da plataforma</p>
                  </article>
                </li>
              </ul>
            </section>
  
            <form className="login-form">
              <div className="login-form__field">
                <label htmlFor="email">E-mail</label>
  
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="voce@empresa.com"
                  required
                />
              </div>
  
              <div className="login-form__field">
                <label htmlFor="password">Senha</label>
  
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder='********'
                  required
                />
              </div>
  
              <button className="login-form__submit" type="submit">
                Entrar
              </button>
            </form>
          </div>
        </section>
      </main>
    )
  }
  
  export default LoginPage
