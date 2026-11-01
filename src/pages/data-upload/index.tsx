import { useState, useRef, type FormEvent } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useTranslation } from '../../hooks/useTranslation'
import { useAuth } from '../../hooks/useAuth'
import { getAnalysisScope, isAnalysisScope } from '../../utils/analysis'
import { validateReportFile } from '../../utils/reports'
import { uploadReport, registerReport } from '../../services/reports'
import Sidebar from '../../components/Sidebar'
import ErrorPage from '../error'
import uploadFileIcon from '../../assets/icons/data-upload/upload-file.svg'
import * as S from './styles'

export default function DataUploadPage() {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const { scope: routeScope } = useParams<{ scope: string }>()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const input = useRef<HTMLInputElement>(null)
  const busy = useRef(false)
  const [file, setFile] = useState<File | null>(null)
  const [name, setName] = useState('')
  const [approach, setApproach] = useState('')
  const [phase, setPhase] = useState<'idle' | 'uploading' | 'registering' | 'uncertain'>('idle')
  const [error, setError] = useState('')
  if (!user) return null
  if (routeScope !== undefined && (!isAnalysisScope(routeScope) || (routeScope === 'company' && user.role !== 'administrator'))) return <ErrorPage />
  const scope = getAnalysisScope(user.role, routeScope ?? params.get('scope'))
  const sending = phase === 'uploading' || phase === 'registering'
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy.current || phase === 'uncertain' || !file || scope === 'company') return
    const validation = validateReportFile(file)
    if (validation) { setError(validation); return }
    busy.current = true
    setError('')
    setPhase('uploading')
    let registering = false
    try {
      const path = await uploadReport(file)
      registering = true
      setPhase('registering')
      const report = await registerReport({ name: name.trim(), consolidationApproach: approach, fileName: file.name, path })
      navigate('/data-analysis?id=' + report.id)
    } catch (error) {
      setError(registering ? 'Não foi possível confirmar o registro. Confira seus relatórios antes de fazer um novo envio.' : (error as Error).message)
      setPhase(registering ? 'uncertain' : 'idle')
    } finally { busy.current = false }
  }
  return <S.Page>
    <Sidebar userName={user.name} userRole={user.role} onLogout={() => { void logout() }} />
    <S.Content id="main-content">
      {user.role === 'administrator' && <S.BackLink as={Link} to="/data-analysis/select">← {t('Voltar à escolha de análise')}</S.BackLink>}
      <S.Eyebrow>{t('Análise de dados')}</S.Eyebrow>
      <S.Title>{t(scope === 'company' ? 'Análise - Empresa completa' : 'Análise - Plantas individuais')}</S.Title>
      {scope === 'company' ? <S.UploadPanel><p>{t('A análise da empresa completa está pendente de suporte no back-end.')}</p></S.UploadPanel> : <S.UploadPanel as="form" onSubmit={submit} aria-busy={sending}>
        <S.UploadIcon aria-hidden="true"><img data-theme-icon src={uploadFileIcon} alt="" /></S.UploadIcon>
        <S.UploadText><strong>{t('Carregue seus dados')}</strong><span>{t('Excel (.xlsx), até 10 MB. O relatório será vinculado à sua unidade.')}</span></S.UploadText>
        <S.Fields disabled={sending || phase === 'uncertain'}>
          <label htmlFor="report-name">{t('Nome do relatório')}</label>
          <input id="report-name" value={name} onChange={event => setName(event.target.value)} required minLength={3} maxLength={150} pattern="[A-Za-zÀ-ÖØ-öø-ÿ]+(\s+[A-Za-zÀ-ÖØ-öø-ÿ]+)*" aria-describedby="report-name-hint" />
          <small id="report-name-hint">{t('Use apenas letras e espaços, de 3 a 150 caracteres.')}</small>
          <label htmlFor="report-approach">{t('Abordagem de consolidação')}</label>
          <select id="report-approach" value={approach} onChange={event => setApproach(event.target.value)} required>
            <option value="">{t('Selecione a abordagem utilizada no relatório')}</option>
            {['Participação acionária', 'Controle operacional', 'Controle financeiro'].map(value => <option key={value} value={value}>{t(value)}</option>)}
          </select>
          <S.FileLabel htmlFor="analysis-report">{t('Selecionar arquivo')}</S.FileLabel>
          <S.FileInput id="analysis-report" ref={input} type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" tabIndex={-1} onChange={event => {
            const selected = event.target.files?.[0]
            if (!selected) return
            const error = validateReportFile(selected)
            setError(error ?? '')
            setFile(error ? null : selected)
            if (error) event.target.value = ''
          }} />
          <S.SelectFileLink type="button" onClick={() => input.current?.click()}>{t(file ? 'Trocar arquivo' : 'Selecionar arquivo')}</S.SelectFileLink>
          {file && <S.FileName>{file.name}</S.FileName>}
        </S.Fields>
        <S.SelectFileButton type="submit" disabled={!file || !name.trim() || !approach || sending || phase === 'uncertain'}>{t(phase === 'uploading' ? 'Enviando arquivo…' : phase === 'registering' ? 'Registrando relatório…' : 'Enviar para análise')}</S.SelectFileButton>
        <p role="status">{sending ? t('Aguarde a confirmação antes de sair desta página.') : ''}</p>
        {error && <S.ErrorMessage role="alert">{t(error)}</S.ErrorMessage>}
        {phase === 'uncertain' && <Link to="/overview">{t('Consultar meus relatórios')}</Link>}
      </S.UploadPanel>}
    </S.Content>
  </S.Page>
}
