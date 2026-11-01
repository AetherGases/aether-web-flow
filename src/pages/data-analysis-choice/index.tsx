import { useTranslation } from '../../hooks/useTranslation'
import { useAuth } from '../../hooks/useAuth'
import Sidebar from '../../components/Sidebar'
import * as S from './styles'
import PlantaIcon from '../../assets/icons/planta.svg'

export default function DataAnalysisChoicePage() {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  if (!user) return null

  return <S.Page>
    <Sidebar userName={user.name} userRole={user.role} onLogout={() => { void logout() }} />
    <S.Content id="main-content">
      <S.Eyebrow>{t(user.role === 'administrator' ? 'Área administrativa' : 'Análise de dados')}</S.Eyebrow>
      <S.Title>{t(user.role === 'administrator' ? 'Análises da organização' : 'Análise de dados')}</S.Title>
      <S.Description>{t('Selecione um relatório da sua unidade para análise.')}</S.Description>
      <S.Options aria-label={t('Tipos de análise')}>
        <S.OptionCard as={S.AnalysisLink} to="/data-analysis/upload/plant">
          <S.OptionIconBox><S.OptionIcon data-theme-icon src={PlantaIcon} alt="" aria-hidden="true" /></S.OptionIconBox>
          <S.OptionText><strong>{t('Plantas individuais')}</strong><span>{t('Analise uma unidade por vez')}</span></S.OptionText>
          <S.Availability>{t('Selecionar relatório')}</S.Availability>
        </S.OptionCard>
      </S.Options>
    </S.Content>
  </S.Page>
}


