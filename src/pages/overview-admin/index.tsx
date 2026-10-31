import InventoryStatus from '../../components/InventoryStatus'
import { useAuth } from '../../hooks/useAuth'
import { useTranslation } from '../../hooks/useTranslation'
import { useOrganizationOverview } from '../../hooks/useOrganizationOverview'
import { type OverviewSection } from '../../types/inventory'
import Sidebar from '../../components/Sidebar'
import MetricCard from '../../components/MetricCard'
import SectionState from '../../components/SectionState'
import AnalysisIcon from '../../assets/icons/analise-dados.svg'
import ManagementIcon from '../../assets/icons/empresa.svg'
import AssistantIcon from '../../assets/icons/chatbot.svg'
import * as S from './styles'

export default function AdministratorOverviewPage() {
  const { user, logout, retry: recoverSession } = useAuth()
  const { t, locale, formatDate } = useTranslation()
  const { data, loading, reload, sessionExpired } = useOrganizationOverview()
  if (!user) return null
  const reports = data?.reports
  const retry = sessionExpired ? recoverSession : reload
  const total: OverviewSection<number> | undefined = reports?.status === 'ready'
    ? { status: 'ready', data: reports.data.totalCount } : reports
  const metrics = [
    { id: 'reports', label: t('Relatórios disponíveis'), result: total },
    { id: 'under-review', label: t('Em revisão'), result: data?.underReview },
    { id: 'approved', label: t('Relatórios aprovados'), result: data?.approved },
    { id: 'rejected', label: t('Relatórios rejeitados'), result: data?.rejected },
  ]

  return <S.Page>
    <Sidebar userName={user.name} userRole={user.role} onLogout={() => { void logout() }} />
    <S.Content>
      <S.Header>
        <h4>{t('Visão geral')}</h4>
        <h1>{t('Olá,')} {user.name}</h1>
        <p>{t('Acompanhe os relatórios do seu departamento e acesse os recursos administrativos.')}</p>
      </S.Header>
      <S.MetricsSection aria-label={t('Indicadores')}>
        <S.MetricsGrid>{metrics.map(({ id, label, result }) => {
          const value = result?.status === 'ready' ? result.data : null
          return <MetricCard key={id} metric={{ id, label, value: value?.toLocaleString(locale) ?? '—', currentValue: value ?? 0, previousValue: null, positiveDirection: 'increase' }}
            state={loading ? 'loading' : result?.status === 'ready' ? undefined : 'error'} description={t('No seu departamento')} />
        })}</S.MetricsGrid>
      </S.MetricsSection>
      <S.FastAcessSection aria-labelledby="admin-access-title">
        <p id="admin-access-title">{t('Acesso rápido')}</p>
        <S.FastAcessGrid>
          <S.FastAcessDiv><S.Icon src={AnalysisIcon} alt="" /><S.FastAcessContent><S.FastAcessLink to="/data-analysis/select">{t('Análises da organização')}</S.FastAcessLink><p>{t('Plantas individuais e empresa completa')}</p></S.FastAcessContent></S.FastAcessDiv>
          <S.FastAcessDiv><S.Icon src={ManagementIcon} alt="" /><S.FastAcessContent><S.FastAcessLink to="/administration">{t('Gestão administrativa')}</S.FastAcessLink><p>{t('Funcionários, unidades, setores e permissões')}</p></S.FastAcessContent></S.FastAcessDiv>
          <S.FastAcessDiv><S.Icon src={AssistantIcon} alt="" /><S.FastAcessContent><S.FastAcessLink to="/assistant">{t('Assistente Aether')}</S.FastAcessLink><p>{t('Converse com o Aether')}</p></S.FastAcessContent></S.FastAcessDiv>
        </S.FastAcessGrid>
      </S.FastAcessSection>
      <S.History aria-labelledby="admin-reports-title">
        <S.SectionHeading id="admin-reports-title">{t('Relatórios recentes do departamento')}</S.SectionHeading>
        {reports?.status === 'ready' ? reports.data.inventories.length === 0
          ? <S.ScopeNote>{t('Nenhum relatório disponível no seu departamento.')}</S.ScopeNote>
          : <S.PerformanceTable>
            <thead><tr><th scope="col">{t('Nome')}</th><th scope="col">{t('Data')}</th><th scope="col">{t('Situação')}</th></tr></thead>
            <tbody>{reports.data.inventories.map(report => <tr key={report.id}>
              <td>{report.name}</td><td><time dateTime={report.createdAt}>{formatDate(report.createdAt)}</time></td><td><InventoryStatus status={report.status} /></td>
            </tr>)}</tbody>
          </S.PerformanceTable>
          : <SectionState loading={loading} error={!loading} description={t('Não foi possível carregar as informações dos relatórios.')} onRetry={retry} />}
      </S.History>
    </S.Content>
  </S.Page>
}
