import { useEffect, useState } from 'react'
import { getReport, getReportAnalysis } from '../services/reports'
import type { InventoryReport, ReportAnalysis } from '../types/report'
export function useReport(id: number | null) {
  const [revision, setRevision] = useState(0)
  const [state, setState] = useState<{ id: number | null; report: InventoryReport | null; analysis: ReportAnalysis | null; loading: boolean; error: string; planError: string; paused: boolean }>({ id: null, report: null, analysis: null, loading: true, error: '', planError: '', paused: false })
  useEffect(() => {
    if (!id) return
    const controller = new AbortController()
    let timer: ReturnType<typeof setTimeout> | undefined
    const started = Date.now()
    async function load() {
      try {
        const report = await getReport(id!, controller.signal)
        if (controller.signal.aborted) return
        setState({ id, report, analysis: null, loading: false, error: '', planError: '', paused: false })
        if (report.status === 'PROCESSING') {
          if (Date.now() - started < 600000) timer = setTimeout(() => { void load() }, 5000)
          else setState(current => ({ ...current, paused: true }))
          return
        }
        if (['PROCESSING_FAILED', 'INSUFFICIENT_DATA'].includes(report.status)) return
        try {
          const analysis = await getReportAnalysis(id!, controller.signal)
          if (!controller.signal.aborted) setState(current => ({ ...current, analysis, planError: analysis ? '' : 'O plano de melhoria ainda não está disponível. Atualize a consulta em instantes.' }))
        } catch (error) {
          if (!controller.signal.aborted) setState(current => ({ ...current, planError: (error as Error).message }))
        }
      } catch (error) {
        if (!controller.signal.aborted) setState(current => ({ ...current, id, report: current.id === id ? current.report : null, analysis: current.id === id ? current.analysis : null, loading: false, error: (error as Error).message }))
      }
    }
    void load()
    return () => { controller.abort(); clearTimeout(timer) }
  }, [id, revision])
  return { ...(state.id === id ? state : { report: null, analysis: null, loading: true, error: '', planError: '', paused: false }), retry: () => setRevision(value => value + 1) }
}
