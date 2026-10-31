import { useTranslation } from '../../hooks/useTranslation'
import { useAuth } from '../../hooks/useAuth'
import Sidebar from '../../components/Sidebar'
import * as S from './styles'
import EmpresaIcon from '../../assets/icons/empresa.svg'
import PlantaIcon from '../../assets/icons/planta.svg'

export default function DataAnalysisChoicePage() {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  if (!user) return null

  return <S.Page>
    <Sidebar userName={user.name} userRole={user.role} onLogout={() => { void logout() }} />
    <S.Content>
      <S.Eyebrow>{t('Área administrativa')}</S.Eyebrow>
      <S.Title>{t('Análises da organização')}</S.Title>
      <S.Description>{t('Escolha o escopo e selecione o relatório para análise.')}</S.Description>
      <S.Options aria-label={t('Tipos de análise')}>
        <S.OptionCard as={S.AnalysisLink} to="/data-analysis/upload?scope=plant">
          <S.OptionIconBox><S.OptionIcon src={PlantaIcon} alt="" aria-hidden="true" /></S.OptionIconBox>
          <S.OptionText><strong>{t('Plantas individuais')}</strong><span>{t('Analise uma unidade por vez')}</span></S.OptionText>
          <S.Availability>{t('Selecionar relatório')}</S.Availability>
        </S.OptionCard>
        <S.OptionCard as={S.AnalysisLink} to="/data-analysis/upload?scope=company">
          <S.OptionIconBox><S.OptionIcon src={EmpresaIcon} alt="" aria-hidden="true" /></S.OptionIconBox>
          <S.OptionText><strong>{t('Empresa completa')}</strong><span>{t('Visão consolidada de todas as plantas')}</span></S.OptionText>
          <S.Availability>{t('Selecionar relatório')}</S.Availability>
        </S.OptionCard>
      </S.Options>
    </S.Content>
  </S.Page>
}


