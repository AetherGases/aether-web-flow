import { request } from './http'
import type { InventoryReport, ReportAnalysis, ReportInput, UploadSignature } from '../types/report'
export async function getReport(id: number, signal?: AbortSignal): Promise<InventoryReport> { return await request('/reports/' + id, { signal }) as InventoryReport }
export async function getReportAnalysis(id: number, signal?: AbortSignal): Promise<ReportAnalysis | null> { return await request('/reports/' + id + '/analysis', { signal }) as ReportAnalysis | null }
export async function registerReport(input: ReportInput): Promise<{ id: number }> { return await request('/reports', { method: 'POST', body: JSON.stringify(input) }) as { id: number } }
export async function uploadReport(file: File): Promise<string> {
  const signature = await request('/reports/upload-signature', { method: 'POST', body: '{}' }) as UploadSignature
  const body = new FormData()
  body.append('file', file)
  body.append('signature', signature.signature)
  body.append('timestamp', String(signature.timestamp))
  body.append('api_key', signature.apiKey)
  body.append('folder', signature.cloudinaryFolder)
  const response = await fetch('https://api.cloudinary.com/v1_1/' + encodeURIComponent(signature.cloudName) + '/raw/upload', { method: 'POST', credentials: 'omit', body, signal: AbortSignal.timeout(120000) })
  if (!response.ok) throw new Error('Não foi possível armazenar o Excel. Tente novamente.')
  const result = await response.json() as { secure_url?: string }
  if (!result.secure_url?.startsWith('https://res.cloudinary.com/')) throw new Error('O armazenamento retornou um arquivo inválido.')
  return result.secure_url
}

