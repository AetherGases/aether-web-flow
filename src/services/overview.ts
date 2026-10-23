import { HttpError, request } from './http.ts'
import { inventoryStatusLabels, type InventoryOverview, type InventorySummary, type OverviewSection } from '../types/inventory.ts'

function object(value: unknown): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) throw new Error('Resposta de relatórios inválida.')
  return value as Record<string, unknown>
}
function count(value: unknown): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 0) throw new Error('Contagem de relatórios inválida.')
  return value
}
function inventory(value: unknown): InventorySummary {
  const data = object(value)
  const id = count(data.id)
  if (id === 0 || typeof data.name !== 'string' || !data.name || typeof data.createdAt !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}T/.test(data.createdAt) || !Number.isFinite(Date.parse(data.createdAt)) ||
      typeof data.status !== 'string' || !Object.hasOwn(inventoryStatusLabels, data.status) ||
      (data.type !== 'INPUT' && data.type !== 'OUTPUT')) throw new Error('Relatório incompatível com a aplicação.')
  return { id, name: data.name, createdAt: data.createdAt, status: data.status as InventorySummary['status'], type: data.type }
}
function section<T>(value: unknown, parse: (data: unknown) => T): OverviewSection<T> {
  const result = object(value)
  if (result.status === 'ready') return { status: 'ready', data: parse(result.data) }
  if (result.status === 'error') {
    const error = object(result.error)
    if (typeof error.code === 'string' && error.code && typeof error.message === 'string' && error.message) {
      return { status: 'error', error: { code: error.code, message: error.message } }
    }
  }
  throw new Error('Estado da seção de relatórios inválido.')
}
export function parseOverview(value: unknown): InventoryOverview {
  const data = object(value)
  if (data.scope !== 'personal') throw new Error('Visão geral incompatível com a aplicação.')
  return {
    scope: 'personal',
    indicators: (() => {
      const indicators = object(data.indicators)
      return {
        awaitingReview: indicators.awaitingReview === null ? null : section(indicators.awaitingReview, count),
        approved: indicators.approved === null ? null : section(indicators.approved, count),
        processingFailed: indicators.processingFailed === null ? null : section(indicators.processingFailed, count),
        pendingReview: indicators.pendingReview === null ? null : section(indicators.pendingReview, (value) => {
          const pending = object(value)
          if (pending.scope !== 'department') throw new Error('Escopo de revisão inválido.')
          return { count: count(pending.count), scope: 'department' as const }
        }),
      }
    })(),
    counts: section(data.counts, (value) => {
      const counts = object(value)
      return { reviewedCount: count(counts.reviewedCount), submittedCount: count(counts.submittedCount) }
    }),
    history: section(data.history, (value) => {
      const history = object(value)
      if (!Array.isArray(history.inventories) || history.inventories.length > 6) throw new Error('Histórico inválido.')
      return { inventories: history.inventories.map(inventory), totalCount: count(history.totalCount) }
    }),
    lastSubmitted: section(data.lastSubmitted, (value) => value === null ? null : inventory(value)),
  }
}
export async function getOverview(signal?: AbortSignal): Promise<InventoryOverview> {
  try {
    return parseOverview(await request('/overview', { signal }))
  } catch (error: unknown) {
    if (error instanceof HttpError || (error instanceof DOMException && error.name === 'AbortError')) throw error
    throw new HttpError(502, 'INVALID_OVERVIEW_RESPONSE', 'O servidor retornou informações de relatórios incompatíveis.')
  }
}