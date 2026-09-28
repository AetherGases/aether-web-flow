import { type ChangeEvent, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import uploadFileIcon from '../../assets/icons/data-upload/upload-file.svg'
import Sidebar from '../../components/Sidebar'
import type { OverviewData } from '../../types/overview'
import * as S from './styles'

const acceptedExtensions = ['csv', 'xls', 'xlsx', 'json']

interface DataUploadPageProps {
  data: OverviewData
  onLogout: () => void
}

function DataUploadPage({ data, onLogout }: DataUploadPageProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState('')

  function openFileSelector() {
    setErrorMessage('')
    inputRef.current?.click()
  }

  function handleFileSelection(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    const extension = selectedFile.name.split('.').pop()?.toLowerCase() ?? ''

    if (!acceptedExtensions.includes(extension)) {
      setErrorMessage('Selecione um arquivo CSV, XLS, XLSX ou JSON.')
      event.target.value = ''
      return
    }

    navigate('/data-analysis', {
      state: { uploadedFileName: selectedFile.name },
    })
  }

  return (
    <S.Page>
      <Sidebar
        userName={data.userName}
        userRole={data.role}
        onLogout={onLogout}
      />

      <S.Content>
        <S.Title>Análise - Plantas individuais</S.Title>

        <S.UploadPanel>
          <S.UploadIcon aria-hidden="true">
            <img src={uploadFileIcon} alt="" />
          </S.UploadIcon>

          <S.UploadText>
            <strong>Carregue seus dados</strong>
            <span>Aceita CSV, XLSX ou JSON</span>
          </S.UploadText>

          <S.FileInput
            ref={inputRef}
            type="file"
            accept=".csv,.xls,.xlsx,.json,text/csv,application/json,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            onChange={handleFileSelection}
          />

          <S.SelectFileButton type="button" onClick={openFileSelector}>
            Selecionar arquivo
          </S.SelectFileButton>

          {errorMessage && <S.ErrorMessage role="alert">{errorMessage}</S.ErrorMessage>}
        </S.UploadPanel>
      </S.Content>
    </S.Page>
  )
}

export default DataUploadPage
