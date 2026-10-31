import { useTranslation } from '../../hooks/useTranslation'
import { type ChangeEvent, useRef, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getAnalysisScope, isAnalysisScope, validateReportFileName } from '../../utils/analysis'

import uploadFileIcon from '../../assets/icons/data-upload/upload-file.svg'
import Sidebar from '../../components/Sidebar'
import ErrorPage from '../error'
import * as S from './styles'

function DataUploadPage() {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const { scope: routeScope } = useParams<{ scope: string }>()
  const [searchParams] = useSearchParams()
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState('')
  if (!user) return null
  if (routeScope !== undefined && (!isAnalysisScope(routeScope) || (routeScope === 'company' && user.role !== 'administrator'))) return <ErrorPage />
  const scope = getAnalysisScope(user.role, routeScope ?? searchParams.get('scope'))

  function openFileSelector() {
    setErrorMessage('')
    inputRef.current?.click()
  }

  function handleFileSelection(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    const validationError = validateReportFileName(selectedFile.name)
    if (validationError) {
      setErrorMessage(validationError)
      event.target.value = ''
      return
    }

    navigate(`/data-analysis?scope=${scope}`, {
      state: { uploadedFileName: selectedFile.name },
    })
  }

  return (
    <S.Page>
      <Sidebar
        userName={user.name}
        userRole={user.role}
        onLogout={() => { void logout() }}
      />

      <S.Content id="main-content">
        {user.role === 'administrator' && <S.BackLink as={Link} to="/data-analysis/select"><span aria-hidden="true">←</span> {t('Voltar à escolha de análise')}</S.BackLink>}
        <S.Eyebrow>{t('Análise de dados')}</S.Eyebrow>
        <S.Title>{scope === 'company' ? t("Análise - Empresa completa") : t("Análise - Plantas individuais")}</S.Title>

        <S.UploadPanel>
          <S.UploadIcon aria-hidden="true">
            <img data-theme-icon src={uploadFileIcon} alt="" />
          </S.UploadIcon>

          <S.UploadText>
            <strong>{t("Carregue seus dados")}</strong>
            <span>{t("Aceita apenas Excel (.xlsx)")}</span>
          </S.UploadText>

          <S.FileLabel htmlFor="analysis-report">{t("Selecionar arquivo")}</S.FileLabel>
          <S.FileInput
            id="analysis-report"
            ref={inputRef}
            type="file"
            tabIndex={-1}
            accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            onChange={handleFileSelection}
          />

          <S.SelectFileButton type="button" onClick={openFileSelector}>
            {t("Selecionar arquivo")}</S.SelectFileButton>

          {errorMessage && <S.ErrorMessage role="alert">{t(errorMessage)}</S.ErrorMessage>}
        </S.UploadPanel>
      </S.Content>
    </S.Page>
  )
}

export default DataUploadPage
