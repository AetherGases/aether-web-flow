import type { UserRole } from '../types/auth.ts'
import { z } from 'zod'
import type { Config } from '../config/index.ts'
import { ApiError } from '../middleware/errors.ts'
import { createHttpClient } from './http.ts'

const status = z.enum(['UNDER_REVIEW', 'APPROVED', 'REJECTED', 'PROCESSING', 'PROCESSING_FAILED', 'REQUESTED', 'ISSUED'])
const inventory = z.object({
  id: z.number().int().positive(), name: z.string().min(1),
  createdAt: z.iso.datetime({ local: true, offset: true }),
  status, type: z.enum(['INPUT', 'OUTPUT']),
})
const counts = z.object({ reviewedCount: z.number().int().nonnegative().safe(), submittedCount: z.number().int().nonnegative().safe() })
const history = z.object({ inventories: z.array(inventory).max(6), totalCount: z.number().int().nonnegative().safe() })

type Section<T> = { status: 'ready'; data: T } | { status: 'error'; error: { code: string; message: string } }

async function section<T>(operation: () => Promise<unknown>, schema: z.ZodType<T>): Promise<Section<T>> {
  try {
    const value = schema.safeParse(await operation())
    if (!value.success) throw new ApiError(502, 'INVENTORY_CONTRACT_INVALID', 'Os dados recebidos não puderam ser exibidos.')
    return { status: 'ready', data: value.data }
  } catch (error) {
    if (error instanceof ApiError) {
      if ([401, 403].includes(error.status)) return { status: 'error', error: { code: 'INVENTORY_ACCESS_DENIED', message: 'Não foi possível autorizar esta consulta de relatórios.' } }
      return { status: 'error', error: { code: error.code, message: error.message } }
    }
    throw error
  }
}

export function createOverviewService(config: Config) {
  return async (accessToken: string, requestId: string, role: UserRole) => {
    if (!config.MS_INVENTORY_URL) {
      const unavailable = { status: 'error' as const, error: { code: 'INVENTORY_NOT_CONFIGURED', message: 'Esta consulta ainda não está disponível.' } }
      return { scope: 'personal' as const, counts: unavailable, history: unavailable, lastSubmitted: unavailable, indicators: { awaitingReview: role === 'analyst' ? unavailable : null, approved: role === 'analyst' ? unavailable : null, processingFailed: role === 'analyst' ? unavailable : null, pendingReview: role === 'administrator' ? unavailable : null } }
    }
    const request = createHttpClient(config.MS_INVENTORY_URL, config.UPSTREAM_TIMEOUT_MS, 'INVENTORY')
    const options = { method: 'GET' as const, token: accessToken, requestId }
    const [countsResult, historyResult, lastResult, awaitingReview, approved, processingFailed, pendingReview] = await Promise.all([
      section(() => request('/api/inventories/count', options), counts),
      section(() => request('/api/inventories/mine?take=6&skip=0', options), history),
      section(() => request('/api/inventories/mine/last', { ...options, allowNotFound: true }), inventory.nullable()),
      role === 'analyst' ? section(() => request('/api/inventories/mine?status=UNDER_REVIEW&take=1&skip=0', options), z.object({ totalCount: z.number().int().nonnegative().safe() }).transform((value) => value.totalCount)) : null,
      role === 'analyst' ? section(() => request('/api/inventories/mine?status=APPROVED&take=1&skip=0', options), z.object({ totalCount: z.number().int().nonnegative().safe() }).transform((value) => value.totalCount)) : null,
      role === 'analyst' ? section(() => request('/api/inventories/mine?status=PROCESSING_FAILED&take=1&skip=0', options), z.object({ totalCount: z.number().int().nonnegative().safe() }).transform((value) => value.totalCount)) : null,
      role === 'administrator' ? section(() => request('/api/inventories/pending?take=1&skip=0', options), z.object({ totalCount: z.number().int().nonnegative().safe() }).transform((value) => ({ count: value.totalCount, scope: 'department' as const }))) : null,
    ])
    return { scope: 'personal' as const, counts: countsResult, history: historyResult, lastSubmitted: lastResult, indicators: { awaitingReview, approved, processingFailed, pendingReview } }
  }
}