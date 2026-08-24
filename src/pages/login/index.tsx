import aetherLogo from '../../assets/logos/aether-logo.svg'
function LoginPage() {
    return (
      <main className="login-page">
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
              <h2 id="profiles-title">Perfis com acesso</h2>
  
              <ul className="login-page__profile-list">
                <li>
                  <article className="login-page__profile-card">
                    <h3>Analista</h3>
                    <p>Dados e análises</p>
                  </article>
                </li>
  
                <li>
                  <article className="login-page__profile-card">
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