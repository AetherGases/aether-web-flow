import { useEffect, useRef, useState } from 'react'
import { registerReport, uploadReport } from '../services/reports'
import { validateReportFile, validateReportForm } from '../utils/reports'

interface ReportUploadForm { file: File | null; name: string; approach: string }
interface ReportUploadState {
  form: ReportUploadForm
  phase: 'idle' | 'uploading' | 'registering' | 'uncertain'
  error: string
}
interface UseReportUploadResult extends ReportUploadState {
  sending: boolean
  setName: (name: string) => void
  setApproach: (approach: string) => void
  selectFile: (file: File) => boolean
  submit: () => Promise<number | null>
}

export function useReportUpload(): UseReportUploadResult {
  const [state, setState] = useState<ReportUploadState>({ form: { file: null, name: '', approach: '' }, phase: 'idle', error: '' })
  const active = useRef<AbortController | null>(null)
  useEffect(() => () => active.current?.abort(), [])
  function updateForm(update: Partial<ReportUploadForm>) {
    setState(current => ({ ...current, form: { ...current.form, ...update } }))
  }
  function selectFile(file: File): boolean {
    const error = validateReportFile(file)
    setState(current => ({ ...current, form: { ...current.form, file: error ? null : file }, error: error ?? '' }))
    return !error
  }
  async function submit(): Promise<number | null> {
    if (active.current || state.phase === 'uncertain' || !state.form.file) return null
    const { file, name, approach } = state.form
    const error = validateReportForm({ file, name, approach })
    if (error) { setState(current => ({ ...current, error })); return null }
    const controller = new AbortController()
    active.current = controller
    setState(current => ({ ...current, phase: 'uploading', error: '' }))
    let registering = false
    try {
      const path = await uploadReport(file, controller.signal)
      if (controller.signal.aborted) return null
      registering = true
      setState(current => ({ ...current, phase: 'registering' }))
      const report = await registerReport({ name: name.trim(), consolidationApproach: approach, fileName: file.name, path }, controller.signal)
      return controller.signal.aborted ? null : report.id
    } catch (error) {
      if (!controller.signal.aborted) setState(current => ({ ...current,
        error: registering ? 'Não foi possível confirmar o registro. Confira seus relatórios antes de fazer um novo envio.' : error instanceof Error ? error.message : 'Não foi possível armazenar o Excel. Tente novamente.',
        phase: registering ? 'uncertain' : 'idle',
      }))
      return null
    } finally { active.current = null }
  }
  return { ...state, sending: state.phase === 'uploading' || state.phase === 'registering',
    setName: name => updateForm({ name }), setApproach: approach => updateForm({ approach }), selectFile, submit }
}
