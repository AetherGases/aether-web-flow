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
  return (
    <S.Page>
      <Sidebar
        userName={data.userName}
        userRole={data.role}
        onLogout={onLogout}
      />

      <S.Content>
        <S.Title>Selecione o tipo de análise</S.Title>

        <S.Options aria-label="Tipos de análise">
          <S.OptionButton type="button" onClick={onSelectPlant}>
            <S.OptionIconBox>
              <S.OptionIcon src={PlantaIcon} alt="" aria-hidden="true" />
            </S.OptionIconBox>
            <S.OptionText>
              <strong>Plantas individuais</strong>
              <span>Analise uma unidade por vez</span>
            </S.OptionText>
          </S.OptionButton>

          <S.OptionButton type="button" onClick={onSelectCompany}>
            <S.OptionIconBox>
              <S.OptionIcon src={EmpresaIcon} alt="" aria-hidden="true" />
            </S.OptionIconBox>
            <S.OptionText>
              <strong>Empresa completa</strong>
              <span>Visão consolidada de todas as plantas</span>
            </S.OptionText>
          </S.OptionButton>
        </S.Options>
      </S.Content>
    </S.Page>
  )
}

export default DataAnalysisChoicePage
