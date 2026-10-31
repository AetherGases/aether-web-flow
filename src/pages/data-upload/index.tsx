import { useTranslation } from '../../hooks/useTranslation'
import { type ChangeEvent, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getAnalysisScope } from '../../utils/analysis'

import uploadFileIcon from '../../assets/icons/data-upload/upload-file.svg'
import Sidebar from '../../components/Sidebar'
import * as S from './styles'

const acceptedExtensions = ['xlsx']

function DataUploadPage() {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const [searchParams] = useSearchParams()
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState('')
  if (!user) return null
  const scope = getAnalysisScope(user.role, searchParams.get('scope'))

  function openFileSelector() {
    setErrorMessage('')
    inputRef.current?.click()
  }

  function handleFileSelection(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    const extension = selectedFile.name.split('.').pop()?.toLowerCase() ?? ''

    if (!acceptedExtensions.includes(extension)) {
      setErrorMessage(t("Selecione um arquivo Excel (.xlsx)."))
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

      <S.Content>
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

          <S.FileInput
            ref={inputRef}
            type="file"
            tabIndex={-1}
            aria-label={t("Selecionar arquivo")}
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
