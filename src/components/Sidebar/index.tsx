import lightLogo from '../../assets/logos/logo-aether-light.png'
import { usePreferences } from '../../hooks/usePreferences'
import { useTranslation } from '../../hooks/useTranslation'
import aetherLogo from '../../assets/logos/logo-aether.svg'
import * as S from './styles'
import OverviewLogo from '../../assets/icons/overview.svg'
import AnaliseLogo from '../../assets/icons/analise-dados.svg'
import GestaoLogo from '../../assets/icons/empresa.svg'
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
  const { lightMode, highContrast } = usePreferences()
  const { pathname } = useLocation()
  const isAdministrator = userRole === 'administrator'
  const userInitial = userName.charAt(0).toUpperCase()

  const roleLabel =
    userRole === 'administrator'
      ? t("Administrador")
      : t("Analista")
  return (
    <S.Container aria-label={t("Navegação principal")}>
      <S.Logo src={lightMode && !highContrast ? lightLogo : aetherLogo} alt="Aether" />

      <S.Navigation aria-label={t("Navegação principal")}>
        <S.NavigationList>
          <li>
            <S.NavigationLink
              to="/overview"
              aria-current={pathname === '/overview' ? 'page' : undefined}
            >
              <S.Icon data-theme-icon src={OverviewLogo} alt="" aria-hidden="true" />
              <S.Label>{t("Visão geral")}</S.Label></S.NavigationLink>
          </li>

          <li>
            <S.NavigationLink
              to={userRole === 'administrator' ? '/data-analysis/select' : '/data-analysis/upload/plant'}
              aria-current={pathname.startsWith('/data-analysis') ? 'page' : undefined}
            >
              <S.Icon data-theme-icon src={AnaliseLogo} alt="" aria-hidden="true" />
              <S.AnalysisLabel>{isAdministrator ? t("Análises da organização") : t("Análise de dados")}</S.AnalysisLabel></S.NavigationLink>
          </li>

          <li>
            <S.NavigationLink
              to={isAdministrator ? '/administration' : '/calculator'}
              aria-current={pathname === (isAdministrator ? '/administration' : '/calculator') ? 'page' : undefined}
            >
              <S.Icon data-theme-icon src={isAdministrator ? GestaoLogo : CalculadoraLogo} alt="" aria-hidden="true" />
              <S.Label>{isAdministrator ? t("Gestão administrativa") : t("Calculadora")}</S.Label></S.NavigationLink>
          </li>

          <li>
            <S.NavigationLink
              to="/assistant"
              aria-current={pathname === '/assistant' ? 'page' : undefined}
            >
              <S.Icon data-theme-icon src={ChatbotLogo} alt="" aria-hidden="true" />
              <S.Label>{t("Assistente Aether")}</S.Label></S.NavigationLink>
          </li>

          <li>
            <S.NavigationLink
              to="/profile"
              aria-current={pathname === '/profile' ? 'page' : undefined}
            >
              <S.Icon data-theme-icon src={perfil} alt="" aria-hidden="true" />
              <S.Label>{t("Perfil")}</S.Label></S.NavigationLink>
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
          <S.Icon data-theme-icon src={sair} alt={t("sair da conta")} aria-hidden="true" />
        </S.LogoutButton>
      </S.UserFooter>
    </S.Container>
  )
}

export default Sidebar
