import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from '../../hooks/useTranslation'

export default function NavigationAccessibility() {
  const { pathname } = useLocation()
  const { t } = useTranslation()
  useEffect(() => {
    function focusHeading(): boolean {
      const heading = document.querySelector<HTMLElement>('#main-content h1')
      if (!heading) return false
      heading.tabIndex = -1
      document.title = `${heading.textContent?.trim() ?? 'Aether'} | Aether`
      heading.focus({ preventScroll: true })
      return true
    }
    if (focusHeading()) return
    // A página lazy pode terminar de carregar depois da mudança de rota.
    const observer = new MutationObserver(() => { if (focusHeading()) observer.disconnect() })
    observer.observe(document.getElementById('root') ?? document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [pathname])

  return <a className="skip-link" href="#main-content" onClick={(event) => {
    const content = document.getElementById('main-content')
    if (!content) return
    event.preventDefault()
    content.tabIndex = -1
    content.focus()
  }}>{t('Pular para o conteúdo')}</a>
}
