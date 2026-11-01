import { useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useLocation } from 'react-router-dom'
import { useTranslation } from '../../hooks/useTranslation'

export default function NavigationAccessibility() {
  const { pathname } = useLocation()
  const { t } = useTranslation()
  const { user } = useAuth()
  const section = pathname === '/overview' ? 'Visão geral'
    : pathname === '/data-analysis' || pathname.startsWith('/data-analysis/')
      ? user?.role === 'administrator' ? 'Análises da organização' : 'Análise de dados'
    : pathname === '/administration' ? 'Gestão administrativa'
    : pathname === '/calculator' ? 'Calculadora'
    : pathname === '/assistant' ? 'Assistente Aeko'
    : pathname === '/profile' ? 'Perfil'
    : pathname === '/' ? 'Entre na sua conta' : 'Erro 404'
  useEffect(() => {
    document.title = `${t(section)} | Aether`
  }, [section, t])
  useEffect(() => {
    let firstFrame = 0
    let secondFrame = 0
    function focusHeading(): boolean {
      const heading = document.querySelector<HTMLElement>('#main-content h1')
      if (!heading) return false
      heading.tabIndex = -1
      firstFrame = requestAnimationFrame(() => {
        secondFrame = requestAnimationFrame(() => {
          if (heading.isConnected) heading.focus({ preventScroll: true })
        })
      })
      return true
    }
    const cancelFocus = () => {
      cancelAnimationFrame(firstFrame)
      cancelAnimationFrame(secondFrame)
    }
    if (focusHeading()) return cancelFocus
    // A página lazy pode terminar de carregar depois da mudança de rota.
    const observer = new MutationObserver(() => { if (focusHeading()) observer.disconnect() })
    observer.observe(document.getElementById('root') ?? document.body, { childList: true, subtree: true })
    return () => { observer.disconnect(); cancelFocus() }
  }, [pathname])

  return <a className="skip-link" href="#main-content" onClick={(event) => {
    const content = document.getElementById('main-content')
    if (!content) return
    event.preventDefault()
    content.tabIndex = -1
    content.focus()
  }}>{t('Pular para o conteúdo')}</a>
}
