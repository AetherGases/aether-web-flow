import { useTranslation } from '../../hooks/useTranslation'
import Sidebar from '../../components/Sidebar'
import type { OverviewData } from '../../types/overview'
import * as S from './styles'
import EmpresaIcon from '../../assets/icons/empresa.svg'
import PlantaIcon from '../../assets/icons/planta.svg'

interface DataAnalysisChoicePageProps {
  data: OverviewData
  onLogout: () => void
  onSelectPlant?: () => void
  onSelectCompany?: () => void
}

function DataAnalysisChoicePage({
  data,
  onLogout,
  onSelectPlant,
  onSelectCompany,
}: DataAnalysisChoicePageProps) {
  const { t } = useTranslation()
  return (
    <S.Page>
      <Sidebar
        userName={data.userName}
        userRole={data.role}
        onLogout={onLogout}
      />

      <S.Content>
        <S.Title>{t("Selecione o tipo de análise")}</S.Title>

        <S.Options aria-label={t("Tipos de análise")}>
          <S.OptionButton type="button" onClick={onSelectPlant}>
            <S.OptionIconBox>
              <S.OptionIcon src={PlantaIcon} alt="" aria-hidden="true" />
            </S.OptionIconBox>
            <S.OptionText>
              <strong>{t("Plantas individuais")}</strong>
              <span>{t("Analise uma unidade por vez")}</span>
            </S.OptionText>
          </S.OptionButton>

          <S.OptionButton type="button" onClick={onSelectCompany}>
            <S.OptionIconBox>
              <S.OptionIcon src={EmpresaIcon} alt="" aria-hidden="true" />
            </S.OptionIconBox>
            <S.OptionText>
              <strong>{t("Empresa completa")}</strong>
              <span>{t("Visão consolidada de todas as plantas")}</span>
            </S.OptionText>
          </S.OptionButton>
        </S.Options>
      </S.Content>
    </S.Page>
  )
}

export default DataAnalysisChoicePage
