import aetherLogo from '../../assets/logos/logo-aether.svg'
import * as S from './styles'
import OverviewLogo from '../../assets/icons/overview.svg'
import AnaliseLogo from '../../assets/icons/analise-dados.svg'
import CalculadoraLogo from '../../assets/icons/calculator.svg'
import ChatbotLogo from '../../assets/icons/chatbot.svg'
import type { UserRole } from '../../types/overview'
import sair from '../../assets/icons/sair.svg'
import { useLocation } from 'react-router-dom'


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
  const { pathname } = useLocation()
  const userInitial = userName.charAt(0).toUpperCase()

  const roleLabel =
    userRole === 'administrator'
      ? 'Administrador'
      : 'Analista'
  return (
    <S.Container aria-label="Navegação principal">
      <S.Logo src={aetherLogo} alt="Aether" />

      <S.Navigation>
        <S.NavigationList>
          <li>
            <S.NavigationLink
              to="/overview"
              aria-current={pathname === '/overview' ? 'page' : undefined}
            >
              <S.Icon src={OverviewLogo} alt="" aria-hidden="true" />
              Visão geral
            </S.NavigationLink>
          </li>

          <li>
            <S.NavigationLink
              to="/data-analysis"
              aria-current={pathname === '/data-analysis' ? 'page' : undefined}
            >
              <S.Icon src={AnaliseLogo} alt="" aria-hidden="true" />
              Análise de dados
            </S.NavigationLink>
          </li>

          <li>
            <S.NavigationLink
              to="/calculator"
              aria-current={pathname === '/calculator' ? 'page' : undefined}
            >
              <S.Icon src={CalculadoraLogo} alt="" aria-hidden="true" />
              Calculadora
            </S.NavigationLink>
          </li>

          <li>
            <S.NavigationLink
              to="/assistant"
              aria-current={pathname === '/assistant' ? 'page' : undefined}
            >
              <S.Icon src={ChatbotLogo} alt="" aria-hidden="true" />
              Assistente Aether
            </S.NavigationLink>
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
          aria-label="Sair da conta"
        >
          <S.Icon src={sair} alt="sair da conta" aria-hidden="true" />
        </S.LogoutButton>
      </S.UserFooter>
    </S.Container>
  )
}

export default Sidebar
