import { HttpError, request } from './http.ts'
import { inventoryStatusLabels, type InventoryOverview, type OrganizationOverview, type InventorySummary, type OverviewSection } from '../types/inventory.ts'

function count(value: number): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 0) throw new Error('Contagem de relatórios inválida.')
  return value
}
function inventory(data: InventorySummary): InventorySummary {
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Relatório incompatível com a aplicação.')
  const id = count(data.id)
  if (id === 0 || typeof data.name !== 'string' || !data.name || typeof data.createdAt !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}T/.test(data.createdAt) || !Number.isFinite(Date.parse(data.createdAt)) ||
      typeof data.status !== 'string' || !Object.hasOwn(inventoryStatusLabels, data.status) ||
      (data.type !== 'INPUT' && data.type !== 'OUTPUT')) throw new Error('Relatório incompatível com a aplicação.')
  return { id, name: data.name, createdAt: data.createdAt, status: data.status, type: data.type }
}
function section<T>(result: OverviewSection<T>, parse: (data: T) => T): OverviewSection<T> {
  if (!result || typeof result !== 'object' || Array.isArray(result)) throw new Error('Estado da seção de relatórios inválido.')
  if (result.status === 'ready') return { status: 'ready', data: parse(result.data) }
  if (result.status === 'error') {
    const error = result.error
    if (error && typeof error.code === 'string' && error.code && typeof error.message === 'string' && error.message) {
      return { status: 'error', error: { code: error.code, message: error.message } }
    }
  }
  throw new Error('Estado da seção de relatórios inválido.')
}
export function parseOverview(data: InventoryOverview): InventoryOverview {
  if (!data || data.scope !== 'personal' || !data.indicators) throw new Error('Visão geral incompatível com a aplicação.')
  return {
    scope: 'personal',
    indicators: (() => {
      const indicators = data.indicators
      return {
        awaitingReview: indicators.awaitingReview === null ? null : section(indicators.awaitingReview, count),
        approved: indicators.approved === null ? null : section(indicators.approved, count),
        processingFailed: indicators.processingFailed === null ? null : section(indicators.processingFailed, count),
        pendingReview: indicators.pendingReview === null ? null : section(indicators.pendingReview, (value) => {
          const pending = value
          if (!pending || pending.scope !== 'department') throw new Error('Escopo de revisão inválido.')
          return { count: count(pending.count), scope: 'department' as const }
        }),
      }
    })(),
    counts: section(data.counts, (value) => {
      const counts = value
      if (!counts) throw new Error('Contagens de relatórios inválidas.')
      return { reviewedCount: count(counts.reviewedCount), submittedCount: count(counts.submittedCount) }
    }),
    history: section(data.history, (value) => {
      const history = value
      if (!history || !Array.isArray(history.inventories) || history.inventories.length > 6) throw new Error('Histórico inválido.')
      return { inventories: history.inventories.map(inventory), totalCount: count(history.totalCount) }
    }),
    lastSubmitted: section(data.lastSubmitted, (value) => value === null ? null : inventory(value)),
  }
}
export async function getOverview(signal?: AbortSignal): Promise<InventoryOverview> {
  try {
    return parseOverview(await request('/overview', { signal }) as InventoryOverview)
  } catch (error) {
    if (error instanceof HttpError || (error instanceof DOMException && error.name === 'AbortError')) throw error
    throw new HttpError(502, 'INVALID_OVERVIEW_RESPONSE', 'O servidor retornou informações de relatórios incompatíveis.')
  }
}

export function parseOrganizationOverview(data: OrganizationOverview): OrganizationOverview {
  if (!data || data.scope !== 'department') throw new Error('Visão geral incompatível com a aplicação.')
  return {
    scope: 'department',
    reports: section(data.reports, (value) => {
      if (!value || !Array.isArray(value.inventories) || value.inventories.length > 6) throw new Error('Histórico inválido.')
      return { inventories: value.inventories.map(inventory), totalCount: count(value.totalCount) }
    }),
    underReview: section(data.underReview, count),
    approved: section(data.approved, count),
    rejected: section(data.rejected, count),
  }
}

export async function getOrganizationOverview(signal?: AbortSignal): Promise<OrganizationOverview> {
  try {
    return parseOrganizationOverview(await request('/overview/organization', { signal }) as OrganizationOverview)
  } catch (error) {
    if (error instanceof HttpError || (error instanceof DOMException && error.name === 'AbortError')) throw error
    throw new HttpError(502, 'INVALID_OVERVIEW_RESPONSE', 'O servidor retornou informações de relatórios incompatíveis.')
  }
}
