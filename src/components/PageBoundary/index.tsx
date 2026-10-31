import { Component, Suspense, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from '../../hooks/useTranslation'

interface PageBoundaryProps { children: ReactNode }
interface ErrorBoundaryProps extends PageBoundaryProps { fallback: ReactNode }
interface ErrorBoundaryState { failed: boolean }

class PageErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { failed: false }
  static getDerivedStateFromError(): ErrorBoundaryState { return { failed: true } }
  render() { return this.state.failed ? this.props.fallback : this.props.children }
}

export default function PageBoundary({ children }: PageBoundaryProps) {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  return <PageErrorBoundary key={pathname} fallback={<main id="main-content" className="page-feedback">
    <h1>{t('Não foi possível carregar esta página.')}</h1>
    <p role="alert">{t('Atualize a página para tentar novamente.')}</p>
    <button type="button" onClick={() => window.location.reload()}>{t('Tentar novamente')}</button>
  </main>}>
    <Suspense fallback={<main id="main-content" className="page-feedback" aria-busy="true">
      <p role="status">{t('Carregando página…')}</p>
    </main>}>{children}</Suspense>
  </PageErrorBoundary>
}
