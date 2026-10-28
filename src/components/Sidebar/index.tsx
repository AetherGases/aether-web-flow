import { useTranslation } from '../../hooks/useTranslation'
import aetherLogo from '../../assets/logos/logo-aether.svg'
import * as S from './styles'
import OverviewLogo from '../../assets/icons/overview.svg'
import AnaliseLogo from '../../assets/icons/analise-dados.svg'
import CalculadoraLogo from '../../assets/icons/calculator.svg'
import ChatbotLogo from '../../assets/icons/chatbot.svg'
import type { UserRole } from '../../types/overview'
import sair from '../../assets/icons/sair.svg'
import { useLocation } from 'react-router-dom'
import perfil from '../../assets/icons/perfil.svg'


interface SidebarProps {
  userName: string
  userRole: UserRole
  onLogout?: () => void
}


function Sidebar({
  userName,
  userRole,
  onLogout,
}: SidebarProps) {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const userInitial = userName.charAt(0).toUpperCase()

  const roleLabel =
    userRole === 'administrator'
      ? t("Administrador")
      : t("Analista")
  return (
    <S.Container aria-label={t("Navegação principal")}>
      <S.Logo src={aetherLogo} alt="Aether" />

      <S.Navigation>
        <S.NavigationList>
          <li>
            <S.NavigationLink
              to="/overview"
              aria-current={pathname === '/overview' ? 'page' : undefined}
            >
              <S.Icon src={OverviewLogo} alt="" aria-hidden="true" />
              {t("Visão geral")}</S.NavigationLink>
          </li>

          <li>
            <S.NavigationLink
              to={userRole === 'administrator' ? '/data-analysis/select' : '/data-analysis/upload'}
              aria-current={pathname.startsWith('/data-analysis') ? 'page' : undefined}
            >
              <S.Icon src={AnaliseLogo} alt="" aria-hidden="true" />
              {t("Análise de dados")}</S.NavigationLink>
          </li>

          <li>
            <S.NavigationLink
              to="/calculator"
              aria-current={pathname === '/calculator' ? 'page' : undefined}
            >
              <S.Icon src={CalculadoraLogo} alt="" aria-hidden="true" />
              {t("Calculadora")}</S.NavigationLink>
          </li>

          <li>
            <S.NavigationLink
              to="/assistant"
              aria-current={pathname === '/assistant' ? 'page' : undefined}
            >
              <S.Icon src={ChatbotLogo} alt="" aria-hidden="true" />
              {t("Assistente Aether")}</S.NavigationLink>
          </li>

          <li>
            <S.NavigationLink
              to="/profile"
              aria-current={pathname === '/profile' ? 'page' : undefined}
            >
              <S.Icon src={perfil} alt="" aria-hidden="true" />
              {t("Perfil")}</S.NavigationLink>
          </li>
        </S.NavigationList>
      </S.Navigation>
      <S.UserFooter>
        <S.Avatar aria-hidden="true">
          {userInitial}
        </S.Avatar>

        <S.UserInformation>
          <strong>{userName}</strong>
          <span>{roleLabel}</span>
        </S.UserInformation>

        <S.LogoutButton
          type="button"
          onClick={onLogout}
          aria-label={t("Sair da conta")}
        >
          <S.Icon src={sair} alt={t("sair da conta")} aria-hidden="true" />
        </S.LogoutButton>
      </S.UserFooter>
    </S.Container>
  )
}

export default Sidebar
