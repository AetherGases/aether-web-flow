import { useAuth } from '../../hooks/useAuth'
import { useTranslation } from '../../hooks/useTranslation'
import Sidebar from '../../components/Sidebar'
import { getAdministrationUrl } from '../../utils/administration'
import * as S from './styles'

export default function AdministrationPage() {
  const { user, logout } = useAuth()
  const { t } = useTranslation()
  const managementUrl = getAdministrationUrl(import.meta.env.VITE_ADMIN_URL)
  if (!user) return null

  return <S.Page>
    <Sidebar userName={user.name} userRole={user.role} onLogout={() => { void logout() }} />
    <S.Content id="main-content">
      <S.Eyebrow>{t('Área administrativa')}</S.Eyebrow>
      <S.Title>{t('Gestão administrativa')}</S.Title>
      <S.Description>{t('Funcionários, unidades, setores e permissões')}</S.Description>
      <S.LaunchPanel>
        <h2>{t('Acesso ao sistema de gestão')}</h2>
        <p id="management-access-note">{managementUrl ? t('Os cadastros são gerenciados no sistema administrativo.') : t('O botão será habilitado quando o endereço do sistema administrativo estiver configurado.')}</p>
        {managementUrl
          ? <S.LaunchLink href={managementUrl}>{t('Abrir sistema administrativo')}</S.LaunchLink>
          : <S.LaunchButton type="button" disabled aria-describedby="management-access-note">{t('Abrir sistema administrativo')}</S.LaunchButton>}
      </S.LaunchPanel>
    </S.Content>
  </S.Page>
}
