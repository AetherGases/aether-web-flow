import { z } from 'zod'
import type { Config } from '../config/index.ts'
import type { AuthSession } from '../types/auth.ts'
import { ApiError } from '../middleware/errors.ts'
import { createHttpClient } from './http.ts'

export const reportStatusSchema = z.enum(['UNDER_REVIEW', 'APPROVED', 'REJECTED', 'PROCESSING', 'PROCESSING_FAILED', 'INSUFFICIENT_DATA', 'REQUESTED', 'ISSUED'])
const name = z.string().trim().min(3).max(150).regex(/^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:\s+[A-Za-zÀ-ÖØ-öø-ÿ]+)*$/)
export const registerReportSchema = z.object({
  name, consolidationApproach: z.enum(['Participação acionária', 'Controle operacional', 'Controle financeiro']),
  fileName: z.string().min(3).max(150).regex(/\.xlsx$/i), path: z.string().url().max(2048),
}).strict()
const signatureSchema = z.object({ signature: z.string().min(1), timestamp: z.number().int().positive(), apiKey: z.string().min(1), cloudName: z.string().regex(/^[a-zA-Z0-9_-]+$/), cloudinaryFolder: z.string().min(1), cloudinaryResourceType: z.literal('raw') })
const catalog = z.object({ id: z.number().int().positive(), name: z.string() })
const quantity = z.number().finite().nonnegative()
const detailSchema = z.object({
  id: z.number().int().positive(), name: z.string(), status: reportStatusSchema, type: z.enum(['INPUT', 'OUTPUT']),
  description: z.string().nullish(), consolidationApproach: z.string().nullish(),
  inventoryPeriodStart: z.iso.date().nullish(), inventoryPeriodEnd: z.iso.date().nullish(),
  validationMessage: z.string().nullish(),
  emissions: z.array(z.object({ id: z.number().int().positive(), quantityCo2e: quantity, isReduction: z.boolean(), scope: catalog.nullish(), category: catalog.nullish(), gas: catalog.extend({ formula: z.string().nullish() }).nullish() })).max(10000).default([]),
  reductions: z.array(z.object({ id: z.number().int().positive(), quantityCo2e: quantity, category: catalog.nullish(), isReduction: z.boolean() })).max(10000).default([]),
})
const planSchema = z.object({ defined_problem: z.string(), solving_method: z.string(), reasoning: z.string(), recommended_gases: z.array(z.object({ scope: z.number().int().min(1).max(3), emission: quantity, reduction_percentage: z.number().min(0).max(100), name: z.string() })).max(2).default([]) })
function parse<T>(schema: z.ZodType<T>, value: unknown): T {
  const result = schema.safeParse(value)
  if (!result.success) throw new ApiError(502, 'REPORT_CONTRACT_INVALID', 'O serviço retornou dados de relatório incompatíveis.')
  return result.data
}
export function validUploadedPath(value: string, grant: { cloudName: string; cloudinaryFolder: string }): boolean {
  try {
  const url = new URL(value)
  const prefix = '/' + grant.cloudName + '/raw/upload/'
  const pathname = decodeURIComponent(url.pathname)
  const remainder = pathname.slice(prefix.length).replace(/^v\d+\//, '')
  return url.origin === 'https://res.cloudinary.com' && !url.username && !url.password && !url.search && !url.hash &&
    pathname.startsWith(prefix) && remainder.startsWith(grant.cloudinaryFolder + '/') && /\.xlsx$/i.test(pathname) && !pathname.split('/').some(part => part === '..')
  } catch { return false }
}
export function createReportService(config: Config) {
  const options = (auth: AuthSession, requestId: string) => ({ method: 'GET' as const, token: auth.accessToken, requestId })
  function inventory() {
    if (!config.MS_INVENTORY_URL) throw new ApiError(503, 'REPORT_NOT_CONFIGURED', 'O serviço de relatórios ainda não está configurado.')
    return createHttpClient(config.MS_INVENTORY_URL, config.UPSTREAM_TIMEOUT_MS, 'INVENTORY', 4 * 1024 * 1024)
  }
  async function detail(id: number, auth: AuthSession, requestId: string) {
    const request = inventory()
    let value: unknown
    try { value = await request('/api/inventories/mine/' + id, { ...options(auth, requestId), allowNotFound: true }) }
    catch (error) { if (!(error instanceof ApiError && error.status === 403 && auth.user.role === 'administrator')) throw error }
    if (value == null && auth.user.role === 'administrator') value = await request('/api/inventories/reviewed/' + id, { ...options(auth, requestId), allowNotFound: true })
    if (value == null) throw new ApiError(404, 'REPORT_NOT_FOUND', 'Relatório não encontrado ou sem acesso.')
    const report = parse(detailSchema, value)
    if (report.id !== id || report.type !== 'INPUT') throw new ApiError(404, 'REPORT_NOT_FOUND', 'Relatório não encontrado ou sem acesso.')
    return report
  }
  return {
    async signature(auth: AuthSession, requestId: string) {
      if (!config.MS_CLOUDINARY_URL) throw new ApiError(503, 'UPLOAD_NOT_CONFIGURED', 'O envio de relatórios ainda não está configurado.')
      const request = createHttpClient(config.MS_CLOUDINARY_URL, config.UPSTREAM_TIMEOUT_MS, 'INVENTORY')
      return parse(signatureSchema, await request('/api/cloudinary/upload-signature?fileType=XLSX', options(auth, requestId)))
    },
    async register(input: z.infer<typeof registerReportSchema>, auth: AuthSession, requestId: string) {
      return parse(z.object({ id: z.number().int().positive() }), await inventory()('/api/inventories', { ...options(auth, requestId), method: 'POST', body: input }))
    },
    detail,
    async plan(id: number, auth: AuthSession, requestId: string) {
      const report = await detail(id, auth, requestId)
      if (['PROCESSING', 'PROCESSING_FAILED', 'INSUFFICIENT_DATA'].includes(report.status)) return null
      if (!config.MS_AI_URL) throw new ApiError(503, 'ANALYSIS_NOT_CONFIGURED', 'A consulta da análise ainda não está configurada.')
      const request = createHttpClient(config.MS_AI_URL, config.AI_TIMEOUT_MS, 'AI', 1024 * 1024)
      const value = await request(config.MS_AI_PATH_PREFIX + '/ai/report/' + id, { ...options(auth, requestId), allowNotFound: true })
      return value === null ? null : parse(planSchema, value)
    },
  }
}
